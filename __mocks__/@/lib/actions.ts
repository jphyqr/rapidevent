'use server'

import { Submission, CustomField, FieldType } from '@/lib/types/customField'

// Mock data with proper types
export const mockData: Submission[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    customFields: [
      {
        id: 'cf1',
        type: 'text',
        label: 'Company',
        value: 'Acme Inc',
        isAdvanced: false,
        required: false
      } as CustomField
    ],
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 35,
    customFields: [
      {
        id: 'cf2',
        type: 'number',
        label: 'Years of Experience',
        value: 5,
        isAdvanced: false,
        required: false
      } as CustomField
    ],
    createdAt: new Date('2024-02-15T00:00:00.000Z'),
    updatedAt: new Date('2024-02-15T00:00:00.000Z')
  }
]

// Track state for testing
let submissions: Submission[] = [...mockData]

// Mock functions
export async function createSubmission(submission: Submission) {
  // Ensure dates are Date objects
  const newSubmission = {
    ...submission,
    createdAt: new Date(submission.createdAt),
    updatedAt: new Date(submission.updatedAt),
    customFields: submission.customFields.map(field => ({
      ...field,
      isAdvanced: false
    }))
  }

  if (submissions.some(s => s.email === submission.email)) {
    return { success: false, error: 'Email already exists' }
  }
  
  submissions.unshift(newSubmission)
  return { success: true, id: submission.id }
}

export async function checkEmailExists(email: string, excludeId?: string) {
  return submissions.some(item => 
    item.email === email && item.id !== excludeId
  )
}

export async function getSubmissions({
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'updatedAt',
  sortDirection = 'desc'
} = {}) {
  let filtered = [...submissions]
  
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.age.toString().includes(search) ||
      item.customFields.some(field => 
        field.label.toLowerCase().includes(searchLower) ||
        String(field.value).toLowerCase().includes(searchLower)
      )
    )
  }

  const total = filtered.length
  const items = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    items,
    metadata: {
      currentPage: page,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page < Math.ceil(total / pageSize),
      hasPreviousPage: page > 1
    }
  }
}

export async function updateSubmission(updatedData: Submission) {
  const emailExists = await checkEmailExists(updatedData.email, updatedData.id)
  if (emailExists) {
    return { success: false, error: 'Email already exists' }
  }

  const index = submissions.findIndex(item => item.id === updatedData.id)
  if (index === -1) {
    return { success: false, error: 'Record not found' }
  }

  // Ensure dates are Date objects and custom fields aren't advanced
  submissions[index] = {
    ...updatedData,
    createdAt: new Date(updatedData.createdAt),
    updatedAt: new Date(updatedData.updatedAt),
    customFields: updatedData.customFields.map(field => ({
      ...field,
      isAdvanced: false
    }))
  }

  return { success: true }
}

export async function getSubmissionStats() {
  const timeline = submissions.reduce((acc, submission) => {
    const date = submission.createdAt.toISOString().slice(0, 7)
    const existing = acc.find(a => a.date === date)
    if (existing) existing.count++
    else acc.push({ date, count: 1 })
    return acc
  }, [] as { date: string; count: number }[])

  const ageRanges = {
    '18-24': { min: 18, max: 24 },
    '25-34': { min: 25, max: 34 },
    '35-44': { min: 35, max: 44 },
    '45-54': { min: 45, max: 54 },
    '55+': { min: 55, max: Infinity }
  }

  const ageDistribution = Object.entries(ageRanges).map(([range, { min, max }]) => {
    const count = submissions.filter(s => s.age >= min && s.age <= max).length
    return {
      range,
      count,
      percentage: (count / submissions.length) * 100
    }
  })

  return {
    timeline,
    ageDistribution,
    customFieldUsage: Object.entries(
      submissions.flatMap(s => s.customFields).reduce((acc, field) => {
        acc[field.type] = (acc[field.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({
      type,
      count,
      percentage: (count / submissions.length) * 100
    })),
    totals: {
      totalSubmissions: submissions.length,
      averageAge: Math.round(submissions.reduce((sum, s) => sum + s.age, 0) / submissions.length),
      lastMonthSubmissions: submissions.filter(s => 
        s.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    }
  }
}

// Test helpers
export function _clearMockData() {
  submissions = [...mockData]
}

export function _getMockData() {
  return [...submissions]
}