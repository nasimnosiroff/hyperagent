import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './LandingPage.css'

// ── helpers ───────────────────────────────────────────────────────────────────
function makeEnvCanvas() {
  const c = document.createElement('canvas')
  c.width = 1024; c.height = 512
  const ctx = c.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#2a1a3a')
  grad.addColorStop(0.5, '#1a1428')
  grad.addColorStop(1, '#241a2e')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 512)
  const lights = [
    { x: 80,  y: 80,  r: 220, c: '#ff00cc' },
    { x: 280, y: 60,  r: 200, c: '#9d00ff' },
    { x: 480, y: 100, r: 240, c: '#00d4ff' },
    { x: 700, y: 70,  r: 200, c: '#ff6b00' },
    { x: 900, y: 100, r: 220, c: '#ffe600' },
    { x: 150, y: 360, r: 260, c: '#00ff88' },
    { x: 380, y: 420, r: 240, c: '#ff0066' },
    { x: 600, y: 380, r: 260, c: '#0055ff' },
    { x: 830, y: 420, r: 240, c: '#ff00aa' },
    { x: 200, y: 200, r: 80,  c: '#ffffff' },
    { x: 760, y: 280, r: 90,  c: '#ffffff' },
  ]
  lights.forEach(l => {
    const r = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r)
    r.addColorStop(0, l.c); r.addColorStop(0.4, l.c + 'cc'); r.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = r; ctx.fillRect(0, 0, 1024, 512)
  })
  ctx.globalCompositeOperation = 'source-over'
  return c
}

function makeEnv(renderer, envCanvas) {
  const tex = new THREE.CanvasTexture(envCanvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const env = pmrem.fromEquirectangular(tex).texture
  tex.dispose(); pmrem.dispose()
  return env
}

const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const easeOut   = t => 1 - Math.pow(1 - t, 3)

function formatNum(value, decimals, withCommas) {
  if (withCommas) {
    const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    return rounded.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }
  return value.toFixed(decimals)
}

// ── component ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const globeRef   = useRef(null)
  const tileRefs   = useRef([])

  useEffect(() => {
    let stopped = false

    // ── Tile cubes (single shared renderer — avoids WebGL context limit) ────────
    const envCanvas = makeEnvCanvas()
    if (envCanvas) {
      try {
        const TILE_PX = 200
        const tileRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
        tileRenderer.setPixelRatio(1)
        tileRenderer.setSize(TILE_PX, TILE_PX)
        tileRenderer.toneMapping = THREE.ACESFilmicToneMapping
        tileRenderer.toneMappingExposure = 1.5

        const sharedTileEnv = makeEnv(tileRenderer, envCanvas)

        const tileData = tileRefs.current.map((el, idx) => {
          if (!el) return null
          const dpr = Math.min(window.devicePixelRatio, 2)
          const w = Math.max(el.clientWidth, 80)
          const c2d = document.createElement('canvas')
          c2d.width = Math.round(w * dpr); c2d.height = Math.round(w * dpr)
          c2d.style.cssText = 'display:block;width:100%;height:100%'
          el.appendChild(c2d)
          const ctx = c2d.getContext('2d')

          const ts = new THREE.Scene()
          ts.environment = sharedTileEnv
          const tc = new THREE.PerspectiveCamera(38, 1, 0.1, 100); tc.position.set(0, 0, 3)
          const k = new THREE.DirectionalLight(0xffffff, 2); k.position.set(3, 4, 5); ts.add(k)
          const f = new THREE.DirectionalLight(0xc8d8ff, 1); f.position.set(-4, -2, 3); ts.add(f)
          const r = new THREE.DirectionalLight(0xffd5b0, 0.8); r.position.set(0, -4, -2); ts.add(r)
          ts.add(new THREE.AmbientLight(0xffffff, 0.5))

          let tGeo, exRX = 0, exRY = 0, exRZ = 0
          switch (idx) {
            case 0: tGeo = new THREE.TorusKnotGeometry(0.46, 0.16, 140, 18, 2, 3); exRX = 0.3; exRY = 0.4; break
            case 1: tGeo = new THREE.IcosahedronGeometry(0.82, 0); exRX = 0.4; exRY = -0.2; exRZ = 0.15; break
            case 2: tGeo = new THREE.SphereGeometry(0.78, 48, 32); break
            case 3: tGeo = new THREE.CapsuleGeometry(0.38, 0.6, 16, 32); exRZ = -0.35; exRX = 0.2; break
            case 4: tGeo = new THREE.OctahedronGeometry(0.88, 0); exRX = 0.3; exRY = 0.3; exRZ = 0.18; break
            case 5: tGeo = new THREE.DodecahedronGeometry(0.78, 0); exRX = 0.25; exRY = -0.3; break
            case 6: tGeo = new THREE.TorusGeometry(0.62, 0.22, 20, 56); exRX = Math.PI / 2.6; exRY = 0.35; break
            case 7: tGeo = new THREE.TorusKnotGeometry(0.42, 0.13, 150, 20, 3, 4); exRX = 0.2; exRY = -0.3; break
            default: tGeo = new THREE.SphereGeometry(0.8, 48, 32)
          }
          const hue = idx * 100
          const tMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xcccccc), metalness: 1, roughness: 0.18,
            envMapIntensity: 2.2, iridescence: 1, iridescenceIOR: 1.6,
            iridescenceThicknessRange: [200 + hue, 900 + hue], clearcoat: 1, clearcoatRoughness: 0.08, reflectivity: 1,
          })
          const tMesh = new THREE.Mesh(tGeo, tMat)
          tMesh.scale.setScalar(1.15); ts.add(tMesh)
          tMesh.rotation.set(-0.3 + exRX, exRY, exRZ)
          return { scene: ts, camera: tc, mesh: tMesh, ctx, canvas2d: c2d }
        })

        function loopTiles() {
          if (stopped) return
          tileData.forEach(tile => {
            if (!tile) return
            tile.mesh.rotation.y += 0.008
            tileRenderer.render(tile.scene, tile.camera)
            tile.ctx.clearRect(0, 0, tile.canvas2d.width, tile.canvas2d.height)
            tile.ctx.drawImage(tileRenderer.domElement, 0, 0, tile.canvas2d.width, tile.canvas2d.height)
          })
          requestAnimationFrame(loopTiles)
        }
        loopTiles()
      } catch (e) { console.error('[tile-cubes]', e) }
    }

    // ── Globe 3D ──────────────────────────────────────────────────────────────
    const globeMount = globeRef.current
    if (globeMount) {
      try {
        const W = globeMount.clientWidth || 800, H = W / 2
        const gs = new THREE.Scene(); gs.background = null
        const gc = new THREE.PerspectiveCamera(28, W / H, 0.1, 100)
        gc.position.set(0, 0.45, 4.4); gc.lookAt(0, 0, 0)
        const gr = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        gr.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        gr.setSize(W, H, false); gr.domElement.style.cssText = 'display:block;width:100%;height:100%'
        globeMount.appendChild(gr.domElement)

        const globe = new THREE.Group(); gs.add(globe); const R = 1
        globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color('#F5F4F1') })))

        const polygons = [
          [[120,115],[160,100],[210,98],[255,108],[290,120],[305,140],[308,170],[305,200],[290,230],[270,250],[250,255],[225,250],[200,245],[175,240],[155,225],[140,210],[125,185],[118,160],[120,135]],
          [[240,260],[260,265],[275,285],[260,295],[245,285]],
          [[355,90],[400,85],[418,105],[412,135],[388,145],[360,135],[352,110]],
          [[270,280],[300,275],[330,290],[348,315],[362,350],[358,385],[340,410],[315,418],[295,400],[280,370],[272,335],[268,305]],
          [[450,120],[490,108],[535,112],[570,118],[582,138],[578,160],[562,178],[535,192],[510,200],[488,195],[470,180],[460,160],[455,140]],
          [[440,135],[460,128],[465,162],[450,170],[438,160]],
          [[510,90],[540,85],[558,105],[552,130],[530,128],[515,110]],
          [[490,215],[522,212],[558,222],[588,245],[602,275],[605,310],[595,345],[578,372],[558,388],[538,395],[518,388],[500,365],[490,330],[483,290],[486,250]],
          [[608,335],[620,335],[622,365],[612,370]],
          [[565,100],[615,90],[670,88],[730,95],[790,105],[845,118],[875,140],[885,170],[875,200],[855,222],[820,238],[785,248],[750,260],[720,268],[695,258],[665,242],[640,225],[618,212],[598,195],[582,170],[572,142],[568,118]],
          [[648,232],[688,235],[695,265],[678,290],[658,275],[650,255]],
          [[718,278],[755,288],[790,300],[800,318],[778,328],[745,322],[720,310]],
          [[795,265],[810,270],[815,295],[802,300],[796,280]],
          [[828,193],[850,193],[870,215],[858,235],[835,225],[828,208]],
          [[810,358],[860,352],[895,365],[908,388],[895,408],[860,415],[825,408],[810,388]],
          [[855,420],[875,422],[872,438],[858,435]],
          [[895,390],[915,395],[920,420],[902,420]],
        ]
        const pip = (x, y, poly) => { let inside = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside } return inside }
        const svgV3 = (x, y, rr) => { const lon = (x / 1000) * 2 * Math.PI - Math.PI, lat = Math.PI / 2 - (y / 500) * Math.PI; return new THREE.Vector3(rr * Math.cos(lat) * Math.sin(lon), rr * Math.sin(lat), rr * Math.cos(lat) * Math.cos(lon)) }
        const llV3  = (lat, lon, rr) => { const phi = lat * Math.PI / 180, lam = lon * Math.PI / 180; return new THREE.Vector3(rr * Math.cos(phi) * Math.sin(lam), rr * Math.sin(phi), rr * Math.cos(phi) * Math.cos(lam)) }

        const landPos = []; const step = 2
        for (let x = 0; x <= 1000; x += step) for (let y = 0; y <= 500; y += step) for (let i = 0; i < polygons.length; i++) if (pip(x, y, polygons[i])) { const p = svgV3(x, y, R * 1.005); landPos.push(p.x, p.y, p.z); break }
        const landGeo = new THREE.BufferGeometry()
        landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPos, 3))
        globe.add(new THREE.Points(landGeo, new THREE.PointsMaterial({ color: 0x1A1A1A, size: 0.009, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false })))

        const hubs = [
          { name: 'SF', lat: 37.77, lon: -122.42 }, { name: 'NYC', lat: 40.71, lon: -74.01 },
          { name: 'Sao Paulo', lat: -23.55, lon: -46.63 }, { name: 'London', lat: 51.5, lon: -0.13 },
          { name: 'Moscow', lat: 55.75, lon: 37.6 }, { name: 'Cairo', lat: 30.04, lon: 31.23 },
          { name: 'Lagos', lat: 6.5, lon: 3.4 }, { name: 'Cape Town', lat: -33.92, lon: 18.42 },
          { name: 'Dubai', lat: 25.07, lon: 55.30 }, { name: 'Mumbai', lat: 19.08, lon: 72.88 },
          { name: 'Singapore', lat: 1.35, lon: 103.82 }, { name: 'Tokyo', lat: 35.68, lon: 139.76 },
          { name: 'Beijing', lat: 39.90, lon: 116.40 }, { name: 'Seoul', lat: 37.56, lon: 126.98 },
          { name: 'Sydney', lat: -33.86, lon: 151.21 },
        ]
        const hubMat = new THREE.MeshBasicMaterial({ color: 0x0A0A0A })
        const hubGeo = new THREE.SphereGeometry(0.018, 16, 12)
        const hubMap = {}
        hubs.forEach(h => { const p = llV3(h.lat, h.lon, R * 1.015); const m = new THREE.Mesh(hubGeo, hubMat); m.position.copy(p); globe.add(m); hubMap[h.name] = p })

        const arcPairs = [
          ['SF','NYC'],['NYC','London'],['London','Moscow'],['London','Dubai'],['Dubai','Mumbai'],
          ['Mumbai','Singapore'],['Singapore','Tokyo'],['Singapore','Sydney'],['Tokyo','SF'],
          ['NYC','Sao Paulo'],['Sao Paulo','Lagos'],['Cairo','Dubai'],['Lagos','Cape Town'],
          ['Tokyo','Seoul'],['Tokyo','Beijing'],['Cape Town','Mumbai'],
        ]
        const arcMat = new THREE.LineBasicMaterial({ color: 0x0A0A0A, transparent: true, opacity: 0.28 })
        const pulGeo = new THREE.SphereGeometry(0.014, 12, 10)
        const arcs = []
        arcPairs.forEach(([a, b], ai) => {
          const A = hubMap[a], B = hubMap[b]; if (!A || !B) return
          const An = A.clone().normalize(), Bn = B.clone().normalize()
          const omega = Math.acos(Math.max(-1, Math.min(1, An.dot(Bn)))), sinO = Math.sin(omega)
          const pts = []
          for (let i = 0; i <= 64; i++) {
            const tt = i / 64; let p
            if (sinO < 1e-6) { p = An.clone() } else { p = An.clone().multiplyScalar(Math.sin((1 - tt) * omega) / sinO).add(Bn.clone().multiplyScalar(Math.sin(tt * omega) / sinO)) }
            p.normalize().multiplyScalar(R * (1.01 + 0.13 * Math.sin(tt * Math.PI) * Math.min(1, omega / 1.6))); pts.push(p)
          }
          globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat))
          const pMat = new THREE.MeshBasicMaterial({ color: 0x0A0A0A, transparent: true, opacity: 0 })
          const pulse = new THREE.Mesh(pulGeo, pMat); globe.add(pulse)
          arcs.push({ pts, pulse, offset: (ai * 0.137) % 1, speed: 0.18 + ((ai * 7) % 11) * 0.012 })
        })

        globe.rotation.x = 0.22; globe.rotation.y = -0.55
        function loopGlobe() {
          if (stopped) return
          globe.rotation.y += 0.0022
          const now = performance.now() * 0.001
          arcs.forEach(arc => {
            const phase = (now * arc.speed + arc.offset) % 1, iF = phase * (arc.pts.length - 1)
            const i0 = Math.floor(iF); const p1 = arc.pts[i0], p2 = arc.pts[Math.min(i0 + 1, arc.pts.length - 1)]
            arc.pulse.position.lerpVectors(p1, p2, iF - i0)
            arc.pulse.material.opacity = Math.sin(phase * Math.PI) * 0.95
          })
          gr.render(gs, gc); requestAnimationFrame(loopGlobe)
        }
        loopGlobe()

        const onGR = () => { const nw = globeMount.clientWidth || 800, nh = nw / 2; gr.setSize(nw, nh, false); gc.aspect = nw / nh; gc.updateProjectionMatrix() }
        window.addEventListener('resize', onGR)
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(onGR).observe(globeMount)
      } catch (e) { console.error('[globe-3d]', e) }
    }

    // ── Use-cases scroll ──────────────────────────────────────────────────────
    const tabs     = document.querySelectorAll('.lp-usecase-tab')
    const panels   = document.querySelectorAll('.lp-usecase-panel')
    const triggers = document.querySelectorAll('.lp-scroll-trigger')

    const tickerHandles = new WeakMap()
    function startTicker(el) {
      if (tickerHandles.has(el)) return
      const decimals = parseInt(el.dataset.decimals || '0', 10), comma = el.dataset.comma === 'true'
      let current = parseFloat(el.dataset.count)
      function tick() {
        current += Math.floor(1 + Math.random() * 4); el.dataset.count = current
        el.textContent = formatNum(current, decimals, comma)
        el.classList.remove('tick'); void el.offsetHeight; el.classList.add('tick')
        tickerHandles.set(el, setTimeout(tick, 5000 + Math.random() * 5000))
      }
      tickerHandles.set(el, setTimeout(tick, 4000 + Math.random() * 3000))
    }

    function animateCount(el) {
      const target = parseFloat(el.dataset.count ?? '0')
      const decimals = parseInt(el.dataset.decimals || '0', 10)
      const comma = el.dataset.comma === 'true', tick = el.dataset.tick === 'true'
      const duration = Math.min(2200, 1100 + Math.log10(Math.max(10, target)) * 250)
      const start = performance.now()
      function step(now) {
        const t = Math.min(1, (now - start) / duration), v = target * easeInOut(t)
        el.textContent = formatNum(v, decimals, comma)
        if (t < 1) { requestAnimationFrame(step) } else {
          const hero = el.closest('.lp-hero-stat')
          if (hero) { hero.classList.remove('bump'); void hero.offsetHeight; hero.classList.add('bump') }
          if (tick) startTicker(el)
        }
      }
      el.textContent = formatNum(0, decimals, comma); requestAnimationFrame(step)
    }

    function activate(idx) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.idx === idx))
      panels.forEach(p => {
        const isActive = p.dataset.idx === idx, wasActive = p.classList.contains('active')
        p.classList.toggle('active', isActive)
        if (isActive && !wasActive) {
          p.querySelectorAll('[data-count]').forEach(animateCount)
          p.querySelectorAll('.lp-sparkline path.line').forEach(path => {
            path.style.transition = 'none'; path.style.strokeDashoffset = '1000'
            void path.getBoundingClientRect(); path.style.transition = ''; path.style.strokeDashoffset = ''
          })
        }
      })
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const trig = document.querySelector('.lp-scroll-trigger[data-idx="' + tab.dataset.idx + '"]')
        if (trig) { const r = trig.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - window.innerHeight * 0.3, behavior: 'smooth' }) }
      })
    })

    const ucObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) activate(e.target.dataset.idx) })
    }, { rootMargin: '-50% 0px -50% 0px' })
    triggers.forEach(t => ucObs.observe(t))

    const initPanel = document.querySelector('.lp-usecase-panel.active')
    if (initPanel) initPanel.querySelectorAll('[data-count]').forEach(animateCount)

    // ── Stats count-up ────────────────────────────────────────────────────────
    const statEls = document.querySelectorAll('.lp-stats-section [data-stat-count]')
    const statSeen = new WeakSet()
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !statSeen.has(e.target)) {
          statSeen.add(e.target)
          const target = parseFloat(e.target.dataset.statCount)
          const decimals = parseInt(e.target.dataset.decimals || '0', 10)
          const prefix = e.target.dataset.prefix || '', suffix = e.target.dataset.suffix || ''
          const duration = 1400, start = performance.now()
          function step(now) {
            const t = Math.min(1, (now - start) / duration)
            e.target.textContent = prefix + (target * easeOut(t)).toFixed(decimals) + suffix
            if (t < 1) requestAnimationFrame(step)
          }
          e.target.textContent = prefix + (0).toFixed(decimals) + suffix
          requestAnimationFrame(step)
        }
      })
    }, { threshold: 0.45 })
    statEls.forEach(el => statObs.observe(el))

    return () => {
      stopped = true
      ucObs.disconnect()
      statObs.disconnect()
    }
  }, [])

  // ── JSX ────────────────────────────────────────────────────────────────────
  const TILE_CARDS = [
    { label: 'Email',      desc: 'Send, receive, thread.' },
    { label: 'Voice',      desc: 'Outbound & inbound calls.' },
    { label: 'SMS',        desc: 'Two-way messaging.' },
    { label: 'Browser',    desc: 'Auth, scrape, automate.' },
    { label: 'A2A Handoff',desc: 'Agent-to-agent contracts.' },
    { label: 'Tools / MCP',desc: 'Any tool, any source.' },
    { label: 'Payments',   desc: 'Agent-initiated.' },
    { label: 'Memory',     desc: 'Persistent context.' },
  ]

  const PROVIDERS = [
    { icon: 'email', category: 'Email', name: 'AgentMail', desc: 'Verifiable inboxes for agents. Threading, IMAP, webhooks — out of the box.' },
    { icon: 'phone', category: 'Voice · SMS', name: 'AgentPhone', desc: 'Numbers for AI agents. Unified webhook, MCP support, real-time transcripts.' },
    { icon: 'globe', category: 'Browser', name: 'Browserbase', desc: 'Headless browsers with persistent auth. Stealth proxies, session replay.' },
    { icon: 'card',  category: 'Payments', name: 'Stripe', desc: 'Agent-initiated payments. Refunds, payouts, subscriptions — with audit trail.' },
    { icon: 'cal',   category: 'Scheduling', name: 'Cal.com', desc: 'Bookings without the back-and-forth. Time zones, conflicts, reschedules handled.' },
    { icon: 'send',  category: 'Transactional', name: 'Resend', desc: 'High-deliverability transactional email. React templates, domains, analytics.' },
  ]

  return (
    <>
      {/* ── Trusted By ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-center text-sm mb-10 lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          Backed by leading investors and unicorn founders
        </p>
        <div className="overflow-hidden">
          <div className="lp-marquee lp-font-display font-bold text-2xl tracking-tight whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
            {['RTP Global','Gradient Ventures','ANTLER','Plug and Play','SciFi VC','Founders Fund','500',
              'RTP Global','Gradient Ventures','ANTLER','Plug and Play','SciFi VC','Founders Fund','500']
              .map((name, i) => <span key={i}>{name}</span>)}
          </div>
        </div>
      </div>

      {/* ── Capabilities ────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-32" style={{ background: 'var(--bg-soft)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-sm font-medium mb-4 uppercase lp-font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Capabilities</p>
            <h2 className="lp-font-display text-5xl md:text-6xl font-bold leading-none mb-5 tracking-tight" style={{ color: 'var(--text)' }}>
              Launch new agent channels 10× faster.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              One integration. Every channel your agent needs to act in the real world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TILE_CARDS.map((card, i) => (
              <div className="lp-tile-card-wrap" key={i}>
                <div className="lp-tile-icon-3d" ref={el => tileRefs.current[i] = el} />
                <div className="lp-tile-text-wrap">
                  <div className="lp-font-display font-bold text-xl mb-1">{card.label}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Providers ───────────────────────────────────────────────────────── */}
      <section id="providers" className="py-32" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium mb-4 uppercase lp-font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Providers</p>
            <h2 className="lp-font-display text-5xl md:text-6xl font-bold leading-none mb-5 tracking-tight" style={{ color: 'var(--text)' }}>
              Powered by the agent-native stack.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Bring your own keys. We orchestrate routing, audit, and handoff across the best-in-class
              agent-native services — so you write one SDK, not five.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROVIDERS.map((p, i) => (
              <div className="lp-card rounded-2xl p-7 hover:shadow-lg transition-shadow" key={i}>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0A0A0A' }}>
                    <ProviderIcon type={p.icon} />
                  </div>
                  <span className="text-xs lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontSize: 10 }}>{p.category}</span>
                </div>
                <div className="lp-font-display text-xl font-bold mb-1">{p.name}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-10" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t see your provider?{' '}
            <a href="#" className="underline underline-offset-4 hover:no-underline" style={{ color: '#0A0A0A' }}>Request an integration →</a>
          </p>
        </div>
      </section>

      {/* ── Use Cases ───────────────────────────────────────────────────────── */}
      <section id="features" className="lp-usecases-scroll" style={{ background: 'var(--bg)' }}>
        <div className="lp-usecases-sticky">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 w-full">
            {/* Left: tabs */}
            <div className="lg:col-span-5">
              <p className="text-sm font-medium mb-4 uppercase lp-font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Use cases</p>
              <h2 className="lp-font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text)', lineHeight: 1.05 }}>
                What teams are shipping.
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '28rem' }}>
                Real agents in production. Scroll to explore.
              </p>
              <div className="space-y-1.5">
                {[['01','AI SDR','Sales · outbound automation'],['02','Tier-1 support','Support · autopilot triage'],['03','Brokerage back-office','Insurance · P&C'],['04','Patient intake','Healthcare · HIPAA']]
                  .map(([num, title, sub], i) => (
                  <button className={`lp-usecase-tab${i === 0 ? ' active' : ''}`} data-idx={String(i)} key={i}>
                    <span className="lp-font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{num}</span>
                    <div>
                      <div className="lp-font-display text-lg font-bold">{title}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: panels */}
            <div className="lg:col-span-7 relative" style={{ height: 620 }}>

              {/* Panel 0 — AI SDR */}
              <div className="lp-usecase-panel active" data-idx="0">
                <div className="lp-card rounded-3xl p-7 h-full flex flex-col gap-4">
                  <div className="lp-usecase-num">01</div>
                  <div className="flex items-center justify-between">
                    <span className="lp-live-ticker">
                      <span className="lp-num" data-count="847" data-decimals="0" data-comma="true" data-tick="true">847</span>
                      <span>conversations today</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Sales</span>
                      <span className="text-xs px-2 rounded-full lp-font-mono" style={{ padding: '2px 8px', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>outbound</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="lp-font-display text-3xl md:text-4xl font-bold mb-2" style={{ lineHeight: 1.05 }}>AI SDR that closes meetings.</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Inbound lead drops, agent calls in 60s, qualifies in natural conversation, books on your calendar. Falls back to SMS or email if voice misses.
                    </p>
                  </div>
                  <div className="lp-viz lp-viz-timeline">
                    <div className="row"><span className="ts">0:00</span><span className="dot" /><span>Inbound lead · Acme Corp</span></div>
                    <div className="row"><span className="ts">0:03</span><span className="dot" /><span>Voice call placed</span></div>
                    <div className="row"><span className="ts">0:18</span><span className="dot" /><span>Qualified: budget · fit · intent</span></div>
                    <div className="row"><span className="ts">0:42</span><span className="dot live" /><span>Booked · Tue 2:00 PM PT</span></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-end pt-1">
                    <div className="col-span-5">
                      <div className="lp-hero-stat bump"><span data-count="3.4" data-decimals="1">3.4</span><span className="lp-suffix">×</span></div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>vs human SDRs · 60s avg response</div>
                    </div>
                    <div className="col-span-7">
                      <div className="text-xs uppercase tracking-widest mb-1 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Throughput · last 24h</div>
                      <div className="lp-sparkline-wrap">
                        <svg className="lp-sparkline" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path className="area" d="M0,34 L8,32 L16,30 L24,28 L32,26 L40,23 L48,24 L56,21 L64,19 L72,22 L80,18 L88,16 L96,18 L104,15 L112,13 L120,16 L128,12 L136,10 L144,13 L152,9 L160,7 L168,11 L176,8 L184,6 L192,4 L200,2 L200,40 L0,40 Z" />
                          <path className="line" d="M0,34 L8,32 L16,30 L24,28 L32,26 L40,23 L48,24 L56,21 L64,19 L72,22 L80,18 L88,16 L96,18 L104,15 L112,13 L120,16 L128,12 L136,10 L144,13 L152,9 L160,7 L168,11 L176,8 L184,6 L192,4 L200,2" />
                          <circle className="tip" cx="200" cy="2" r="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest mb-2 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Powering go-to-market at</div>
                    <div className="lp-logos"><span>Acme</span><span>Atlas Robotics</span><span>Northwind</span><span>Globex</span><span>Initech</span></div>
                  </div>
                </div>
              </div>

              {/* Panel 1 — Support */}
              <div className="lp-usecase-panel" data-idx="1">
                <div className="lp-card rounded-3xl p-7 h-full flex flex-col gap-4">
                  <div className="lp-usecase-num">02</div>
                  <div className="flex items-center justify-between">
                    <span className="lp-live-ticker">
                      <span className="lp-num" data-count="2143" data-decimals="0" data-comma="true" data-tick="true">0</span>
                      <span>tickets today</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Support</span>
                      <span className="text-xs px-2 rounded-full lp-font-mono" style={{ padding: '2px 8px', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>tier-1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="lp-font-display text-3xl md:text-4xl font-bold mb-2" style={{ lineHeight: 1.05 }}>Tier-1 support, on autopilot.</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Triage tickets across SMS, email, and chat. Browse your docs, take refund actions, escalate to a human only when stakes go up. Every action logged.
                    </p>
                  </div>
                  <div className="lp-viz lp-viz-thread">
                    <div className="head"><span>#2847 · Refund request</span><span className="status">resolved</span></div>
                    <div className="step"><span>Fetched order details</span><span className="label">browser</span></div>
                    <div className="step"><span>Issued refund $89</span><span className="label">stripe</span></div>
                    <div className="step"><span>Confirmation sent</span><span className="label">email</span></div>
                    <div className="step"><span>Closed · no human</span><span className="label">12s</span></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-end pt-1">
                    <div className="col-span-5">
                      <div className="lp-hero-stat"><span data-count="82" data-decimals="0">0</span><span className="lp-suffix">%</span></div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>auto-resolved · 14min → 30s response</div>
                    </div>
                    <div className="col-span-7">
                      <div className="text-xs uppercase tracking-widest mb-1 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Resolutions · last 24h</div>
                      <div className="lp-sparkline-wrap">
                        <svg className="lp-sparkline" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path className="area" d="M0,28 L8,26 L16,24 L24,22 L32,25 L40,20 L48,22 L56,17 L64,19 L72,15 L80,17 L88,12 L96,14 L104,9 L112,11 L120,7 L128,9 L136,5 L144,8 L152,4 L160,6 L168,3 L176,5 L184,3 L192,2 L200,4 L200,40 L0,40 Z" />
                          <path className="line" d="M0,28 L8,26 L16,24 L24,22 L32,25 L40,20 L48,22 L56,17 L64,19 L72,15 L80,17 L88,12 L96,14 L104,9 L112,11 L120,7 L128,9 L136,5 L144,8 L152,4 L160,6 L168,3 L176,5 L184,3 L192,2 L200,4" />
                          <circle className="tip" cx="200" cy="4" r="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest mb-2 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Powering support at</div>
                    <div className="lp-logos"><span>Vanta</span><span>Linear</span><span>Cron</span><span>Pitch</span><span>Notion</span></div>
                  </div>
                </div>
              </div>

              {/* Panel 2 — Brokerage */}
              <div className="lp-usecase-panel" data-idx="2">
                <div className="lp-card rounded-3xl p-7 h-full flex flex-col gap-4">
                  <div className="lp-usecase-num">03</div>
                  <div className="flex items-center justify-between">
                    <span className="lp-live-ticker">
                      <span className="lp-num" data-count="312" data-decimals="0" data-comma="true" data-tick="true">0</span>
                      <span>policies processed today</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Insurance</span>
                      <span className="text-xs px-2 rounded-full lp-font-mono" style={{ padding: '2px 8px', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>P&amp;C</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="lp-font-display text-3xl md:text-4xl font-bold mb-2" style={{ lineHeight: 1.05 }}>Brokerage back-office, automated.</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Quote intake from voicemail, ACORD form parsing, carrier follow-up by email, post-bind endorsements. Audit trail keeps E&amp;O happy.
                    </p>
                  </div>
                  <div className="lp-viz lp-viz-form">
                    <span className="k">Policyholder</span><span className="v parsed">Acme Corp, LLC</span>
                    <span className="k">Policy #</span><span className="v parsed">POL-983221-B</span>
                    <span className="k">Coverage</span><span className="v">$1M · $2M agg</span>
                    <span className="k">Effective</span><span className="v parsed">2026-04-01</span>
                    <span className="k">Carrier</span><span className="v">Travelers</span>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-end pt-1">
                    <div className="col-span-5">
                      <div className="lp-hero-stat"><span data-count="12" data-decimals="0">0</span><span className="lp-suffix">hrs</span></div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>saved per CSR weekly · 14min → 2min endorsements</div>
                    </div>
                    <div className="col-span-7">
                      <div className="text-xs uppercase tracking-widest mb-1 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Endorsements · last 24h</div>
                      <div className="lp-sparkline-wrap">
                        <svg className="lp-sparkline" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path className="area" d="M0,30 L8,28 L16,30 L24,25 L32,27 L40,22 L48,24 L56,19 L64,21 L72,16 L80,18 L88,14 L96,17 L104,12 L112,14 L120,10 L128,12 L136,7 L144,10 L152,6 L160,8 L168,4 L176,6 L184,3 L192,5 L200,3 L200,40 L0,40 Z" />
                          <path className="line" d="M0,30 L8,28 L16,30 L24,25 L32,27 L40,22 L48,24 L56,19 L64,21 L72,16 L80,18 L88,14 L96,17 L104,12 L112,14 L120,10 L128,12 L136,7 L144,10 L152,6 L160,8 L168,4 L176,6 L184,3 L192,5 L200,3" />
                          <circle className="tip" cx="200" cy="3" r="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest mb-2 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Trusted by P&amp;C brokerages</div>
                    <div className="lp-logos"><span>Highwood</span><span>Beacon &amp; Co</span><span>Trinity Brokers</span><span>Whitfield</span><span>Sterling Re</span></div>
                  </div>
                </div>
              </div>

              {/* Panel 3 — Healthcare */}
              <div className="lp-usecase-panel" data-idx="3">
                <div className="lp-card rounded-3xl p-7 h-full flex flex-col gap-4">
                  <div className="lp-usecase-num">04</div>
                  <div className="flex items-center justify-between">
                    <span className="lp-live-ticker">
                      <span className="lp-num" data-count="1284" data-decimals="0" data-comma="true" data-tick="true">0</span>
                      <span>patients today</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lp-font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Healthcare</span>
                      <span className="text-xs px-2 rounded-full lp-font-mono" style={{ padding: '2px 8px', background: 'var(--bg-soft)', border: '1px solid var(--border)' }}>HIPAA</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="lp-font-display text-3xl md:text-4xl font-bold mb-2" style={{ lineHeight: 1.05 }}>Patient intake without the paperwork.</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Voice intake handles insurance verification, prior auth lookups, and appointment booking. Every interaction PHI-redacted, audit-logged, replay-able for compliance review.
                    </p>
                  </div>
                  <div className="lp-viz">
                    <div className="lp-viz-wave">
                      {Array.from({ length: 24 }, (_, i) => (
                        <span key={i} className="bar" style={{ animationDelay: `${-(i * 0.06).toFixed(2)}s` }} />
                      ))}
                    </div>
                    <div className="lp-viz-wave-meta"><span>intake</span><span>verify</span><span>book</span></div>
                    <div className="lp-viz-chips"><span>PHI redacted</span><span>HIPAA logged</span><span>Replay-ready</span></div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 items-end pt-1">
                    <div className="col-span-5">
                      <div className="lp-hero-stat"><span data-count="94" data-decimals="0">0</span><span className="lp-suffix">%</span></div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>intake completion · $8/visit vs $42 staff</div>
                    </div>
                    <div className="col-span-7">
                      <div className="text-xs uppercase tracking-widest mb-1 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Verifications · last 24h</div>
                      <div className="lp-sparkline-wrap">
                        <svg className="lp-sparkline" viewBox="0 0 200 40" preserveAspectRatio="none">
                          <path className="area" d="M0,32 L8,30 L16,28 L24,30 L32,25 L40,27 L48,22 L56,24 L64,19 L72,21 L80,16 L88,18 L96,14 L104,16 L112,11 L120,13 L128,9 L136,11 L144,7 L152,9 L160,5 L168,7 L176,4 L184,6 L192,3 L200,5 L200,40 L0,40 Z" />
                          <path className="line" d="M0,32 L8,30 L16,28 L24,30 L32,25 L40,27 L48,22 L56,24 L64,19 L72,21 L80,16 L88,18 L96,14 L104,16 L112,11 L120,13 L128,9 L136,11 L144,7 L152,9 L160,5 L168,7 L176,4 L184,6 L192,3 L200,5" />
                          <circle className="tip" cx="200" cy="5" r="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs uppercase tracking-widest mb-2 lp-font-mono" style={{ color: 'var(--text-muted)', fontSize: 10 }}>Trusted by health systems</div>
                    <div className="lp-logos"><span>Mercy Clinics</span><span>NorthStar Health</span><span>Cedar Care</span><span>Vital Pediatrics</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll triggers */}
        <div className="lp-scroll-trigger" data-idx="0" style={{ top: 0 }} />
        <div className="lp-scroll-trigger" data-idx="1" style={{ top: '100vh' }} />
        <div className="lp-scroll-trigger" data-idx="2" style={{ top: '200vh' }} />
        <div className="lp-scroll-trigger" data-idx="3" style={{ top: '300vh' }} />
      </section>

      {/* ── Integration Code ─────────────────────────────────────────────────── */}
      <section id="integrations" className="py-32 text-white" style={{ background: 'linear-gradient(180deg,#060606 0%,#141414 50%,#060606 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm font-medium mb-4 uppercase lp-font-mono" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>Integration</p>
            <h2 className="lp-font-display text-4xl md:text-5xl font-bold mb-5 tracking-tight" style={{ lineHeight: 1.05 }}>
              Integrate tonight<br />with Single SDK.
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '28rem' }}>
              A simple, elegant integration so you can ship new agent channels in minutes — voice, SMS, email, browser, and agent-to-agent handoff through one consistent API.
            </p>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-colors" style={{ background: '#fff', color: '#0A0A0A' }}>
              Read the docs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </a>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#F5F4F1', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)' }}>
            <pre className="lp-font-mono text-sm overflow-x-auto leading-relaxed" style={{ color: '#0A0A0A' }}>
              <span style={{ color: '#0050C8' }}>import</span>{' '}{'{ Agent }'}{' '}
              <span style={{ color: '#0050C8' }}>from</span>{' '}
              <span style={{ color: '#067A4E' }}>&quot;agent-messenger&quot;</span>;{'\n\n'}
              <span style={{ color: '#0050C8' }}>const</span> sdr = <span style={{ color: '#0050C8' }}>new</span>{' '}
              <span style={{ color: '#B5179E' }}>Agent</span>(<span style={{ color: '#067A4E' }}>&quot;sdr&quot;</span>);{'\n\n'}
              sdr.<span style={{ color: '#0050C8' }}>on</span>(<span style={{ color: '#067A4E' }}>&quot;call&quot;</span>, <span style={{ color: '#0050C8' }}>async</span> (caller) =&gt; {'{'}{'\n'}
              {'  '}<span style={{ color: '#0050C8' }}>const</span> lead = <span style={{ color: '#0050C8' }}>await</span> sdr.<span style={{ color: '#0050C8' }}>qualify</span>(caller);{'\n'}
              {'  '}<span style={{ color: '#0050C8' }}>await</span> sdr.<span style={{ color: '#0050C8' }}>handoff</span>(<span style={{ color: '#067A4E' }}>&quot;closer&quot;</span>, {'{ context: lead }'});{'\n'}
              {'}'});
            </pre>
          </div>
        </div>
      </section>

      {/* ── Stats + Globe ────────────────────────────────────────────────────── */}
      <section id="customers" className="py-36 lp-stats-section" style={{ background: 'var(--bg)' }}>
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium mb-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Live worldwide</p>
            <h2 className="lp-font-display text-5xl md:text-6xl font-bold mb-3" style={{ color: 'var(--text)', lineHeight: 1.25 }}>
              10M+ agent messages routed
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Through Agent Messenger every month. From San Francisco to Singapore.</p>
          </div>
          <div ref={globeRef} className="mx-auto" style={{ width: '100%', maxWidth: 1100, aspectRatio: '2 / 1' }} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-center">
            {[
              { val: '99.99', dec: 2, suf: '%', label: 'Delivery SLA' },
              { val: '50', pre: '<', suf: 'ms', label: 'Median latency' },
              { val: '8', label: 'Channels' },
              { val: '40', suf: '+', label: 'Countries live' },
            ].map((s, i) => (
              <div key={i}>
                <div className="lp-font-display text-5xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  <span
                    data-stat-count={s.val}
                    data-decimals={s.dec || '0'}
                    data-prefix={s.pre || ''}
                    data-suffix={s.suf || ''}
                  >
                    {s.pre || ''}{s.val}{s.suf || ''}
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-32" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-medium mb-4 uppercase lp-font-mono" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>FAQ</p>
            <h2 className="lp-font-display text-4xl md:text-5xl font-bold mb-5 tracking-tight" style={{ color: 'var(--text)', lineHeight: 1.05 }}>
              Frequently asked questions.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '28rem' }}>
              Common questions about Agent Messenger, how it integrates with your stack, and what it costs.
            </p>
          </div>
          <div className="space-y-3">
            {[
              ['How is this different from Twilio?', 'Twilio gives you raw channels. Agent Messenger gives you a single agent-aware SDK across channels — plus inter-agent handoffs, audit-grade logs, and replay. Built specifically for autonomous agents, not human operators.'],
              ['What frameworks do you support?', 'OpenAI Agents SDK, Anthropic Claude, LangGraph, CrewAI, Mastra, Vercel AI SDK, and custom orchestrators via raw HTTP / OpenTelemetry.'],
              ['Are you SOC 2 compliant?', 'SOC 2 Type I in progress. HIPAA BAA available for healthcare customers. Audit logs retained 7 years for regulated industries.'],
              ['How does pricing work?', 'Free tier for indie developers. Team plan $99/mo. Enterprise — contact sales.'],
              ['Can I self-host?', 'Open-source SDK + local viewer free forever. Enterprise self-hosted backend available on Team and Enterprise tiers.'],
              ['How long does integration take?', 'Most teams ship a working integration in under an afternoon. Python, TypeScript, and Go SDKs all auto-discover your existing agent framework.'],
              ['I have more questions — who do I contact?', 'Drop us a line at hello@agentmessenger.dev — we typically respond within a few hours.'],
            ].map(([q, a], i) => (
              <details className="lp-details lp-card rounded-2xl p-6" key={i}>
                <summary className="flex items-center justify-between cursor-pointer gap-4">
                  <span className="lp-font-display font-semibold text-lg">{q}</span>
                  <span className="lp-faq-icon shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xl font-light" style={{ background: 'var(--bg-soft)', width: 36, height: 36 }}>+</span>
                </summary>
                <p className="mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="px-6 pt-10 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto rounded-3xl relative overflow-hidden text-center text-white" style={{ background: '#0E0E0E', borderRadius: '2rem' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="white" strokeWidth="1">
              <ellipse cx="600" cy="300" rx="90"  ry="45"  strokeOpacity="0.10" />
              <ellipse cx="600" cy="300" rx="180" ry="90"  strokeOpacity="0.085" />
              <ellipse cx="600" cy="300" rx="270" ry="135" strokeOpacity="0.072" />
              <ellipse cx="600" cy="300" rx="360" ry="180" strokeOpacity="0.060" />
              <ellipse cx="600" cy="300" rx="450" ry="225" strokeOpacity="0.050" />
              <ellipse cx="600" cy="300" rx="540" ry="270" strokeOpacity="0.040" />
              <ellipse cx="600" cy="300" rx="630" ry="315" strokeOpacity="0.032" />
              <ellipse cx="600" cy="300" rx="720" ry="360" strokeOpacity="0.025" />
              <ellipse cx="600" cy="300" rx="810" ry="405" strokeOpacity="0.018" />
            </g>
          </svg>
          <div className="relative py-24 md:py-28 px-6">
            <h2 className="lp-font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight" style={{ lineHeight: 1.02 }}>
              Built for the agent-native stack.
            </h2>
            <p className="text-base md:text-lg mb-10 leading-relaxed mx-auto" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '42rem' }}>
              Take the first step toward agent-native communication.<br className="hidden md:inline" />
              Book a walkthrough today to see how Agent Messenger fits into your stack.
            </p>
            <a href="#" className="inline-flex items-center gap-2 lp-btn-dark lp-pill px-7 py-3 font-medium text-sm">
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer id="company" className="py-16" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0A0A0A', width: 36, height: 36, borderRadius: 12 }}>
                  <span className="lp-font-display font-black text-white text-lg">H</span>
                </div>
                <span className="lp-font-display text-xl font-bold">HyperAgent</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)', maxWidth: '20rem' }}>
                The AI workforce for any business.
              </p>
            </div>
            {[
              { heading: 'Product', links: ['Features','Integrations','Pricing','Changelog'] },
              { heading: 'Developers', links: ['Docs','API reference','GitHub','Status'] },
              { heading: 'Company', links: ['About','Careers','Contact','X / Twitter'] },
            ].map(col => (
              <div key={col.heading}>
                <div className="text-sm font-bold mb-4">{col.heading}</div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {col.links.map(link => <li key={link}><a href="#" className="hover:text-black">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <div>© 2026 HyperAgent Inc. All rights reserved.</div>
            <div className="flex gap-6">
              {['Privacy','Terms','Security'].map(l => <a key={l} href="#" className="hover:text-black">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

// ── Provider icon helper ──────────────────────────────────────────────────────
function ProviderIcon({ type }) {
  const props = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'email':
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
    case 'phone':
      return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    case 'globe':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
    case 'card':
      return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
    case 'cal':
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    case 'send':
      return <svg {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
    default:
      return null
  }
}
