import { useState } from 'react'
import AgentCard from './AgentCard'
import AgentModal from './AgentModal'
import './SpawnScreen.css'

export default function SpawnScreen({ business, agents, sources = [], onReset }) {
  const [customAgents, setCustomAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)

  function handleCustomSubmit(text) {
    setCustomAgents(prev => [...prev, {
      id: `custom-${Date.now()}`,
      name: text.split(' ').slice(0, 4).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' '),
      icon: 'gear',
      color: null,
      role: 'Custom Workflow',
      tasks: [text],
    }])
  }

  const allAgents = [...agents, ...customAgents]

  return (
    <div className="spawn-root">
      {/* Header */}
      <header className="spawn-header">
        <div className="spawn-logo">
          <div className="spawn-logo-box">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          HyperAgent
        </div>
        <button className="new-btn" onClick={onReset}>← New Business</button>
      </header>

      <div className="spawn-content">
        {/* Business headline */}
        {business && (
          <div className="spawn-headline">
            <span className="spawn-emoji">{business.emoji}</span>
            <div>
              <h1 className="spawn-title">
                Meet your team,{' '}
                <span className="spawn-title-name">{business.name}</span>
              </h1>
              <p className="spawn-subtitle">
                <span className="spawn-subtitle-dot" />
                {allAgents.length} agents live · {business.businessType}
              </p>
            </div>
          </div>
        )}

        {/* Research sources history */}
        {sources.length > 0 && (
          <div className="spawn-sources">
            <button className="spawn-sources-header" onClick={() => setSourcesOpen(v => !v)}>
              <span className="spawn-sources-title">
                <SourcesIcon />
                Research Sources
                <span className="spawn-sources-badge">{sources.length}</span>
              </span>
              <span className="spawn-sources-chevron">{sourcesOpen ? '▲' : '▼'}</span>
            </button>
            {sourcesOpen && (
              <div className="spawn-sources-list">
                {sources.map((src, i) => (
                  <div key={src.label + i} className="spawn-source-item" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="spawn-source-icon">
                      <SourceIcon type={src.icon} />
                    </div>
                    <div className="spawn-source-info">
                      <div className="spawn-source-label">{src.label}</div>
                      <div className="spawn-source-url">{src.url}</div>
                      <div className="spawn-source-snippet">{src.snippet}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Agent grid */}
        <div className="agents-grid">
          {allAgents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              animDelay={i * 100}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
          <AgentCard
            key="custom-add"
            agent={{ id: 'custom', name: '', icon: 'plus', role: '', tasks: [] }}
            animDelay={allAgents.length * 100}
            isCustom
            onCustomSubmit={handleCustomSubmit}
          />
        </div>
      </div>

      {/* Dark CTA — matches reference landing page's dark section */}
      <div className="spawn-cta">
        <div className="cta-inner">
          <div>
            <div className="cta-eyebrow">Ready to activate</div>
            <div className="cta-title">Your team is live.</div>
            <div className="cta-sub">
              Connect your phone number, email, and CRM to put your agents to work.
            </div>
          </div>
          <button className="cta-btn">Connect & Activate →</button>
        </div>
      </div>
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          businessName={business?.name}
          onClose={() => setSelectedAgent(null)}
          onSave={updated => {
            setSelectedAgent(null)
          }}
        />
      )}
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
