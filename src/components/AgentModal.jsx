import { useState, useRef, useEffect } from 'react'
import './AgentModal.css'

const INTEGRATIONS = [
  { id: 'slack',     name: 'Slack',          icon: '💬', color: '#4A154B' },
  { id: 'telegram',  name: 'Telegram',       icon: '✈️', color: '#229ED9' },
  { id: 'whatsapp',  name: 'WhatsApp',       icon: '💚', color: '#25D366' },
  { id: 'email',     name: 'Email',          icon: '📧', color: '#EA4335' },
  { id: 'imessage',  name: 'iMessage',       icon: '💬', color: '#34C759' },
  { id: 'notion',    name: 'Notion',         icon: '📝', color: '#000000' },
  { id: 'hubspot',   name: 'HubSpot',        icon: '🟠', color: '#FF7A59' },
  { id: 'salesforce',name: 'Salesforce',     icon: '☁️', color: '#00A1E0' },
  { id: 'gcal',      name: 'Google Calendar',icon: '📅', color: '#4285F4' },
  { id: 'twilio',    name: 'Twilio',         icon: '📞', color: '#F22F46' },
  { id: 'zapier',    name: 'Zapier',         icon: '⚡', color: '#FF4A00' },
  { id: 'make',      name: 'Make',           icon: '🔧', color: '#6D00CC' },
]

const DEFAULT_PROMPTS = {
  headset:   'You are a friendly customer service representative. Answer questions about hours, services, and pricing. Be helpful, concise, and professional. Always greet callers warmly and resolve issues on the first contact.',
  calendar:  'You are a scheduling and reservations agent. Help customers book, modify, or cancel appointments. Always confirm details, send reminders 24 hours before, and handle cancellations gracefully.',
  star:      'You are an SEO and outreach agent. Draft responses to Google reviews, manage the business listing, and run targeted cold email campaigns. Keep responses to reviews professional and empathetic.',
  phone:     'You are a patient follow-up agent. Call patients 24 hours after discharge, ask structured wellness questions, and log responses to the CRM. Be warm, clear, and follow HIPAA protocols at all times.',
  clipboard: 'You are a patient intake coordinator. Collect patient information, verify insurance details, and prepare intake forms before each appointment. Ensure accuracy and patient privacy.',
  gear:      'You are an operations coordinator. Manage internal workflows, update CRM records, coordinate schedules, and generate daily summary reports for management.',
  user:      'You are a client intake specialist. Qualify new inquiries, gather case information, and schedule consultations. Be professional, thorough, and maintain client confidentiality.',
  file:      'You are a document processing agent. Organize case documents, prepare standard filings, and track critical deadlines. Accuracy and timeliness are your top priorities.',
  dollar:    'You are a billing and finance agent. Track billable hours, send payment reminders, and generate invoices. Be polite but firm in collections communications.',
  megaphone: 'You are a sales outreach agent. Research prospects, craft personalized cold emails, and follow up on leads. Focus on value-first messaging and always respect opt-out requests.',
}

const MOCK_RESPONSES = {
  headset:   ["I'd be happy to help! What would you like to know?", "Great question. Let me look that up for you.", "Absolutely — our team is here 9am–6pm daily. Is there anything else I can assist with?"],
  calendar:  ["I can schedule that for you right away. What date works best?", "Your appointment is confirmed. I'll send a reminder 24 hours before.", "No problem — I've updated your booking. You'll receive a confirmation shortly."],
  star:      ["I've drafted a response to that review. Want me to post it?", "Your Google listing has been updated with the new hours.", "Campaign launched — I'll report back on open rates in 24 hours."],
  phone:     ["Hi, this is the follow-up call from the care team. How are you feeling today?", "I've logged your responses in the system. Everything looks good — I'll flag anything unusual.", "Thank you for taking the call. Your care team will reach out if any follow-up is needed."],
  gear:      ["CRM has been updated with today's records.", "Daily report generated and sent to the management team.", "Workflow completed — 12 tasks processed, 0 errors."],
  default:   ["Understood, I'm on it.", "Done. Anything else you need?", "Got it — I'll handle that right away."],
}

function getMockResponse(icon) {
  const pool = MOCK_RESPONSES[icon] || MOCK_RESPONSES.default
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function AgentModal({ agent, businessName, onClose, onSave }) {
  const [tab, setTab] = useState('chat')
  const [name, setName] = useState(agent.name)
  const [phone, setPhone] = useState('')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPTS[agent.icon] || DEFAULT_PROMPTS.gear)
  const [connected, setConnected] = useState(new Set())
  const [messages, setMessages] = useState([
    { from: 'agent', text: `Hi! I'm your ${agent.name}. How can I help ${businessName || 'you'} today?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [saved, setSaved] = useState(false)
  const messagesEndRef = useRef(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])

  function handleSendMessage(e) {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { from: 'agent', text: getMockResponse(agent.icon) }])
    }, 900 + Math.random() * 600)
  }

  function toggleIntegration(id) {
    setConnected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSavePrompt() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave?.({ ...agent, name, prompt })
  }

  const accentColor = agent.color || '#0A0A0A'

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-agent-identity">
            <div className="modal-icon" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25`, color: accentColor }}>
              <AgentIcon icon={agent.icon} />
            </div>
            <div>
              {editingName ? (
                <input
                  ref={nameInputRef}
                  className="modal-name-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                />
              ) : (
                <div className="modal-name" onClick={() => setEditingName(true)} title="Click to rename">
                  {name}
                  <span className="modal-name-edit">✎</span>
                </div>
              )}
              <div className="modal-role">{agent.role}</div>
            </div>
          </div>
          <div className="modal-header-right">
            <div className="modal-status-badge">
              <span className="modal-status-dot" />
              Active
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {[
            { id: 'chat',         label: 'Chat' },
            { id: 'profile',      label: 'Profile' },
            { id: 'prompt',       label: 'Prompt' },
            { id: 'integrations', label: 'Integrations' },
          ].map(t => (
            <button
              key={t.id}
              className={`modal-tab ${tab === t.id ? 'modal-tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="modal-body">

          {/* ── CHAT ── */}
          {tab === 'chat' && (
            <div className="chat-root">
              <div className="chat-channel-bar">
                <span className="chat-channel-label">Chatting via</span>
                {['iMessage', 'WhatsApp', 'Telegram'].map(ch => (
                  <button key={ch} className="chat-channel-pill">{ch}</button>
                ))}
              </div>
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`bubble-row bubble-row--${msg.from}`}>
                    {msg.from === 'agent' && (
                      <div className="bubble-avatar" style={{ background: `${accentColor}20`, color: accentColor }}>
                        <AgentIcon icon={agent.icon} size={14} />
                      </div>
                    )}
                    <div className={`bubble bubble--${msg.from}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="bubble-row bubble-row--agent">
                    <div className="bubble-avatar" style={{ background: `${accentColor}20`, color: accentColor }}>
                      <AgentIcon icon={agent.icon} size={14} />
                    </div>
                    <div className="bubble bubble--agent bubble--typing">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-row" onSubmit={handleSendMessage}>
                <input
                  className="chat-input"
                  placeholder={`Message ${name}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoFocus
                />
                <button className="chat-send" type="submit" disabled={!input.trim()}>
                  <SendIcon />
                </button>
              </form>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="profile-root">
              <section className="profile-section">
                <h3 className="section-title">Identity</h3>
                <div className="field-group">
                  <label className="field-label">Agent name / Employee name</label>
                  <input
                    className="field-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sarah — Customer Service"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Role</label>
                  <input className="field-input field-input--readonly" value={agent.role} readOnly />
                </div>
              </section>

              <section className="profile-section">
                <h3 className="section-title">Phone Number</h3>
                <p className="section-desc">Assign a dedicated phone number so this agent can make and receive calls.</p>
                <div className="phone-input-row">
                  <span className="phone-flag">🇺🇸</span>
                  <input
                    className="field-input phone-field"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <button className="save-btn" onClick={handleSavePrompt}>
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
              </section>

              <section className="profile-section">
                <h3 className="section-title">Tasks</h3>
                <div className="tasks-list">
                  {agent.tasks.map((t, i) => (
                    <div key={i} className="task-chip">
                      <span className="task-chip-dot" />
                      {t}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── PROMPT ── */}
          {tab === 'prompt' && (
            <div className="prompt-root">
              <section className="profile-section">
                <h3 className="section-title">Master Prompt</h3>
                <p className="section-desc">
                  This is the core instruction set for this agent. Edit it to change how
                  {' '}{name} behaves, its tone, rules, and what it should or shouldn't do.
                </p>
                <textarea
                  className="prompt-textarea"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={12}
                  spellCheck={false}
                />
                <div className="prompt-actions">
                  <button
                    className="reset-btn"
                    onClick={() => setPrompt(DEFAULT_PROMPTS[agent.icon] || DEFAULT_PROMPTS.gear)}
                  >
                    Reset to default
                  </button>
                  <button className="save-btn" onClick={handleSavePrompt}>
                    {saved ? '✓ Saved' : 'Save Prompt'}
                  </button>
                </div>
              </section>

              <section className="profile-section">
                <h3 className="section-title">Variables</h3>
                <p className="section-desc">Use these placeholders in your prompt — they get filled in automatically.</p>
                <div className="vars-grid">
                  {[
                    ['{business_name}', 'Your business name'],
                    ['{business_type}', 'Type of business'],
                    ['{agent_name}', "This agent's name"],
                    ['{date}', 'Today\'s date'],
                    ['{caller_name}', 'Name of the person calling'],
                    ['{phone}', 'Caller\'s phone number'],
                  ].map(([v, d]) => (
                    <div key={v} className="var-chip">
                      <code className="var-code">{v}</code>
                      <span className="var-desc">{d}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── INTEGRATIONS ── */}
          {tab === 'integrations' && (
            <div className="integrations-root">
              <section className="profile-section">
                <h3 className="section-title">Connect Channels</h3>
                <p className="section-desc">
                  Connect {name} to the tools your team already uses. Messages flow through all connected channels simultaneously.
                </p>
                <div className="integrations-grid">
                  {INTEGRATIONS.map(intg => (
                    <div
                      key={intg.id}
                      className={`intg-card ${connected.has(intg.id) ? 'intg-card--connected' : ''}`}
                      onClick={() => toggleIntegration(intg.id)}
                    >
                      <div className="intg-icon">{intg.icon}</div>
                      <div className="intg-name">{intg.name}</div>
                      <div className={`intg-badge ${connected.has(intg.id) ? 'intg-badge--on' : ''}`}>
                        {connected.has(intg.id) ? 'Connected' : 'Connect'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {connected.size > 0 && (
                <section className="profile-section">
                  <h3 className="section-title">Active Channels ({connected.size})</h3>
                  <div className="active-channels">
                    {[...connected].map(id => {
                      const intg = INTEGRATIONS.find(i => i.id === id)
                      return (
                        <div key={id} className="active-channel-pill">
                          <span>{intg.icon}</span>
                          {intg.name}
                          <button className="active-channel-remove" onClick={() => toggleIntegration(id)}>×</button>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reuse the same SVG icons from AgentCard
const ICONS = {
  headset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  clipboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  megaphone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>,
}

function AgentIcon({ icon, size = 18 }) {
  const el = ICONS[icon] || ICONS.gear
  return <span style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{el}</span>
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
