import { useState, useRef, useEffect } from 'react'
import './AgentPage.css'

/* ── Brand logos ─────────────────────────────────────────── */
const LogoSlack = () => (
  <svg viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="10" height="10" rx="3" fill="#E01E5A"/><rect x="18" y="4" width="10" height="10" rx="3" fill="#36C5F0"/><rect x="4" y="18" width="10" height="10" rx="3" fill="#2EB67D"/><rect x="18" y="18" width="10" height="10" rx="3" fill="#ECB22E"/></svg>
)
const LogoTelegram = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#229ED9"/><path d="M7 15.5L23 9l-2.5 14-7-4.5-1.5 5-2.5-5.5L7 15.5z" fill="white"/></svg>
)
const LogoWhatsApp = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M22.8 9.2A9.8 9.8 0 0 0 16 6.4C10.7 6.4 6.4 10.7 6.4 16c0 1.7.4 3.4 1.2 4.9L6 26l5.2-1.4a9.8 9.8 0 0 0 4.8 1.2c5.3 0 9.6-4.3 9.6-9.6A9.6 9.6 0 0 0 22.8 9.2z" fill="white" opacity=".9"/><path d="M21 19.3c-.2.5-1.2 1-1.7 1-.9.1-1.7-.2-3.8-1.1-2.7-1.1-4.4-3.8-4.5-4-.2-.2-.9-1.3-.9-2.4 0-1.1.6-1.7.9-1.9.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.5.8 1.9.9 2 .1.2.1.3 0 .5-.1.1-.2.3-.3.4l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3.7.7 1.6 1.1 1.9 1.3.3.1.5.1.7-.1l.5-.5c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.2.8z" fill="#25D366"/></svg>
)
const LogoEmail = () => (
  <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#EA4335"/><rect x="6" y="10" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><path d="M6 10l10 7 10-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const LogoiMessage = () => (
  <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#34C759"/><path d="M16 6C9.9 6 5 10 5 15c0 2.8 1.5 5.3 3.9 7l-1.4 4.1 4.5-1.8A11 11 0 0 0 16 24.1c6.1 0 11-4 11-9.1C27 10 22.1 6 16 6z" fill="white"/></svg>
)
const LogoNotion = () => (
  <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill="#191919"/><path d="M9 24V8l14 16V8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const LogoHubSpot = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#FF7A59"/><circle cx="16" cy="16" r="4.5" fill="white"/><rect x="14.25" y="5" width="3.5" height="6.5" rx="1.75" fill="white"/><rect x="14.25" y="20.5" width="3.5" height="6.5" rx="1.75" fill="white"/><rect x="5" y="14.25" width="6.5" height="3.5" rx="1.75" fill="white"/><rect x="20.5" y="14.25" width="6.5" height="3.5" rx="1.75" fill="white"/></svg>
)
const LogoSalesforce = () => (
  <svg viewBox="0 0 32 32" fill="none"><path d="M12 22C9 22 6.5 19.5 6.5 16.5c0-1.8.9-3.4 2.3-4.4-.1-.4-.1-.8-.1-1.1C8.7 7.8 11.1 5.5 14 5.5c1.4 0 2.7.5 3.7 1.4 1-1 2.4-1.6 3.9-1.6 3 0 5.4 2.5 5.4 5.5 0 .4 0 .8-.1 1.2.7.8 1.2 1.9 1.2 3C28 17.8 25.8 20 23 20h-3.7c-.5 1.1-1.6 2-3.3 2H12z" fill="#00A1E0"/></svg>
)
const LogoGCal = () => (
  <svg viewBox="0 0 32 32" fill="none"><rect x="3" y="6" width="26" height="23" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1"/><rect x="3" y="6" width="26" height="9" rx="3" fill="#4285F4"/><rect x="3" y="12" width="26" height="3" fill="#4285F4"/><rect x="9" y="3" width="3" height="6" rx="1.5" fill="#DB4437"/><rect x="20" y="3" width="3" height="6" rx="1.5" fill="#DB4437"/><rect x="7" y="19" width="6" height="5" rx="1.5" fill="#4285F4"/><rect x="19" y="19" width="6" height="5" rx="1.5" fill="#34A853"/></svg>
)
const LogoTwilio = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#F22F46"/><circle cx="12" cy="12" r="3" fill="white"/><circle cx="20" cy="12" r="3" fill="white"/><circle cx="12" cy="20" r="3" fill="white"/><circle cx="20" cy="20" r="3" fill="white"/></svg>
)
const LogoZapier = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#FF4A00"/><path d="M9 9h14L9 23h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const LogoMake = () => (
  <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#6D00CC"/><circle cx="12.5" cy="16" r="4.5" stroke="white" strokeWidth="2" fill="none"/><circle cx="19.5" cy="16" r="4.5" stroke="white" strokeWidth="2" fill="none"/></svg>
)

const INTEGRATIONS = [
  { id: 'slack',      name: 'Slack',           Logo: LogoSlack,      color: '#4A154B' },
  { id: 'telegram',   name: 'Telegram',        Logo: LogoTelegram,   color: '#229ED9' },
  { id: 'whatsapp',   name: 'WhatsApp',        Logo: LogoWhatsApp,   color: '#25D366' },
  { id: 'email',      name: 'Email',           Logo: LogoEmail,      color: '#EA4335' },
  { id: 'imessage',   name: 'iMessage',        Logo: LogoiMessage,   color: '#34C759' },
  { id: 'notion',     name: 'Notion',          Logo: LogoNotion,     color: '#191919' },
  { id: 'hubspot',    name: 'HubSpot',         Logo: LogoHubSpot,    color: '#FF7A59' },
  { id: 'salesforce', name: 'Salesforce',      Logo: LogoSalesforce, color: '#00A1E0' },
  { id: 'gcal',       name: 'Google Calendar', Logo: LogoGCal,       color: '#4285F4' },
  { id: 'twilio',     name: 'Twilio',          Logo: LogoTwilio,     color: '#F22F46' },
  { id: 'zapier',     name: 'Zapier',          Logo: LogoZapier,     color: '#FF4A00' },
  { id: 'make',       name: 'Make',            Logo: LogoMake,       color: '#6D00CC' },
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

export default function AgentPage({ agent, business, onBack }) {
  const [tab, setTab] = useState('chat')
  const [name, setName] = useState(agent.name)
  const [phone, setPhone] = useState('')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPTS[agent.icon] || DEFAULT_PROMPTS.gear)
  const [connected, setConnected] = useState(new Set())
  const [messages, setMessages] = useState([
    { from: 'agent', text: `Hi! I'm your ${agent.name}. How can I help ${business?.name || 'you'} today?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [saved, setSaved] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function handleSendMessage(e) {
    e?.preventDefault()
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'user', text: input.trim() }])
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
  }

  const accentColor = agent.color || '#0A0A0A'

  return (
    <div className="agent-page">
      {/* Sub-header: back + identity + tabs */}
      <div className="ap-header">
        <div className="ap-header-inner">
          <button className="ap-back" onClick={onBack}>
            <BackIcon />
            Back to Team
          </button>

          <div className="ap-identity">
            <div className="ap-icon" style={{ background: `${accentColor}12`, border: `1.5px solid ${accentColor}25`, color: accentColor }}>
              <AgentIcon icon={agent.icon} size={22} />
            </div>
            <div className="ap-identity-text">
              <div className="ap-name">{name}</div>
              <div className="ap-role">{agent.role}</div>
            </div>
            <div className="ap-status-badge">
              <span className="ap-status-dot" />
              Active
            </div>
          </div>

          <div className="ap-tabs">
            {[
              { id: 'chat',         label: 'Chat' },
              { id: 'profile',      label: 'Profile' },
              { id: 'prompt',       label: 'Prompt' },
              { id: 'integrations', label: 'Integrations' },
            ].map(t => (
              <button
                key={t.id}
                className={`ap-tab ${tab === t.id ? 'ap-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="ap-body">

        {/* ── CHAT ── */}
        {tab === 'chat' && (
          <div className="ap-chat">
            <div className="ap-chat-bar">
              <span className="ap-chat-bar-label">Chatting via</span>
              {['iMessage', 'WhatsApp', 'Telegram'].map(ch => (
                <button key={ch} className="ap-channel-pill">{ch}</button>
              ))}
            </div>
            <div className="ap-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ap-bubble-row ap-bubble-row--${msg.from}`}>
                  {msg.from === 'agent' && (
                    <div className="ap-avatar" style={{ background: `${accentColor}18`, color: accentColor }}>
                      <AgentIcon icon={agent.icon} size={14} />
                    </div>
                  )}
                  <div className={`ap-bubble ap-bubble--${msg.from}`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="ap-bubble-row ap-bubble-row--agent">
                  <div className="ap-avatar" style={{ background: `${accentColor}18`, color: accentColor }}>
                    <AgentIcon icon={agent.icon} size={14} />
                  </div>
                  <div className="ap-bubble ap-bubble--agent ap-bubble--typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="ap-input-row" onSubmit={handleSendMessage}>
              <input
                className="ap-input"
                placeholder={`Message ${name}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button className="ap-send" type="submit" disabled={!input.trim()}>
                <SendIcon />
              </button>
            </form>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <div className="ap-scrollable">
            <div className="ap-section-wrap">
              <div className="ap-section">
                <h3 className="ap-section-title">Identity</h3>
                <div className="ap-fields">
                  <div className="ap-field">
                    <label className="ap-field-label">Agent name</label>
                    <input className="ap-field-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah — Customer Service" />
                  </div>
                  <div className="ap-field">
                    <label className="ap-field-label">Role</label>
                    <input className="ap-field-input ap-field-input--ro" value={agent.role} readOnly />
                  </div>
                </div>
              </div>

              <div className="ap-section">
                <h3 className="ap-section-title">Phone Number</h3>
                <p className="ap-section-desc">Assign a dedicated phone number so this agent can make and receive calls.</p>
                <div className="ap-phone-row">
                  <span className="ap-phone-flag">🇺🇸</span>
                  <input className="ap-field-input" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
                </div>
                <button className="ap-save-btn" onClick={handleSavePrompt}>{saved ? '✓ Saved' : 'Save Changes'}</button>
              </div>

              <div className="ap-section">
                <h3 className="ap-section-title">Tasks</h3>
                <div className="ap-tasks">
                  {agent.tasks.map((t, i) => (
                    <div key={i} className="ap-task-chip"><span className="ap-task-dot" />{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROMPT ── */}
        {tab === 'prompt' && (
          <div className="ap-scrollable">
            <div className="ap-section-wrap">
              <div className="ap-section">
                <h3 className="ap-section-title">Master Prompt</h3>
                <p className="ap-section-desc">
                  This is the core instruction set for {name}. Edit it to change how the agent behaves, its tone, and what it should or shouldn't do.
                </p>
                <textarea
                  className="ap-prompt-textarea"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={14}
                  spellCheck={false}
                />
                <div className="ap-prompt-actions">
                  <button className="ap-reset-btn" onClick={() => setPrompt(DEFAULT_PROMPTS[agent.icon] || DEFAULT_PROMPTS.gear)}>Reset to default</button>
                  <button className="ap-save-btn" onClick={handleSavePrompt}>{saved ? '✓ Saved' : 'Save Prompt'}</button>
                </div>
              </div>

              <div className="ap-section">
                <h3 className="ap-section-title">Variables</h3>
                <p className="ap-section-desc">Use these placeholders in your prompt — they get filled in automatically.</p>
                <div className="ap-vars">
                  {[
                    ['{business_name}', 'Your business name'],
                    ['{business_type}', 'Type of business'],
                    ['{agent_name}', "This agent's name"],
                    ['{date}', "Today's date"],
                    ['{caller_name}', 'Name of the caller'],
                    ['{phone}', "Caller's phone number"],
                  ].map(([v, d]) => (
                    <div key={v} className="ap-var-chip">
                      <code className="ap-var-code">{v}</code>
                      <span className="ap-var-desc">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === 'integrations' && (
          <div className="ap-scrollable">
            <div className="ap-section-wrap">
              <div className="ap-section">
                <h3 className="ap-section-title">Connect Channels</h3>
                <p className="ap-section-desc">
                  Connect {name} to the tools your team already uses. Messages flow through all connected channels simultaneously.
                </p>
                <div className="ap-intg-grid">
                  {INTEGRATIONS.map(intg => {
                    const on = connected.has(intg.id)
                    return (
                      <button
                        key={intg.id}
                        className={`ap-intg-card ${on ? 'ap-intg-card--on' : ''}`}
                        onClick={() => toggleIntegration(intg.id)}
                      >
                        <div className="ap-intg-logo"><intg.Logo /></div>
                        <div className="ap-intg-name">{intg.name}</div>
                        <div className={`ap-intg-badge ${on ? 'ap-intg-badge--on' : ''}`}>
                          {on ? '✓ Connected' : 'Connect'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {connected.size > 0 && (
                <div className="ap-section">
                  <h3 className="ap-section-title">Active Channels ({connected.size})</h3>
                  <div className="ap-active-channels">
                    {[...connected].map(id => {
                      const intg = INTEGRATIONS.find(i => i.id === id)
                      return (
                        <div key={id} className="ap-active-pill">
                          <span className="ap-active-pill-logo"><intg.Logo /></span>
                          {intg.name}
                          <button className="ap-active-remove" onClick={() => toggleIntegration(id)}>×</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────── */
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
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
}

function AgentIcon({ icon, size = 20 }) {
  const el = ICONS[icon] || ICONS.gear
  return <span style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{el}</span>
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
