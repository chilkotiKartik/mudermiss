"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DatabaseService, type Challenge, type User } from "@/lib/database-service"
import { EnhancedParticles } from "./enhanced-particles"

interface InteractiveChallengesDashboardProps {
  userName?: string
}

export function InteractiveChallengesDashboard({ userName = "Detective" }: InteractiveChallengesDashboardProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [answer, setAnswer] = useState("")
  const [answerResult, setAnswerResult] = useState<"correct" | "incorrect" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingCategory, setIsChangingCategory] = useState(false)
  const [isChangingChallenge, setIsChangingChallenge] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Load user and challenges on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
        if (!isLoggedIn) {
          router.push("/login")
          return
        }

        // Get user data (in a real app, this would fetch from the server)
        const demoUser = await DatabaseService.demoLogin()
        setUser(demoUser)

        // Get challenges
        const allChallenges = await DatabaseService.getChallenges()
        setChallenges(allChallenges)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(allChallenges.map((c) => c.category)))
        setCategories(uniqueCategories)

        // Set default selected category
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  // Toggle challenge completion
  const toggleChallengeCompletion = async (challengeId: string) => {
    if (!user) return

    try {
      let updatedCompletedChallenges: string[]

      if (user.completedChallenges.includes(challengeId)) {
        // Remove from completed challenges
        updatedCompletedChallenges = user.completedChallenges.filter((id) => id !== challengeId)
      } else {
        // Add to completed challenges
        updatedCompletedChallenges = [...user.completedChallenges, challengeId]

        // Show confetti
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      // Update user data
      const updatedUser = await DatabaseService.updateCompletedChallenges(user.email, updatedCompletedChallenges)
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating completed challenges:", error)
    }
  }

  // Submit challenge answer
  const submitAnswer = async () => {
    if (!selectedChallenge || !answer.trim()) return

    setIsSubmitting(true)
    setAnswerResult(null)

    try {
      const isCorrect = await DatabaseService.submitChallengeAnswer(selectedChallenge.id, answer)

      setAnswerResult(isCorrect ? "correct" : "incorrect")

      if (isCorrect) {
        // Mark as completed if correct
        if (user && !user.completedChallenges.includes(selectedChallenge.id)) {
          toggleChallengeCompletion(selectedChallenge.id)
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400"
      case "Medium":
        return "text-yellow-400"
      case "Hard":
        return "text-orange-400"
      case "Expert":
        return "text-red-400"
      default:
        return "text-blue-400"
    }
  }

  // Get difficulty background color
  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900/50 text-green-400"
      case "Medium":
        return "bg-yellow-900/50 text-yellow-400"
      case "Hard":
        return "bg-orange-900/50 text-orange-400"
      case "Expert":
        return "bg-red-900/50 text-red-400"
      default:
        return "bg-blue-900/50 text-blue-400"
    }
  }

  // Handle category change with animation
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return

    setIsChangingCategory(true)
    setTimeout(() => {
      setSelectedCategory(category)
      setIsChangingCategory(false)
    }, 300)
  }

  // Handle challenge selection with animation
  const handleChallengeSelect = (challenge: Challenge) => {
    setIsChangingChallenge(true)
    setTimeout(() => {
      setSelectedChallenge(challenge)
      setAnswer("")
      setAnswerResult(null)
      setShowHint(false)
      setCurrentHintIndex(0)
      setIsChangingChallenge(false)
    }, 300)
  }

  // Handle back button
  const handleBackClick = () => {
    setIsChangingChallenge(true)
    setTimeout(() => {
      setSelectedChallenge(null)
      setAnswer("")
      setAnswerResult(null)
      setIsChangingChallenge(false)
    }, 300)
  }

  // Show next hint
  const showNextHint = () => {
    if (!selectedChallenge) return

    if (currentHintIndex < selectedChallenge.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
          <p className="text-blue-400">Loading investigation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Enhanced particles background */}
      <div className="absolute inset-0 z-0">
        <EnhancedParticles className="w-full h-full" quantity={120} color="#3b82f6" />
      </div>

      {/* Space-themed background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-grid.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-noise.svg')] bg-repeat opacity-5"></div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 20}%`,
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `confetti ${Math.random() * 2 + 1}s ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-blue-900/50 bg-black/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 p-2">
                <div className="h-full w-full rounded-full border border-blue-400/30"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Space Murder Detective</h1>
                <p className="text-xs text-gray-400">Cosmic Crime Investigation Division</p>
              </div>
            </div>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-sm text-blue-400 hover:text-white">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isLoggedIn")
                  router.push("/")
                }}
                className="text-sm text-blue-400 hover:text-white"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-7xl p-4">
          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="rounded-lg border border-blue-500/30 bg-blue-900/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-blue-400">Welcome, {userName}</h2>
                  <p className="text-sm text-gray-300">
                    Select a challenge category to begin your investigation. Complete challenges to earn points and
                    advance your rank.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Challenge categories and details */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Categories list (hidden when viewing challenge details on mobile) */}
            <div
              className={`lg:col-span-${selectedChallenge ? "1" : "3"} ${selectedChallenge ? "hidden lg:block" : "block"}`}
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-2xl font-bold text-blue-400"
              >
                Investigation Challenges
              </motion.h2>

              {/* Category tabs */}
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Challenge list */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={isChangingCategory ? "opacity-0" : ""}
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {challenges
                      .filter((challenge) => challenge.category === selectedCategory)
                      .map((challenge, index) => {
                        const isCompleted = user?.completedChallenges.includes(challenge.id) || false
                        return (
                          <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`cursor-pointer rounded-lg p-4 transition-all ${
                              isCompleted
                                ? "border border-green-800/50 bg-green-900/10 hover:bg-green-900/20"
                                : "border border-blue-900/50 bg-blue-900/10 hover:bg-blue-900/20"
                            }`}
                            onClick={() => handleChallengeSelect(challenge)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-bold text-blue-300">{challenge.title}</h3>
                              {isCompleted && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                  className="h-5 w-5 text-green-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </motion.svg>
                              )}
                            </div>
                            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{challenge.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${getDifficultyBgColor(challenge.difficulty)}`}
                              >
                                {challenge.difficulty}
                              </span>
                              <span className="text-xs text-yellow-400">{challenge.points} pts</span>
                            </div>
                          </motion.div>
                        )
                      })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Challenge details */}
            <AnimatePresence>
              {selectedChallenge && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 15 }}
                  className="lg:col-span-2"
                >
                  <div className="sticky top-4">
                    <div className="rounded-lg border border-blue-900/50 bg-black/70 p-6 backdrop-blur-md">
                      <div className="mb-4 flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleBackClick}
                          className="flex items-center gap-1 rounded-full border border-blue-900/50 bg-black/50 px-3 py-1 text-sm text-blue-400 hover:bg-blue-900/20"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </motion.button>
                        <div
                          className={`rounded px-2 py-0.5 text-xs ${getDifficultyBgColor(selectedChallenge.difficulty)}`}
                        >
                          {selectedChallenge.difficulty} • {selectedChallenge.points} pts
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedChallenge.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={isChangingChallenge ? "opacity-0" : ""}
                        >
                          <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="mb-2 text-2xl font-bold text-blue-400"
                          >
                            {selectedChallenge.title}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mb-4 text-gray-300"
                          >
                            {selectedChallenge.description}
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mb-6 rounded border border-blue-900/30 bg-blue-900/10 p-4"
                          >
                            <h3 className="mb-2 font-bold text-blue-300">Instructions</h3>
                            <div className="text-gray-300 whitespace-pre-line">{selectedChallenge.instructions}</div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="mb-6"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="mb-2 font-bold text-blue-300">Hints</h3>
                              <button
                                onClick={() => setShowHint(!showHint)}
                                className="text-xs text-blue-400 hover:text-blue-300"
                              >
                                {showHint ? "Hide Hints" : "Show Hints"}
                              </button>
                            </div>

                            <AnimatePresence>
                              {showHint && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <ul className="space-y-2">
                                    {selectedChallenge.hints
                                      .slice(0, currentHintIndex + 1)
                                      .map((hint: string, index: number) => (
                                        <motion.li
                                          key={index}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                          className="flex items-start gap-2"
                                        >
                                          <span className="mt-1 text-blue-500">•</span>
                                          <span className="text-gray-300">{hint}</span>
                                        </motion.li>
                                      ))}
                                  </ul>

                                  {currentHintIndex < selectedChallenge.hints.length - 1 && (
                                    <motion.button
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.5 }}
                                      onClick={showNextHint}
                                      className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                      Show Next Hint
                                    </motion.button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="mb-6"
                          >
                            <h3 className="mb-2 font-bold text-blue-300">Submit Solution</h3>
                            <div className="rounded border border-blue-900/30 bg-blue-900/5 p-4">
                              <textarea
                                className="mb-4 h-32 w-full rounded border border-blue-900/50 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Enter your solution or findings here..."
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                              ></textarea>

                              <AnimatePresence>
                                {answerResult && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mb-4 rounded p-3 ${
                                      answerResult === "correct"
                                        ? "bg-green-900/20 text-green-400"
                                        : "bg-red-900/20 text-red-400"
                                    }`}
                                  >
                                    {answerResult === "correct"
                                      ? "Correct! Great work, detective."
                                      : "Incorrect. Try again with a different approach."}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex justify-between">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                  onClick={submitAnswer}
                                  disabled={isSubmitting || !answer.trim()}
                                >
                                  {isSubmitting ? (
                                    <span className="flex items-center gap-2">
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
                                      Checking...
                                    </span>
                                  ) : (
                                    "Submit Solution"
                                  )}
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleChallengeCompletion(selectedChallenge.id)}
                                  className={`flex items-center gap-2 rounded px-4 py-2 font-medium ${
                                    user?.completedChallenges.includes(selectedChallenge.id)
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-gray-700 text-white hover:bg-gray-600"
                                  }`}
                                >
                                  {user?.completedChallenges.includes(selectedChallenge.id) ? (
                                    <>
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Completed
                                    </>
                                  ) : (
                                    "Mark Complete"
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>

                          <div className="text-center text-sm text-gray-500">
                            <p>Estimated completion time: {selectedChallenge.timeEstimate}</p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Add global styles for animations */}
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
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
