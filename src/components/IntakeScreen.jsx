import { useState } from 'react'
import LandingPage from './LandingPage'
import HeroCubes from './HeroCubes'
import './IntakeScreen.css'

export default function IntakeScreen({ onSubmit }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Paste a website or Google Maps link to continue.')
      return
    }
    setError('')
    onSubmit(trimmed)
  }

  return (
    <div className="intake-root" style={{ overflow: 'visible' }}>
      {/* Nav */}
      <nav className="intake-nav">
        <div className="nav-logo">
          <div className="nav-logo-box">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          HyperAgent
        </div>
        <div className="nav-links">
          <a className="nav-link" href="#">Features</a>
          <a className="nav-link" href="#">Use Cases</a>
          <a className="nav-link" href="#">Pricing</a>
        </div>
        <button className="nav-cta">Get Started</button>
      </nav>

      {/* Hero */}
      <div className="intake-hero">
        <div className="intake-hero-left">
          <div className="intake-eyebrow">
            <span className="eyebrow-dot" />
            AI Workforce for Any Business
          </div>

          <h1 className="intake-headline">
            Hire AI employees who never sleep.
          </h1>
          <p className="intake-sub">
            Paste your website or Google Maps link. We'll research your business
            and build a custom AI team — no setup, no technical knowledge required.
          </p>

          <form className="intake-form" onSubmit={handleSubmit}>
            <div className="input-wrap">
              <span className="input-icon">
                <LinkIcon />
              </span>
              <input
                className="intake-input"
                type="text"
                placeholder="https://yourbusiness.com or Google Maps link"
                value={value}
                onChange={e => { setValue(e.target.value); setError('') }}
                autoFocus
                spellCheck={false}
              />
            </div>
            {error && <p className="intake-error">{error}</p>}
            <button className="intake-btn" type="submit">
              Build My Team
              <ArrowIcon />
            </button>
          </form>

          <div className="proof-strip">
            <span className="proof-item">Restaurants</span>
            <span className="proof-item">Hospitals</span>
            <span className="proof-item">Law Firms</span>
            <span className="proof-item">Salons</span>
            <span className="proof-item">Any Business</span>
          </div>
        </div>

        <div className="intake-hero-right">
          <HeroCubes />
        </div>
      </div>

      {/* Landing page sections */}
      <LandingPage />
    </div>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
