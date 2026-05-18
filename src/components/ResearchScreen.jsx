import { useEffect, useRef, useState } from 'react'
import { analyzeUrl } from '../utils/businessAnalyzer'
import './ResearchScreen.css'

const RESEARCH_MESSAGES = [
  'Connecting to business profile…',
  'Scanning website content…',
  'Identifying business type…',
  'Mapping customer touchpoints…',
  'Designing your agent team…',
]

export default function ResearchScreen({ url, onBusinessFound, onAgentSpawned, onComplete }) {
  const [messages, setMessages] = useState([RESEARCH_MESSAGES[0]])
  const [business, setBusiness] = useState(null)
  const [agentCount, setAgentCount] = useState(0)
  const [sources, setSources] = useState([])
  const [sourcesOpen, setSourcesOpen] = useState(true)
  const [dismissed, setDismissed] = useState(new Set())
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    let msgIdx = 1
    const msgInterval = setInterval(() => {
      if (msgIdx < RESEARCH_MESSAGES.length) {
        setMessages(prev => [...prev, RESEARCH_MESSAGES[msgIdx++]])
      } else {
        clearInterval(msgInterval)
      }
    }, 850)

    analyzeUrl(url, (event) => {
      if (event.type === 'source_found') {
        setSources(prev => [...prev, event.data])
      } else if (event.type === 'business_identified') {
        clearInterval(msgInterval)
        setBusiness(event.data)
        onBusinessFound(event.data)
      } else if (event.type === 'agent_spawned') {
        setAgentCount(c => c + 1)
        onAgentSpawned(event.data)
      } else if (event.type === 'spawn_complete') {
        setTimeout(onComplete, 500)
      }
    })

    return () => clearInterval(msgInterval)
  }, [])

  const visibleSources = sources.filter(s => !dismissed.has(s.label))
  const dismissSource = (label) => setDismissed(prev => new Set([...prev, label]))

  return (
    <div className="research-root">
      <nav className="research-nav">
        <div className="research-nav-logo">
          <div className="research-nav-box">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          HyperAgent
        </div>
      </nav>

      <div className="research-body">
        <div className="research-card">
          <div className="scan-indicator">
            <div className="scan-bar"><div className="scan-bar-fill" /></div>
            <span className="scan-label">Analyzing</span>
          </div>

          {business && (
            <div className="business-badge">
              <span className="business-emoji">{business.emoji}</span>
              <div>
                <div className="business-name">{business.name}</div>
                <div className="business-type">{business.businessType}</div>
              </div>
            </div>
          )}

          <div className="messages-list">
            {messages.map((msg, i) => (
              <div key={i} className="message-line" style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="message-check">✓</span>
                {msg}
              </div>
            ))}
          </div>

          {agentCount > 0 && (
            <div className="agent-counter">
              <span className="agent-counter-num">{agentCount}</span>
              <span className="agent-counter-dot" />
              {agentCount === 1 ? 'agent created' : 'agents created'}
            </div>
          )}

          {sources.length > 0 && (
            <div className="sources-panel">
              <button
                className="sources-header"
                onClick={() => setSourcesOpen(v => !v)}
              >
                <span className="sources-title">
                  <SourcesIcon />
                  Sources
                  <span className="sources-badge">{sources.length}</span>
                </span>
                <span className="sources-toggle">{sourcesOpen ? '▲' : '▼'}</span>
              </button>

              {sourcesOpen && (
                <div className="sources-list">
                  {sources.map((src, i) => (
                    <div
                      key={src.label}
                      className={`source-card${dismissed.has(src.label) ? ' source-card--dismissed' : ''}`}
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      <div className="source-icon-wrap">
                        <SourceIcon type={src.icon} />
                      </div>
                      <div className="source-info">
                        <div className="source-label">{src.label}</div>
                        <div className="source-url">{src.url}</div>
                        <div className="source-snippet">{src.snippet}</div>
                      </div>
                      <button
                        className="source-dismiss"
                        onClick={() => dismissSource(src.label)}
                        title="Dismiss"
                      >×</button>
                    </div>
                  ))}
                  {visibleSources.length === 0 && dismissed.size > 0 && (
                    <div className="sources-empty">
                      All sources hidden.{' '}
                      <button className="sources-restore" onClick={() => setDismissed(new Set())}>Restore</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SourcesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function SourceIcon({ type }) {
  const base = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'maps':
      return <svg {...base}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    case 'web':
      return <svg {...base}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    case 'yelp':
      return <svg {...base}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>
    case 'facebook':
      return <svg {...base}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    case 'linkedin':
      return <svg {...base}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    default:
      return <svg {...base}><circle cx="12" cy="12" r="10"/></svg>
  }
}
