import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

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
    { x: 80,  y: 80,  r: 220, c: '#ff00cc' }, { x: 280, y: 60,  r: 200, c: '#9d00ff' },
    { x: 480, y: 100, r: 240, c: '#00d4ff' }, { x: 700, y: 70,  r: 200, c: '#ff6b00' },
    { x: 900, y: 100, r: 220, c: '#ffe600' }, { x: 150, y: 360, r: 260, c: '#00ff88' },
    { x: 380, y: 420, r: 240, c: '#ff0066' }, { x: 600, y: 380, r: 260, c: '#0055ff' },
    { x: 830, y: 420, r: 240, c: '#ff00aa' }, { x: 200, y: 200, r: 80,  c: '#ffffff' },
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

export default function HeroCubes() {
  const mountRef  = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    let stopped = false
    const mount = mountRef.current
    if (!mount) return

    let renderer, onMM, onML, onResize

    try {
      const envCanvas = makeEnvCanvas()
      const getSize = () => Math.max(280, Math.min(mount.clientWidth || 460, 520))
      let s = getSize()

      const scene = new THREE.Scene()
      scene.background = null
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
      camera.position.set(0, 0, 11)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(s, s)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
      mount.appendChild(renderer.domElement)

      scene.environment = makeEnv(renderer, envCanvas)

      const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(4, 6, 5); scene.add(key)
      const fill = new THREE.DirectionalLight(0xa0c8ff, 0.6); fill.position.set(-5, -2, 3); scene.add(fill)
      const rim  = new THREE.DirectionalLight(0xffb088, 0.5); rim.position.set(0, -5, -3); scene.add(rim)
      scene.add(new THREE.AmbientLight(0xffffff, 0.2))

      const group = new THREE.Group(); scene.add(group)
      const geo = new RoundedBoxGeometry(1, 1, 1, 8, 0.16)

      const makeMat = (hueShift = 0) => new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0d0d0d), metalness: 1, roughness: 0.08,
        envMapIntensity: 3, iridescence: 1, iridescenceIOR: 1.8,
        iridescenceThicknessRange: [100 + hueShift, 1100 + hueShift],
        clearcoat: 1, clearcoatRoughness: 0.04, reflectivity: 1,
        anisotropy: 0.5, anisotropyRotation: Math.PI / 4,
      })

      const positions = [
        { x: -1.55, y:  1.05, z:  0.4, rx:  0.25, ry: -0.4,  rz:  0.1,  hue:   0 },
        { x:  0.15, y:  1.45, z: -0.5, rx: -0.15, ry:  0.5,  rz: -0.1,  hue: 120 },
        { x:  1.60, y:  0.85, z:  0.2, rx:  0.3,  ry: -0.2,  rz:  0.2,  hue: 240 },
        { x: -1.45, y: -0.95, z: -0.4, rx: -0.2,  ry:  0.6,  rz: -0.15, hue: 360 },
        { x:  0.05, y: -1.40, z:  0.5, rx:  0.4,  ry: -0.5,  rz:  0.05, hue: 480 },
        { x:  1.50, y: -0.70, z: -0.3, rx: -0.3,  ry:  0.3,  rz:  0.2,  hue: 600 },
      ]
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
      const cubes = positions.map((p, i) => {
        const m = new THREE.Mesh(geo, makeMat(p.hue))
        m.position.set(p.x, p.y, p.z); m.rotation.set(p.rx, p.ry, p.rz); m.scale.setScalar(1.1)
        m.userData = { basePos: { ...p }, phase: i * 1.0 }; group.add(m); return m
      })

      onMM = e => {
        mouse.tx = (e.clientX - window.innerWidth / 2) / (window.innerWidth * 0.5)
        mouse.ty = (e.clientY - window.innerHeight / 2) / (window.innerHeight * 0.5)
      }
      onML = () => { mouse.tx = 0; mouse.ty = 0 }
      window.addEventListener('mousemove', onMM)
      window.addEventListener('mouseleave', onML)

      let t = 0
      function animHero() {
        if (stopped) return
        t += 0.005
        mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05
        group.rotation.y = Math.sin(t * 0.35) * 0.22 + mouse.x * 0.45
        group.rotation.x = Math.cos(t * 0.28) * 0.04 - mouse.y * 0.25
        cubes.forEach((c, i) => {
          const b = c.userData.basePos; const ph = c.userData.phase
          c.position.x = b.x + Math.cos(t * 1.1 + ph) * 0.03
          c.position.y = b.y + Math.sin(t * 1.3 + ph) * 0.04
          c.position.z = Math.sin(t * 0.7 + ph) * 0.08
          c.rotation.y += 0.0025 + i * 0.0004
          c.rotation.x += 0.0015 + (i % 2 ? 0.0006 : -0.0006)
          c.rotation.z = Math.sin(t * 0.5 + ph) * 0.1
          c.scale.setScalar(1.05)
        })
        renderer.render(scene, camera)
        requestAnimationFrame(animHero)
      }
      animHero()

      onResize = () => {
        const ns = getSize()
        renderer.setSize(ns, ns)
        camera.aspect = 1
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)
      setTimeout(onResize, 100)
    } catch (e) {
      console.error('[hero-cubes]', e)
    }

    return () => {
      stopped = true
      if (onMM) window.removeEventListener('mousemove', onMM)
      if (onML) window.removeEventListener('mouseleave', onML)
      if (onResize) window.removeEventListener('resize', onResize)
      if (renderer) {
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
        renderer.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', aspectRatio: '1 / 1', background: 'transparent', maxWidth: 520 }}
    />
  )
}
