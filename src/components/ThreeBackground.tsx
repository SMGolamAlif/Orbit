import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number>(undefined as any)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      )
      camera.position.z = 50

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer

      containerRef.current.appendChild(renderer.domElement)

      // Create particles
      const particleCount = 100
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200
        positions[i + 1] = (Math.random() - 0.5) * 200
        positions[i + 2] = (Math.random() - 0.5) * 200
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const material = new THREE.PointsMaterial({
        color: 0x35d9ff,
        size: 0.7,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)

        particles.rotation.x += 0.0001
        particles.rotation.y += 0.0002

        const positions = geometry.attributes.position.array as Float32Array
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] -= 0.1
          if (positions[i + 2] < -100) {
            positions[i + 2] = 100
          }
        }
        geometry.attributes.position.needsUpdate = true

        renderer.render(scene, camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationIdRef.current !== undefined) {
          cancelAnimationFrame(animationIdRef.current)
        }
        if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement)
        }
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    } catch (error) {
      console.error('Three.js initialization error:', error)
      return () => {}
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  )
}
