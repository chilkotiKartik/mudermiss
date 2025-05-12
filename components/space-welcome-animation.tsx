"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TypewriterEffect } from "./typewriter-effect"

interface SpaceWelcomeAnimationProps {
  onComplete?: () => void
  skipable?: boolean
}

export function SpaceWelcomeAnimation({ onComplete, skipable = true }: SpaceWelcomeAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const [showFinalText, setShowFinalText] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    const particleCount = 100
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
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

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
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
  }, [currentPhase, onComplete, bootMessages.length])

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-12 h-40 w-full max-w-2xl overflow-hidden rounded border border-blue-900/50 bg-black/50 p-4 font-mono text-sm text-green-500"
        >
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
        </motion.div>

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
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
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
