import { render } from "@testing-library/react"
import React, { useState } from 'react'
import { SubmissionContext } from '@/app/providers/SubmissionProvider'

// Create mock with explicit type
export const mockCreateSubmissionFn = jest.fn().mockImplementation((data) => {

  return Promise.resolve({ success: true, id: '123' })
})

// Mock server actions
jest.mock('@/lib/actions', () => {
  const actual = jest.requireActual('@/lib/actions')
  return {
    ...actual,
    createSubmission: (...args: any[]) => mockCreateSubmissionFn(...args),
    checkEmailExists: () => Promise.resolve(false)
  }
})

// Other mocks
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

// Provider component
function MockSubmissionProvider({ children }: { children: React.ReactNode }) {
  const [newSubmissionId, setNewSubmissionId] = useState<string | null>(null)
  return (
    <SubmissionContext.Provider value={{ newSubmissionId, setNewSubmissionId }}>
      {children}
    </SubmissionContext.Provider>
  )
}

function customRender(ui: React.ReactElement) {
  return render(ui, { wrapper: MockSubmissionProvider })
}

export { customRender }