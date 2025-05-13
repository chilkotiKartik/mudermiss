"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TypewriterEffect } from "./typewriter-effect"

interface EnhancedSpaceMurderWelcomeProps {
  onComplete?: () => void
  skipable?: boolean
}

export function EnhancedSpaceMurderWelcome({ onComplete, skipable = true }: EnhancedSpaceMurderWelcomeProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const [showFinalText, setShowFinalText] = useState(false)
  const [showHologram, setShowHologram] = useState(false)
  const [showScanEffect, setShowScanEffect] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hologramRef = useRef<HTMLCanvasElement>(null)

  const bootMessages = [
    "Initializing quantum secure connection...",
    "Establishing neural interface link...",
    "Calibrating holographic display matrix...",
    "Loading cosmic crime database...",
    "Authenticating detective credentials...",
    "Scanning for quantum entanglement signatures...",
    "Initializing AI investigation assistant...",
    "Preparing case files and evidence repository...",
    "Establishing connection to deep space network...",
    "System ready. Welcome, Detective.",
  ]

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle properties
    const particleCount = 150
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      pulse: boolean
      pulseSpeed: number
    }[] = []

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() > 0.7,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Pulse effect for some particles
        if (particle.pulse) {
          particle.opacity += particle.pulseSpeed
          if (particle.opacity > 0.8 || particle.opacity < 0.2) {
            particle.pulseSpeed *= -1
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Draw glow effect for some particles
        if (particle.size > 1.5) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity * 0.3
          ctx.fill()
        }
      }

      // Continue animation
      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Hologram animation
  useEffect(() => {
    if (!showHologram) return

    const canvas = hologramRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 200
    canvas.height = 200

    // Draw hologram
    const drawHologram = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw circular base
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 150, 255, 0.5)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw grid lines
      ctx.strokeStyle = "rgba(0, 150, 255, 0.3)"
      ctx.lineWidth = 1

      // Horizontal lines
      for (let y = 40; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 - 80, y)
        ctx.lineTo(canvas.width / 2 + 80, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let x = canvas.width / 2 - 80; x <= canvas.width / 2 + 80; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 40)
        ctx.lineTo(x, canvas.height - 40)
        ctx.stroke()
      }

      // Draw space station
      const time = Date.now() / 1000
      const rotation = time % (Math.PI * 2)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation)

      // Main body
      ctx.fillStyle = "rgba(100, 200, 255, 0.7)"
      ctx.fillRect(-30, -10, 60, 20)

      // Solar panels
      ctx.fillStyle = "rgba(50, 150, 255, 0.7)"
      ctx.fillRect(-50, -30, 20, 60)
      ctx.fillRect(30, -30, 20, 60)

      // Antenna
      ctx.beginPath()
      ctx.moveTo(0, -10)
      ctx.lineTo(0, -30)
      ctx.strokeStyle = "rgba(200, 230, 255, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()

      // Scan effect
      if (showScanEffect) {
        const scanTime = (Date.now() % 3000) / 3000
        const scanY = canvas.height * scanTime

        ctx.fillStyle = "rgba(0, 200, 255, 0.2)"
        ctx.fillRect(0, scanY - 5, canvas.width, 10)
      }

      // Hologram flicker effect
      if (Math.random() > 0.97) {
        ctx.fillStyle = "rgba(0, 150, 255, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      requestAnimationFrame(drawHologram)
    }

    drawHologram()
  }, [showHologram, showScanEffect])

  useEffect(() => {
    // Show skip button after a delay
    const skipTimer = setTimeout(() => {
      setShowSkip(true)
    }, 2000)

    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1

        // Update phase based on progress
        const newPhase = Math.floor((newProgress / 100) * bootMessages.length)
        if (newPhase !== currentPhase) {
          setCurrentPhase(newPhase)

          // Show hologram at 30%
          if (newProgress >= 30 && !showHologram) {
            setShowHologram(true)
          }

          // Show scan effect at 60%
          if (newProgress >= 60 && !showScanEffect) {
            setShowScanEffect(true)
          }
        }

        // Complete animation
        if (newProgress >= 100) {
          clearInterval(interval)
          setShowFinalText(true)
          setTimeout(() => {
            onComplete && onComplete()
          }, 2000)
        }

        return newProgress > 100 ? 100 : newProgress
      })
    }, 120)

    return () => {
      clearInterval(interval)
      clearTimeout(skipTimer)
    }
  }, [currentPhase, onComplete, bootMessages.length, showHologram, showScanEffect])

  const handleSkip = () => {
    onComplete && onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/space-grid.svg')] bg-repeat opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Orbital grid lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="h-[200px] w-[200px] rounded-full border border-blue-500/30"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 3, delay: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="h-[400px] w-[400px] rounded-full border border-blue-500/20"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 4, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="h-[600px] w-[600px] rounded-full border border-blue-500/10"
        ></motion.div>
      </div>

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-blue-400">COSMIC CRIME INVESTIGATION DIVISION</h1>
          <p className="text-xl text-gray-400">DEEP SPACE DETECTIVE PROTOCOL</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          {/* Hologram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showHologram ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="w-[200px] h-[200px] rounded-full bg-blue-900/10 border border-blue-500/30 flex items-center justify-center overflow-hidden">
              <canvas ref={hologramRef} width="200" height="200" className="z-10" />

              {/* Hologram base */}
              <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-blue-500/30 to-transparent"></div>

              {/* Hologram light beam */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-full bg-gradient-to-t from-blue-500/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-1 bg-blue-500/50 blur-md"></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs text-blue-400/70 font-mono">
              STATION ARTEMIS
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-2xl h-60 overflow-hidden rounded border border-blue-900/50 bg-black/50 p-4 font-mono text-sm text-green-500 relative"
          >
            {/* Terminal header */}
            <div className="absolute top-0 left-0 w-full h-6 bg-blue-900/30 flex items-center px-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
              </div>
              <div className="text-xs text-blue-300/70 absolute left-1/2 -translate-x-1/2">CCID-TERMINAL</div>
            </div>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentPhase < bootMessages.length ? (
                    <TypewriterEffect text={`> ${bootMessages[currentPhase]}`} speed={15} />
                  ) : (
                    <TypewriterEffect
                      text="> System initialization complete. Welcome to the Cosmic Crime Investigation Division."
                      speed={15}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Terminal scan lines effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 pointer-events-none bg-[url('/scanline.svg')] opacity-5"></div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>System Initialization</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Glowing dot at progress end */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-400/80 shadow-[0_0_10px_rgba(59,130,246,0.7)] z-10"
              initial={{ left: "0%" }}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Final text */}
        <AnimatePresence>
          {showFinalText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-center"
            >
              <h2 className="text-2xl font-bold text-blue-400">INVESTIGATION READY</h2>
              <p className="mt-2 text-gray-300">All systems operational. Begin your investigation, Detective.</p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
                className="mt-4 flex justify-center"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        {skipable && showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 rounded-full border border-blue-900/50 bg-black/50 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-900/20"
            onClick={handleSkip}
          >
            Skip Introduction
          </motion.button>
        )}
      </div>

      {/* Scanning effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"
          initial={{ top: "-100%" }}
          animate={{ top: "100%" }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
        ></motion.div>
      </div>

      {/* Add global styles for the star animation */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
