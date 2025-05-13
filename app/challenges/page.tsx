"use client"

import { useState, useEffect } from "react"
import { InteractiveChallengesDashboard } from "@/components/interactive-challenges-dashboard"
import { FirstVisitController } from "@/components/first-visit-controller"
import { EnhancedSpaceMurderWelcome } from "@/components/enhanced-space-murder-welcome"

export default function ChallengesPage() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [userName, setUserName] = useState("Detective")

  // Simulate getting user name from session/cookies
  useEffect(() => {
    // This would normally come from authentication
    const names = ["Alex", "Morgan", "Taylor", "Jordan", "Casey", "Riley", "Quinn"]
    setUserName(`Detective ${names[Math.floor(Math.random() * names.length)]}`)
  }, [])

  return (
    <FirstVisitController storageKey="space-murder-challenges-shown">
      {(isFirstVisit) => {
        return (
          <>
            {isFirstVisit && showWelcome ? (
              <EnhancedSpaceMurderWelcome onComplete={() => setShowWelcome(false)} />
            ) : (
              <InteractiveChallengesDashboard userName={userName} />
            )}
          </>
        )
      }}
    </FirstVisitController>
  )
}
