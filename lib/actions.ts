'use server'

import { revalidatePath } from 'next/cache'
import { mockData } from './data'
import { Submission } from './types/customField'


export type SubmissionStats = {
  timeline: {
    date: string  // YYYY-MM
    count: number
  }[]
  ageDistribution: {
    range: string
    count: number
    percentage: number
  }[]
  customFieldUsage: {
    type: string
    count: number
    percentage: number
  }[]
  totals: {
    totalSubmissions: number
    averageAge: number
    lastMonthSubmissions: number
  }
}

export async function getSubmissionStats(): Promise<SubmissionStats> {
  // Simulate network delay for demo
  await new Promise(resolve => setTimeout(resolve, 3000))


  const timeline = mockData.reduce((acc, submission) => {
    const date = new Date(submission.createdAt)
      .toISOString()
      .slice(0, 7) // YYYY-MM
    
    const existing = acc.find(a => a.date === date)
    if (existing) {
      existing.count++
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, [] as SubmissionStats['timeline']).sort((a, b) => a.date.localeCompare(b.date))


  const ageRanges = {
    '18-24': { min: 18, max: 24 },
    '25-34': { min: 25, max: 34 },
    '35-44': { min: 35, max: 44 },
    '45-54': { min: 45, max: 54 },
    '55+': { min: 55, max: Infinity }
  }

  const ageDistribution = Object.entries(ageRanges).map(([range, { min, max }]) => {
    const count = mockData.filter(s => s.age >= min && s.age <= max).length
    return {
      range,
      count,
      percentage: (count / mockData.length) * 100
    }
  })


  const customFieldCounts = mockData.flatMap(s => s.customFields)
    .reduce((acc, field) => {
      acc[field.type] = (acc[field.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const customFieldUsage = Object.entries(customFieldCounts).map(([type, count]) => ({
    type,
    count,
    percentage: (count / mockData.length) * 100
  }))


  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  const totals = {
    totalSubmissions: mockData.length,
    averageAge: Math.round(mockData.reduce((sum, s) => sum + s.age, 0) / mockData.length),
    lastMonthSubmissions: mockData.filter(s => new Date(s.createdAt) > lastMonth).length
  }

  return {
    timeline,
    ageDistribution,
    customFieldUsage,
    totals,
  }
}


export async function createSubmission(submission: Submission) {
  // Simulate network delay

  const emailExists = await checkEmailExists(submission.email)
  
  if (emailExists) {
    return { 
      success: false, 
      error: 'Email already exists' 
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1000))
  

  mockData.unshift(submission)
  
  revalidatePath('/')
  return { success: true, id: submission.id }
}
  type GetSubmissionsParams = {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }
  export async function getSubmissions({
    page = 1,
    pageSize = 10,
    search = '',
    sortBy = 'updatedAt',
    sortDirection = 'desc'
  }: GetSubmissionsParams = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    let filteredData = [...mockData]
    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.age.toString().includes(search) ||
        item.customFields.some(field => 
          field.label.toLowerCase().includes(searchLower) ||
          String(field.value).toLowerCase().includes(searchLower)
        )
      )
    }
  

    filteredData.sort((a, b) => {
      const aValue = a[sortBy as keyof Submission]
      const bValue = b[sortBy as keyof Submission]
      
 
      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })
  
    // Calculate pagination
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const items = filteredData.slice((page - 1) * pageSize, page * pageSize)
  
    return {
      items,
      metadata: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  }
  export async function checkEmailExists(email: string, excludeId?: string) {
    // Check if email exists in mockData, excluding the current record if updating
    return mockData.some(item => 
      item.email === email && item.id !== excludeId
    )
  }

  export type UpdateSubmissionResponse = {
    success: boolean
    error?: string
  }
  export async function updateSubmission(updatedData: Submission): Promise<UpdateSubmissionResponse> {
    
    const emailExists = await checkEmailExists(updatedData.email, updatedData.id)
  
    if (emailExists) {
      return { 
        success: false, 
        error: 'Email already exists' 
      }
    }

    
    const index = mockData.findIndex(item => item.id === updatedData.id)
    if (index !== -1) {
      mockData[index] = updatedData
      revalidatePath('/')
      return { success: true }
    }
    
    return { 
      success: false, 
      error: 'Record not found' 
    }
  }
  