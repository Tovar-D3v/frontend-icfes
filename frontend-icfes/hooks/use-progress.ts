"use client"

import { useState } from "react"
import { mockFirestore } from "@/lib/firebase"
import { SUBJECTS } from "@/lib/constants"
import { UNITS_DATA } from "@/lib/mock-data"

export function useProgress() {
  const [userProgress, setUserProgress] = useState<Record<string, any>>({})
  const [userResults, setUserResults] = useState<any[]>([])

  const loadUserProgress = async (uid: string) => {
    try {
      const progress: Record<string, any> = {}
      for (const subject of SUBJECTS) {
        const units = UNITS_DATA[subject.id as keyof typeof UNITS_DATA] || []
        for (const unit of units) {
          const docRef = await mockFirestore.collection(`users/${uid}/unit_progress_${subject.id}`).doc(unit.id).get()

          if (docRef.exists()) {
            progress[`${subject.id}-${unit.id}`] = docRef.data()
          }
        }
      }
      setUserProgress(progress)

      const resultsRef = await mockFirestore.collection(`users/${uid}/results`).get()
      const results = resultsRef.docs.map((doc) => doc.data())
      setUserResults(results)
    } catch (error) {
      console.error("Error loading progress:", error)
    }
  }

  const isUnitUnlocked = (subjectId: string, unitIndex: number) => {
    if (unitIndex === 0) return true

    const units = UNITS_DATA[subjectId as keyof typeof UNITS_DATA] || []
    const previousUnit = units[unitIndex - 1]
    if (!previousUnit) return false

    const progressKey = `${subjectId}-${previousUnit.id}`
    const progress = userProgress[progressKey]

    return progress && progress.passed
  }

  const getUnitStatus = (subjectId: string, unitId: string) => {
    const progressKey = `${subjectId}-${unitId}`
    const progress = userProgress[progressKey]

    if (!progress) return "locked"
    if (progress.passed) return "completed"
    return "available"
  }

  return {
    userProgress,
    userResults,
    loadUserProgress,
    isUnitUnlocked,
    getUnitStatus,
    setUserProgress,
    setUserResults,
  }
}
