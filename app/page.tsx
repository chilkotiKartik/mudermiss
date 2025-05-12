"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FirstVisitController } from "@/components/first-visit-controller"
import { SpaceWelcomeAnimation } from "@/components/space-welcome-animation"

export default function HomePage() {
  const router = useRouter()
  const [showWelcome, setShowWelcome] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn) {
      // Redirect to challenges page if already logged in
      router.push("/challenges")
    } else {
      setIsLoading(false)
    }

    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <FirstVisitController storageKey="space-murder-welcome-shown">
      {showWelcome ? (
        <SpaceWelcomeAnimation onComplete={() => setShowWelcome(false)} />
      ) : (
        <div className="relative min-h-screen bg-black text-white">
          {/* Animated background */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

          {/* Space overlay */}
          <div className="absolute inset-0 z-20 bg-[url('/space-grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 z-20 bg-[url('/space-noise.svg')] opacity-5 mix-blend-soft-light"></div>

          {/* Animated stars */}
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

          {/* Content */}
          <div className="relative z-30 flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    SPACE MURDER DETECTIVE
                  </span>
                </h1>
                <p className="mb-8 text-xl text-gray-400 md:text-2xl">
                  Solve the mysterious death of Dr. Orion Nexus aboard Space Station Artemis
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-px font-bold text-white"
                  >
                    <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700 group-hover:animate-none"></span>
                    <span className="relative flex items-center gap-2 rounded-full bg-black px-6 py-3 transition-all duration-200 group-hover:bg-transparent">
                      <span>Begin Investigation</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="/login?demo=true"
                    className="flex items-center gap-2 rounded-full border border-cyan-900/50 bg-black/60 px-6 py-3 font-bold text-cyan-400 backdrop-blur-sm transition-all hover:bg-cyan-900/20"
                  >
                    <span>Demo Mode</span>
                  </Link>
                </div>
              </motion.div>
            </main>

            <footer className="relative z-30 py-6 text-center text-sm text-gray-600">
              <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-900">
                      <span className="font-mono text-[8px] text-white">CSID</span>
                    </div>
                    <span className="text-xs text-gray-500">COSMIC CRIME INVESTIGATION DIVISION</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Authorized by the Interplanetary Detective Agency • Stardate {new Date().getFullYear()}.
                    {Math.floor(Math.random() * 999)}
                  </div>
                </div>
              </div>
            </footer>
          </div>

          {/* Floating space elements */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <div className="absolute -right-40 top-40 h-80 w-80 animate-float rounded-full bg-blue-500/5 blur-3xl"></div>
            <div className="absolute -left-40 bottom-40 h-80 w-80 animate-float-delayed rounded-full bg-purple-500/5 blur-3xl"></div>
          </div>

          {/* Add global styles for the star animation */}
          <style jsx global>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
          `}</style>
        </div>
      )}
    </FirstVisitController>
  )
}
