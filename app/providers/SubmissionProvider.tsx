// app/_components/providers/SubmissionProvider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface SubmissionContextType {
  newSubmissionId: string | null
  setNewSubmissionId: (id: string | null) => void
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined)

export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  const [newSubmissionId, setNewSubmissionId] = useState<string | null>(null)

  return (
    <SubmissionContext.Provider value={{ newSubmissionId, setNewSubmissionId }}>
      {children}
    </SubmissionContext.Provider>
  )
}

export function useSubmission() {
  const context = useContext(SubmissionContext)
  if (context === undefined) {
    throw new Error('useSubmission must be used within a SubmissionProvider')
  }
  return context
}