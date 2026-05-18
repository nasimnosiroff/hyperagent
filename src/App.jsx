import { useState, useCallback } from 'react'
import IntakeScreen from './components/IntakeScreen'
import ResearchScreen from './components/ResearchScreen'
import SpawnScreen from './components/SpawnScreen'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('intake')
  const [url, setUrl] = useState('')
  const [business, setBusiness] = useState(null)
  const [agents, setAgents] = useState([])
  const [sources, setSources] = useState([])

  const handleSubmit = useCallback((inputUrl) => {
    setUrl(inputUrl)
    setAgents([])
    setBusiness(null)
    setSources([])
    setScreen('research')
  }, [])

  const handleBusinessFound = useCallback((data) => {
    setBusiness(data)
  }, [])

  const handleAgentSpawned = useCallback((agent) => {
    setAgents(prev => [...prev, agent])
  }, [])

  const handleSourceFound = useCallback((source) => {
    setSources(prev => [...prev, source])
  }, [])

  const handleSpawnComplete = useCallback(() => {
    setScreen('spawn')
  }, [])

  const handleReset = useCallback(() => {
    setScreen('intake')
    setUrl('')
    setBusiness(null)
    setAgents([])
    setSources([])
  }, [])

  return (
    <div className="app-root">
      {screen === 'intake' && (
        <IntakeScreen onSubmit={handleSubmit} />
      )}
      {screen === 'research' && (
        <ResearchScreen
          url={url}
          onBusinessFound={handleBusinessFound}
          onAgentSpawned={handleAgentSpawned}
          onSourceFound={handleSourceFound}
          onComplete={handleSpawnComplete}
        />
      )}
      {screen === 'spawn' && (
        <SpawnScreen
          business={business}
          agents={agents}
          sources={sources}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
