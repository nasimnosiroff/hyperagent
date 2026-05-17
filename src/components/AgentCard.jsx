import { useEffect, useState } from 'react'
import './AgentCard.css'

const ICONS = {
  headset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
    </svg>
  ),
}

function useTypewriter(text, delay = 0, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(iv); setDone(true) }
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [text, delay, speed])

  return { displayed, done }
}

function TaskLine({ text, delay }) {
  const { displayed, done } = useTypewriter(text, delay)
  return (
    <div className="agent-task">
      <span className="task-bullet" />
      <span>{displayed}{!done && <span className="cursor" />}</span>
    </div>
  )
}

export default function AgentCard({ agent, animDelay = 0, isCustom = false, onCustomSubmit, onClick }) {
  const [isActive, setIsActive] = useState(!isCustom)
  const [expanded, setExpanded] = useState(false)
  const [customText, setCustomText] = useState('')
  const [configuring, setConfiguring] = useState(false)
  const [customDone, setCustomDone] = useState(false)

  function handleCustomSubmit(e) {
    e?.preventDefault()
    if (!customText.trim()) return
    setExpanded(false)
    setConfiguring(true)
    setTimeout(() => {
      setConfiguring(false)
      setCustomDone(true)
      setIsActive(true)
      onCustomSubmit?.(customText)
    }, 1600)
  }

  const accentColor = agent.color || 'var(--accent)'

  if (isCustom && !customDone) {
    return (
      <div
        className="agent-card agent-card--custom"
        style={{ '--card-accent': accentColor, animationDelay: `${animDelay}ms` }}
        onClick={() => !configuring && setExpanded(true)}
      >
        {configuring ? (
          <div className="custom-configuring">
            <div className="spinner" />
            <span>Configuring agent…</span>
          </div>
        ) : expanded ? (
          <form className="custom-form" onSubmit={handleCustomSubmit} onClick={e => e.stopPropagation()}>
            <div className="custom-form-label">Describe what this agent should do:</div>
            <textarea
              className="custom-textarea"
              placeholder="e.g. Call patients after discharge to check on them"
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              autoFocus
              rows={3}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleCustomSubmit(e) }}
            />
            <button className="custom-submit-btn" type="submit">Add Agent →</button>
          </form>
        ) : (
          <>
            <div className="card-icon-wrap" style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <PlusIcon />
            </div>
            <div className="card-name" style={{ color: 'var(--text-muted)' }}>Add Custom Agent</div>
            <div className="card-role">Describe a task in plain English</div>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={`agent-card ${isActive ? 'agent-card--active' : ''}`}
      style={{ '--card-accent': accentColor, animationDelay: `${animDelay}ms`, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Status dot */}
      <div className={`status-dot ${isActive ? 'status-dot--active' : ''}`} />

      {/* Icon */}
      <div className="card-icon-wrap" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}>
        {ICONS[agent.icon] || ICONS.gear}
      </div>

      {/* Name + role */}
      <div className="card-name">{agent.name}</div>
      <div className="card-role">{agent.role}</div>

      {/* Tasks with typewriter */}
      <div className="card-tasks">
        {agent.tasks.map((task, i) => (
          <TaskLine
            key={i}
            text={task}
            delay={animDelay + 200 + i * 280}
          />
        ))}
      </div>

      {/* Active badge */}
      {isActive && (
        <div className="active-badge" style={{ color: accentColor }}>
          <span className="active-dot" style={{ background: accentColor }} />
          ACTIVE
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
