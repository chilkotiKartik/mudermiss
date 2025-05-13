"use client"

import { useEffect, useState } from "react"
import { InteractiveChallengesDashboard } from "@/components/interactive-challenges-dashboard"
import { FirstVisitController } from "@/components/first-visit-controller"
import { SpaceWelcomeAnimation } from "@/components/space-welcome-animation"

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
    <>
      <FirstVisitController storageKey="space-murder-welcome-shown">
        {(firstVisit) => (
          <>
            {firstVisit && showWelcome && <SpaceWelcomeAnimation onComplete={() => setShowWelcome(false)} />}
            {(!firstVisit || !showWelcome) && <InteractiveChallengesDashboard userName={userName} />}
          </>
        )}
      </FirstVisitController>
    </>
  )
}
