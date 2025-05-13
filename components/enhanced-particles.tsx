"use client"

import { useEffect, useRef, useState } from "react"

interface EnhancedParticlesProps {
  className?: string
  quantity?: number
  color?: string
  speed?: number
  interactive?: boolean
  glow?: boolean
}

export function EnhancedParticles({
  className = "",
  quantity = 100,
  color = "#3b82f6",
  speed = 1,
  interactive = true,
  glow = true,
}: EnhancedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseInCanvas, setIsMouseInCanvas] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect()
      setDimensions({ width, height })
      canvas.width = width
      canvas.height = height
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Parse the color to get RGB values
    let r = 59,
      g = 130,
      b = 246 // Default blue
    if (color.startsWith("#")) {
      const hex = color.slice(1)
      r = Number.parseInt(hex.slice(0, 2), 16)
      g = Number.parseInt(hex.slice(2, 4), 16)
      b = Number.parseInt(hex.slice(4, 6), 16)
    }

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      glowColor: string
      glowSize: number
      originalSize: number
      pulseDirection: number
      pulseSpeed: number
      connections: Particle[]

      constructor() {
        this.x = Math.random() * dimensions.width
        this.y = Math.random() * dimensions.height
        this.originalSize = Math.random() * 2 + 1
        this.size = this.originalSize
        this.speedX = (Math.random() - 0.5) * speed
        this.speedY = (Math.random() - 0.5) * speed

        // Random variation of the base color
        const variation = 30
        const rVar = Math.max(0, Math.min(255, r + Math.floor((Math.random() - 0.5) * variation)))
        const gVar = Math.max(0, Math.min(255, g + Math.floor((Math.random() - 0.5) * variation)))
        const bVar = Math.max(0, Math.min(255, b + Math.floor((Math.random() - 0.5) * variation)))

        this.color = `rgba(${rVar}, ${gVar}, ${bVar}, ${Math.random() * 0.5 + 0.3})`
        this.glowColor = `rgba(${rVar}, ${gVar}, ${bVar}, 0.15)`
        this.glowSize = this.size * 3

        // Pulsing effect
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
        this.pulseSpeed = Math.random() * 0.02 + 0.01

        this.connections = []
      }

      update(mouseX: number, mouseY: number, isMouseInCanvas: boolean) {
        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = dimensions.width
        if (this.x > dimensions.width) this.x = 0
        if (this.y < 0) this.y = dimensions.height
        if (this.y > dimensions.height) this.y = 0

        // Pulsing size effect
        this.size += this.pulseSpeed * this.pulseDirection
        if (this.size > this.originalSize * 1.5 || this.size < this.originalSize * 0.7) {
          this.pulseDirection *= -1
        }

        // Mouse interaction
        if (interactive && isMouseInCanvas) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            // Repel from mouse
            const force = (maxDistance - distance) / maxDistance
            this.speedX += dx * force * 0.02
            this.speedY += dy * force * 0.02

            // Limit speed
            const maxSpeed = 3
            const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
            if (currentSpeed > maxSpeed) {
              this.speedX = (this.speedX / currentSpeed) * maxSpeed
              this.speedY = (this.speedY / currentSpeed) * maxSpeed
            }

            // Increase size when near mouse
            this.glowSize = this.size * (3 + force * 2)
          }
        }

        // Gradually slow down
        this.speedX *= 0.99
        this.speedY *= 0.99
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw glow effect
        if (glow) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2)
          ctx.fillStyle = this.glowColor
          ctx.fill()
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < quantity; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update(mousePosition.x, mousePosition.y, isMouseInCanvas)
        particle.draw(ctx)
      }

      // Draw connections between nearby particles
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.1)`
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => {
      setIsMouseInCanvas(true)
    }

    const handleMouseLeave = () => {
      setIsMouseInCanvas(false)
    }

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseenter", handleMouseEnter)
      canvas.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseenter", handleMouseEnter)
        canvas.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [dimensions, color, quantity, speed, interactive, glow, mousePosition, isMouseInCanvas])

  return <canvas ref={canvasRef} className={className} />
}
