"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { DatabaseService } from "@/lib/database-service"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  // Auto-login for demo mode
  useEffect(() => {
    if (isDemo) {
      handleDemoLogin()
    }
  }, [isDemo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Attempt login
      const user = await DatabaseService.login(email, password)

      if (user) {
        // Store login state
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", email)

        // Redirect to dashboard page
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)

    try {
      // Demo login
      await DatabaseService.demoLogin()

      // Store login state
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", "demo@space-detective.org")

      // Redirect to dashboard page after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      setError("An error occurred with demo login. Please try again.")
      setIsDemoLoading(false)
    }
  }

  if (isDemoLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="mb-8 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
        <h2 className="text-xl font-bold text-blue-400">Initializing Demo Mode</h2>
        <p className="mt-2 text-gray-400">Preparing your detective console...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Space-themed background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-grid.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-noise.svg')] bg-repeat opacity-5"></div>

      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <Link href="/" className="absolute left-4 top-4 flex items-center gap-2 text-blue-400 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 p-3">
              <div className="h-full w-full rounded-full border border-blue-400/30"></div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-900/50 bg-black/70 p-8 backdrop-blur-md">
            <h1 className="mb-6 text-center text-2xl font-bold text-blue-400">Secure Authentication</h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-blue-900/50 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="agent@nasa.gov"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-blue-900/50 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="mb-4 rounded bg-red-900/20 p-3 text-sm text-red-400">{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded bg-gradient-to-r from-blue-600 to-indigo-700 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Access Terminal"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button type="button" onClick={handleDemoLogin} className="text-sm text-blue-400 hover:text-blue-300">
                Use Demo Account
              </button>
            </div>
          </div>
        </motion.div>
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
