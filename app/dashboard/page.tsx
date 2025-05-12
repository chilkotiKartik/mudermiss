"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DatabaseService, type Challenge, type User } from "@/lib/database-service"
import { Particles } from "@/components/particles"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([])
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showWelcome, setShowWelcome] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

        // Get user data
        const demoUser = await DatabaseService.demoLogin()
        setUser(demoUser)

        // Get challenges
        const allChallenges = await DatabaseService.getChallenges()
        setChallenges(allChallenges)

        // Get recent challenges (random selection for demo)
        const randomChallenges = [...allChallenges].sort(() => 0.5 - Math.random()).slice(0, 3)
        setRecentChallenges(randomChallenges)

        // Get recommended challenges (different random selection)
        const otherRandomChallenges = [...allChallenges]
          .filter((c) => !randomChallenges.includes(c))
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
        setRecommendedChallenges(otherRandomChallenges)

        // Hide welcome message after delay
        setTimeout(() => {
          setShowWelcome(false)
        }, 3000)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  // Radar chart animation
  useEffect(() => {
    if (!canvasRef.current || !user) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 300

    // Radar chart properties
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 100
    const categories = [
      "Data Analysis",
      "Cryptography",
      "Signal Processing",
      "Forensics",
      "Pattern Recognition",
      "Quantum Computing",
    ]

    // Random skill values for demo (0-1)
    const skills = categories.map(() => Math.random() * 0.7 + 0.3)

    // Animation variables
    let animationProgress = 0
    const animationSpeed = 0.02

    const drawRadarChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw axes
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 1

      for (let i = 0; i < categories.length; i++) {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Draw category labels
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const labelX = centerX + (radius + 20) * Math.cos(angle)
        const labelY = centerY + (radius + 20) * Math.sin(angle)
        ctx.fillText(categories[i], labelX, labelY)
      }

      // Draw concentric circles
      for (let r = radius / 4; r <= radius; r += radius / 4) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
        ctx.stroke()
      }

      // Draw data points with animation
      const currentSkills = skills.map((skill) => skill * animationProgress)

      ctx.beginPath()
      for (let i = 0; i < categories.length; i++) {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2
        const skillRadius = radius * currentSkills[i]
        const x = centerX + skillRadius * Math.cos(angle)
        const y = centerY + skillRadius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      // Close the path
      const firstAngle = -Math.PI / 2
      const firstSkillRadius = radius * currentSkills[0]
      const firstX = centerX + firstSkillRadius * Math.cos(firstAngle)
      const firstY = centerY + firstSkillRadius * Math.sin(firstAngle)
      ctx.lineTo(firstX, firstY)

      // Fill the shape
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
      ctx.fill()

      // Stroke the shape
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw points at vertices
      for (let i = 0; i < categories.length; i++) {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2
        const skillRadius = radius * currentSkills[i]
        const x = centerX + skillRadius * Math.cos(angle)
        const y = centerY + skillRadius * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(59, 130, 246, 1)"
        ctx.fill()
      }

      // Update animation progress
      if (animationProgress < 1) {
        animationProgress += animationSpeed
        requestAnimationFrame(drawRadarChart)
      }
    }

    drawRadarChart()
  }, [user, isLoading])

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

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!user || challenges.length === 0) return 0
    return Math.round((user.completedChallenges.length / challenges.length) * 100)
  }

  // Calculate category completion
  const calculateCategoryCompletion = (category: string) => {
    if (!user || challenges.length === 0) return 0
    const categoryTotal = challenges.filter((c) => c.category === category).length
    if (categoryTotal === 0) return 0

    const completedInCategory = challenges.filter(
      (c) => c.category === category && user.completedChallenges.includes(c.id),
    ).length

    return Math.round((completedInCategory / categoryTotal) * 100)
  }

  // Get top categories
  const getTopCategories = () => {
    if (!challenges.length) return []

    const categories = [...new Set(challenges.map((c) => c.category))]
    return categories
      .map((category) => ({
        name: category,
        completion: calculateCategoryCompletion(category),
      }))
      .sort((a, b) => b.completion - a.completion)
      .slice(0, 5)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
          <p className="text-blue-400">Loading detective dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Space-themed background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-grid.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-noise.svg')] bg-repeat opacity-5"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        <Particles />
      </div>

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
              <Link href="/challenges" className="text-sm text-blue-400 hover:text-white">
                Challenges
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

        {/* Welcome message */}
        <AnimatePresence>
          {showWelcome && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-7xl p-4"
            >
              <div className="rounded-lg border border-blue-500/30 bg-blue-900/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-blue-400">Welcome back, Detective</h2>
                    <p className="text-sm text-gray-300">
                      Your current rank is <span className="font-bold text-blue-300">{user.rank}</span>. Continue your
                      investigation to advance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="mx-auto max-w-7xl p-4">
          {/* Tabs */}
          <div className="mb-6 flex border-b border-blue-900/30">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "statistics"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("statistics")}
            >
              Statistics
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "leaderboard"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </button>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Detective profile */}
                  <div className="col-span-1 rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Detective Profile</h2>

                    <div className="mb-6 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 p-1">
                        <div className="h-full w-full rounded-full border border-blue-400/30 bg-black/50"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{user?.name || "Detective"}</h3>
                        <p className="text-sm text-blue-400">{user?.rank || "Cadet"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-gray-400">Investigation Progress</span>
                          <span className="text-blue-400">{calculateProgress()}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-gray-400">Total Points</span>
                          <span className="text-blue-400">{user?.totalPoints || 0}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min((user?.totalPoints || 0) / 20, 100)}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                          ></motion.div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-gray-400">Challenges Completed</span>
                          <span className="text-blue-400">
                            {user?.completedChallenges.length || 0} / {challenges.length}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-600 to-amber-600"
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${((user?.completedChallenges.length || 0) / challenges.length) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: 0.6 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="col-span-1 rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Recent Activity</h2>

                    <div className="space-y-4">
                      {recentChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start gap-3 rounded border border-blue-900/30 bg-blue-900/10 p-3"
                        >
                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/50">
                            <svg
                              className="h-4 w-4 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{challenge.title}</h3>
                            <p className="text-sm text-gray-400">
                              {user?.completedChallenges.includes(challenge.id) ? "Completed" : "In progress"}
                            </p>
                            <p className="mt-1 text-xs text-blue-400">
                              {challenge.points} points • {challenge.difficulty}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      <Link href="/challenges">
                        <div className="mt-2 text-center text-sm text-blue-400 hover:text-blue-300">
                          View all challenges →
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Recommended challenges */}
                  <div className="col-span-1 rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Recommended Challenges</h2>

                    <div className="space-y-3">
                      {recommendedChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="rounded border border-blue-900/30 bg-blue-900/10 p-3"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium text-white">{challenge.title}</h3>
                            <span className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{challenge.description}</p>
                          <div className="mt-2 flex justify-between">
                            <span className="text-xs text-yellow-400">{challenge.points} pts</span>
                            <span className="text-xs text-gray-400">{challenge.timeEstimate}</span>
                          </div>
                        </motion.div>
                      ))}

                      <Link href="/challenges">
                        <div className="mt-2 text-center text-sm text-blue-400 hover:text-blue-300">
                          View all challenges →
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Second row */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Top categories */}
                  <div className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Top Categories</h2>

                    <div className="space-y-4">
                      {getTopCategories().map((category, index) => (
                        <div key={category.name}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-gray-400">{category.name}</span>
                            <span className="text-blue-400">{category.completion}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                              initial={{ width: "0%" }}
                              animate={{ width: `${category.completion}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next rank */}
                  <div className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Next Rank</h2>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 p-1">
                          <div className="h-full w-full rounded-full border border-blue-400/30 bg-black/50"></div>
                        </div>
                        <span className="text-sm text-gray-400">Current</span>
                        <span className="font-medium text-white">{user?.rank}</span>
                      </div>

                      <div className="flex-1">
                        <div className="relative h-2 rounded-full bg-gray-800">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min(user?.totalPoints || 0, 500) / 5}%` }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                          <span>{user?.totalPoints || 0} pts</span>
                          <span>500 pts</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-900 p-1 opacity-70">
                          <div className="h-full w-full rounded-full border border-purple-400/30 bg-black/50"></div>
                        </div>
                        <span className="text-sm text-gray-400">Next</span>
                        <span className="font-medium text-white">Space Crime Analyst</span>
                      </div>
                    </div>

                    <div className="mt-6 rounded border border-blue-900/30 bg-blue-900/10 p-3">
                      <p className="text-sm text-gray-300">
                        Complete <span className="font-bold text-blue-300">5 more challenges</span> to reach the next
                        rank and unlock advanced investigation tools.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "statistics" && (
              <motion.div
                key="statistics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Skill radar */}
                  <div className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Detective Skills</h2>

                    <div className="flex justify-center">
                      <canvas ref={canvasRef} width="300" height="300"></canvas>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-400">
                      Your skill distribution across different investigation domains
                    </p>
                  </div>

                  {/* Challenge statistics */}
                  <div className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-bold text-blue-400">Challenge Statistics</h2>

                    <div className="space-y-6">
                      {/* Difficulty breakdown */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-300">Difficulty Breakdown</h3>

                        <div className="grid grid-cols-4 gap-2">
                          {["Easy", "Medium", "Hard", "Expert"].map((difficulty) => {
                            const count = challenges.filter((c) => c.difficulty === difficulty).length
                            const completed = challenges.filter(
                              (c) => c.difficulty === difficulty && user?.completedChallenges.includes(c.id),
                            ).length

                            return (
                              <div
                                key={difficulty}
                                className="rounded border border-blue-900/30 bg-blue-900/10 p-2 text-center"
                              >
                                <div className={`text-lg font-bold ${getDifficultyColor(difficulty)}`}>{completed}</div>
                                <div className="text-xs text-gray-400">
                                  / {count} {difficulty}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Points by category */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-300">Points by Category</h3>

                        <div className="space-y-2">
                          {getTopCategories().map((category) => {
                            const categoryPoints = challenges
                              .filter((c) => c.category === category.name && user?.completedChallenges.includes(c.id))
                              .reduce((sum, c) => sum + c.points, 0)

                            const totalCategoryPoints = challenges
                              .filter((c) => c.category === category.name)
                              .reduce((sum, c) => sum + c.points, 0)

                            return (
                              <div key={category.name}>
                                <div className="mb-1 flex justify-between text-xs">
                                  <span className="text-gray-400">{category.name}</span>
                                  <span className="text-blue-400">
                                    {categoryPoints} / {totalCategoryPoints} pts
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                                    style={{ width: `${(categoryPoints / totalCategoryPoints) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Time estimates */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-gray-300">Investigation Time</h3>

                        <div className="rounded border border-blue-900/30 bg-blue-900/10 p-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-400">Time Invested</div>
                              <div className="text-xl font-bold text-blue-400">
                                {Math.floor(Math.random() * 10) + 2}h {Math.floor(Math.random() * 60)}m
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Avg. Challenge Time</div>
                              <div className="text-xl font-bold text-blue-400">
                                {Math.floor(Math.random() * 20) + 10}m
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement timeline */}
                <div className="mt-6 rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-bold text-blue-400">Achievement Timeline</h2>

                  <div className="relative pl-8">
                    <div className="absolute left-3 top-0 h-full w-px bg-blue-900/50"></div>

                    {[...Array(5)].map((_, index) => {
                      const date = new Date()
                      date.setDate(date.getDate() - index * 2)

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="mb-6 relative"
                        >
                          <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-900/50">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          </div>

                          <div className="rounded border border-blue-900/30 bg-blue-900/10 p-3">
                            <div className="mb-1 text-xs text-gray-500">
                              {date.toLocaleDateString()} •{" "}
                              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="font-medium text-white">
                              {index === 0
                                ? "Reached rank: Junior Space Detective"
                                : index === 1
                                  ? "Completed challenge: Quantum Data Recovery"
                                  : index === 2
                                    ? "Unlocked new investigation tool: Neural Pattern Analyzer"
                                    : index === 3
                                      ? "Completed challenge: Interstellar Message Authentication"
                                      : "Started investigation on Space Station Artemis"}
                            </div>
                            <div className="mt-1 text-sm text-gray-400">
                              {index === 0
                                ? "Accumulated 200+ investigation points"
                                : index === 1
                                  ? "Recovered critical data from the victim's quantum storage device"
                                  : index === 2
                                    ? "New tool available in your detective arsenal"
                                    : index === 3
                                      ? "Verified the authenticity of a mysterious deep space transmission"
                                      : "Began investigating the death of Dr. Orion Nexus"}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-bold text-blue-400">Top Investigators</h2>

                  <div className="overflow-hidden rounded-lg border border-blue-900/30">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-blue-900/30 bg-blue-900/20">
                          <th className="p-3 text-left text-sm font-medium text-gray-300">Rank</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-300">Detective</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-300">Challenges</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-300">Points</th>
                          <th className="p-3 text-left text-sm font-medium text-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(10)].map((_, index) => {
                          const isCurrentUser = index === 2
                          const randomPoints = 2000 - index * 150 + Math.floor(Math.random() * 50)
                          const randomChallenges = Math.floor(randomPoints / 100)

                          return (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className={`border-b border-blue-900/20 ${
                                isCurrentUser ? "bg-blue-900/20" : index % 2 === 0 ? "bg-blue-900/5" : ""
                              }`}
                            >
                              <td className="p-3 text-sm">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-white">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 p-0.5">
                                    <div className="h-full w-full rounded-full border border-blue-400/30 bg-black/50"></div>
                                  </div>
                                  <div>
                                    <div className={`font-medium ${isCurrentUser ? "text-blue-400" : "text-white"}`}>
                                      {isCurrentUser
                                        ? user?.name || "You"
                                        : index === 0
                                          ? "Agent Stellar"
                                          : index === 1
                                            ? "Detective Nova"
                                            : `Investigator ${String.fromCharCode(65 + index)}`}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {index === 0
                                        ? "Cosmic Detective Master"
                                        : index === 1
                                          ? "Senior Space Investigator"
                                          : index < 5
                                            ? "Interstellar Detective"
                                            : "Space Crime Analyst"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-gray-300">{randomChallenges}</td>
                              <td className="p-3 text-sm font-medium text-blue-400">{randomPoints}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className={`h-2 w-2 rounded-full ${
                                      index < 3 ? "bg-green-500" : index < 7 ? "bg-yellow-500" : "bg-gray-500"
                                    }`}
                                  ></div>
                                  <span className="text-xs text-gray-400">
                                    {index < 3 ? "Online" : index < 7 ? "Investigating" : "Offline"}
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 rounded border border-blue-900/30 bg-blue-900/10 p-3">
                    <h3 className="mb-2 text-sm font-medium text-blue-300">Leaderboard Updates</h3>
                    <p className="text-sm text-gray-400">
                      The leaderboard is updated every 30 minutes. Complete more challenges to improve your ranking and
                      earn special recognition among the elite cosmic detectives.
                    </p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mt-6 rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                  <h2 className="mb-4 text-xl font-bold text-blue-400">Detective Achievements</h2>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[...Array(8)].map((_, index) => {
                      const isUnlocked = index < 3

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`flex flex-col items-center rounded-lg border p-4 text-center ${
                            isUnlocked ? "border-blue-900/50 bg-blue-900/10" : "border-gray-800/50 bg-gray-900/10"
                          }`}
                        >
                          <div
                            className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                              isUnlocked ? "bg-gradient-to-br from-blue-600 to-indigo-900" : "bg-gray-800"
                            }`}
                          >
                            <svg
                              className={`h-8 w-8 ${isUnlocked ? "text-blue-300" : "text-gray-600"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {index === 0 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                              ) : index === 1 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                />
                              ) : index === 2 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              ) : index === 3 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                              ) : index === 4 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              ) : index === 5 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                />
                              ) : index === 6 ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              )}
                            </svg>
                          </div>

                          <h3 className={`text-sm font-medium ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                            {index === 0
                              ? "First Case"
                              : index === 1
                                ? "Evidence Expert"
                                : index === 2
                                  ? "Pattern Finder"
                                  : index === 3
                                    ? "Quantum Decoder"
                                    : index === 4
                                      ? "Code Breaker"
                                      : index === 5
                                        ? "Signal Master"
                                        : index === 6
                                          ? "Space Mapper"
                                          : "Alien Linguist"}
                          </h3>

                          <p className={`mt-1 text-xs ${isUnlocked ? "text-gray-400" : "text-gray-600"}`}>
                            {index === 0
                              ? "Complete your first case"
                              : index === 1
                                ? "Analyze 10 evidence items"
                                : index === 2
                                  ? "Identify 5 hidden patterns"
                                  : index === 3
                                    ? "Decode quantum encryption"
                                    : index === 4
                                      ? "Break 3 advanced ciphers"
                                      : index === 5
                                        ? "Analyze 10 signal patterns"
                                        : index === 6
                                          ? "Map the entire crime scene"
                                          : "Decode alien language"}
                          </p>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
      `}</style>
    </div>
  )
}
