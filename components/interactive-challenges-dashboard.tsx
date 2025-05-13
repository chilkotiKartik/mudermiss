"use client"

import { useState, useEffect } from "react"
import { DatabaseService, type Challenge } from "@/lib/database-service"
import { TypewriterEffect } from "@/components/typewriter-effect"
import Link from "next/link"

interface InteractiveChallengesDashboardProps {
  userName: string
}

export function InteractiveChallengesDashboard({ userName }: InteractiveChallengesDashboardProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submissionStatus, setSubmissionStatus] = useState<{ [key: string]: "idle" | "success" | "error" }>({})
  const [userAnswer, setUserAnswer] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true)
      try {
        const allChallenges = await DatabaseService.getChallenges()
        setChallenges(allChallenges)

        // Simulate loading completed challenges for the demo user
        const demoUser = await DatabaseService.demoLogin()
        setCompletedChallenges(demoUser.completedChallenges)
      } catch (error) {
        console.error("Error loading challenges:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  const categories = ["All", ...new Set(challenges.map((challenge) => challenge.category))]

  const filteredChallenges =
    selectedCategory === "All" ? challenges : challenges.filter((challenge) => challenge.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleChallengeCompletion = async (challengeId: string, answer: string) => {
    setSubmissionStatus((prev) => ({ ...prev, [challengeId]: "idle" }))

    // Check answer
    const isCorrect = await DatabaseService.submitChallengeAnswer(challengeId, answer)

    if (isCorrect) {
      setCompletedChallenges((prev) => [...prev, challengeId])
      setSubmissionStatus((prev) => ({ ...prev, [challengeId]: "success" }))

      // Update user's completed challenges in the database
      await DatabaseService.updateCompletedChallenges("demo-user", [...completedChallenges, challengeId])

      // Clear answer
      setUserAnswer((prev) => ({ ...prev, [challengeId]: "" }))
    } else {
      setSubmissionStatus((prev) => ({ ...prev, [challengeId]: "error" }))
    }

    // Reset status after a delay
    setTimeout(() => {
      setSubmissionStatus((prev) => ({ ...prev, [challengeId]: "idle" }))
    }, 3000)
  }

  const handleAnswerChange = (challengeId: string, answer: string) => {
    setUserAnswer((prev) => ({ ...prev, [challengeId]: answer }))
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Space-themed background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-grid.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 z-0 bg-[url('/space-noise.svg')] bg-repeat opacity-5"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl p-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400">
            <TypewriterEffect text={`${userName}'s Challenges`} speed={50} />
          </h1>
          <p className="text-gray-400">Sharpen your detective skills and solve cosmic mysteries.</p>
        </header>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full border border-blue-900/50 bg-black/50 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-900/20 ${
                selectedCategory === category ? "bg-blue-900/20" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Challenges grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading challenges...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="rounded-lg border border-blue-900/50 bg-black/50 p-6 backdrop-blur-sm">
                <h2 className="mb-2 text-xl font-bold text-white">{challenge.title}</h2>
                <p className="mb-4 text-gray-400">{challenge.description}</p>

                <div className="mb-4">
                  <p className="text-sm text-gray-400">Category: {challenge.category}</p>
                  <p className="text-sm text-gray-400">Difficulty: {challenge.difficulty}</p>
                  <p className="text-sm text-gray-400">Points: {challenge.points}</p>
                  <p className="text-sm text-gray-400">Time Estimate: {challenge.timeEstimate}</p>
                </div>

                {completedChallenges.includes(challenge.id) ? (
                  <div className="rounded-md bg-green-900/20 p-3 text-green-400">Challenge Completed!</div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter your answer"
                      className="w-full rounded border border-blue-900/50 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                      value={userAnswer[challenge.id] || ""}
                      onChange={(e) => handleAnswerChange(challenge.id, e.target.value)}
                    />

                    <button
                      className={`mt-4 w-full rounded bg-gradient-to-r from-blue-600 to-indigo-700 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 ${
                        submissionStatus[challenge.id] === "idle"
                          ? ""
                          : submissionStatus[challenge.id] === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                      onClick={() => handleChallengeCompletion(challenge.id, userAnswer[challenge.id] || "")}
                      disabled={submissionStatus[challenge.id] === "idle" ? false : true}
                    >
                      {submissionStatus[challenge.id] === "idle"
                        ? "Submit Answer"
                        : submissionStatus[challenge.id] === "success"
                          ? "Correct!"
                          : "Incorrect"}
                    </button>
                  </>
                )}

                <Link
                  href={`/protocols?challenge=${challenge.id}`}
                  className="mt-4 block text-blue-400 hover:text-blue-300"
                >
                  View Protocol
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
