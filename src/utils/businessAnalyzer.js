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

async function mockAnalyze(url, onEvent) {
  const type = classifyBusiness(url)
  const template = AGENT_TEMPLATES[type]
  const name = extractBusinessName(url)

  await delay(900)
  onEvent({
    type: 'business_identified',
    data: { name, businessType: template.displayType, emoji: template.emoji },
  })

  for (const agent of template.agents) {
    await delay(650)
    onEvent({ type: 'agent_spawned', data: agent })
  }

  await delay(300)
  onEvent({ type: 'spawn_complete', data: { total: template.agents.length } })
}
