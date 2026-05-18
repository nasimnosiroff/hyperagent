import { classifyBusiness, extractBusinessName, AGENT_TEMPLATES } from './agentTemplates.js'

const delay = ms => new Promise(r => setTimeout(r, ms))

// Tries the real backend first; falls back to mock if unavailable
export async function analyzeUrl(url, onEvent) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok || !res.body) throw new Error('Backend unavailable')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split('\n\n')
      buffer = chunks.pop() ?? ''
      for (const chunk of chunks) {
        const line = chunk.trim()
        if (line.startsWith('data: ')) {
          try { onEvent(JSON.parse(line.slice(6))) } catch {}
        }
      }
    }
  } catch {
    await mockAnalyze(url, onEvent)
  }
}

function getMockSources(url) {
  const isMaps = url.includes('google.com/maps') || url.includes('maps.app.goo') || url.includes('goo.gl/maps')
  const raw = url.replace(/https?:\/\//, '').split('/')[0]
  const domain = raw.startsWith('www.') ? raw.slice(4) : raw

  const all = [
    isMaps
      ? { icon: 'maps',     label: 'Google Maps',   url: 'maps.google.com',   snippet: 'Listing · hours · reviews · photos' }
      : { icon: 'web',      label: 'Website',        url: domain,              snippet: 'Homepage · services · contact info'  },
    isMaps
      ? { icon: 'web',      label: 'Business Site',  url: domain || 'website', snippet: 'About · pricing · service pages'    }
      : { icon: 'maps',     label: 'Google Maps',    url: 'maps.google.com',   snippet: 'Location · hours · star rating'     },
    { icon: 'yelp',         label: 'Yelp',           url: 'yelp.com',          snippet: 'Reviews · photos · price range'     },
    { icon: 'facebook',     label: 'Facebook',       url: 'facebook.com',      snippet: 'Business page · customer posts'     },
    { icon: 'linkedin',     label: 'LinkedIn',       url: 'linkedin.com',      snippet: 'Company profile · team size'        },
  ]
  return all
}

async function mockAnalyze(url, onEvent) {
  const type = classifyBusiness(url)
  const template = AGENT_TEMPLATES[type]
  const name = extractBusinessName(url)
  const sources = getMockSources(url)

  onEvent({ type: 'source_found', data: sources[0] })
  await delay(420)
  onEvent({ type: 'source_found', data: sources[1] })
  await delay(380)
  onEvent({ type: 'source_found', data: sources[2] })

  await delay(300)
  onEvent({
    type: 'business_identified',
    data: { name, businessType: template.displayType, emoji: template.emoji },
  })

  await delay(500)
  onEvent({ type: 'source_found', data: sources[3] })
  await delay(350)
  onEvent({ type: 'source_found', data: sources[4] })

  for (const agent of template.agents) {
    await delay(650)
    onEvent({ type: 'agent_spawned', data: agent })
  }

  await delay(300)
  onEvent({ type: 'spawn_complete', data: { total: template.agents.length } })
}
