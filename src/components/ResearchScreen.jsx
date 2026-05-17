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
      if (event.type === 'business_identified') {
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
        </div>
      </div>
    </div>
  )
}
