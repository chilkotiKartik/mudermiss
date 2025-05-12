"use client"

import { useEffect, useRef } from "react"

export const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particlesArray: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
      alphaSpeed: number
    }[] = []

    const numberOfParticles = 150
    const maxDistance = 150
    let mouseX = 0
    let mouseY = 0
    let isMouseMoving = false
    let mouseTimer: NodeJS.Timeout

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
      alphaSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5

        // Create a blue/cyan color palette
        const hue = Math.random() * 60 + 180 // 180-240 is blue/cyan range
        const saturation = Math.random() * 30 + 70 // 70-100%
        const lightness = Math.random() * 20 + 60 // 60-80%
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`

        this.alpha = Math.random() * 0.5 + 0.1
        this.alphaSpeed = Math.random() * 0.01 + 0.005
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0

        // Pulsate alpha
        this.alpha += this.alphaSpeed
        if (this.alpha > 0.7 || this.alpha < 0.1) {
          this.alphaSpeed *= -1
        }

        // Mouse interaction
        if (isMouseMoving) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            this.speedX += dx * force * 0.01
            this.speedY += dy * force * 0.01

            // Limit speed
            const maxSpeed = 2
            const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
            if (currentSpeed > maxSpeed) {
              this.speedX = (this.speedX / currentSpeed) * maxSpeed
              this.speedY = (this.speedY / currentSpeed) * maxSpeed
            }
          }
        }

        // Gradually slow down
        this.speedX *= 0.99
        this.speedY *= 0.99
      }

      draw() {
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    function init() {
      particlesArray = []
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle())
      }
    }

    function connectParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            // Calculate line opacity based on distance
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(100, 180, 255, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Connect particles with lines
      connectParticles()

      requestAnimationFrame(animate)
    }

    // Handle mouse movement
    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      isMouseMoving = true

      // Reset the timer
      clearTimeout(mouseTimer)
      mouseTimer = setTimeout(() => {
        isMouseMoving = false
      }, 2000)
    }

    // Initialize and start animation
    init()
    animate()

    // Event listeners
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    })

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        init()
      })
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimer)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />
}
