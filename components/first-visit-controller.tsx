"use client"

import { useState, useEffect, type ReactNode } from "react"

interface FirstVisitControllerProps {
  children: ReactNode | ((isFirstVisit: boolean) => ReactNode)
  storageKey?: string
}

export function FirstVisitController({ children, storageKey = "hasVisitedBefore" }: FirstVisitControllerProps) {
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem(storageKey)

    if (hasVisited) {
      setIsFirstVisit(false)
    } else {
      // Mark as visited for future
      localStorage.setItem(storageKey, "true")
    }

    setIsLoading(false)
  }, [storageKey])

  if (isLoading) {
    return null // Or a loading spinner
  }

  // Check if children is a function and call it with isFirstVisit if it is
  if (typeof children === "function") {
    return <>{children(isFirstVisit)}</>
  }

  // Otherwise, render children directly
  return <>{children}</>
}
