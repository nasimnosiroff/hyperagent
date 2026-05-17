import { useState } from 'react'
import AgentCard from './AgentCard'
import AgentModal from './AgentModal'
import './SpawnScreen.css'

export default function SpawnScreen({ business, agents, onReset }) {
  const [customAgents, setCustomAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)

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
