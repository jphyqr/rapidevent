// app/lib/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { mockData } from './data'
import { Submission } from './types/customField'

export async function createSubmission(formData: FormData) {
    const submission = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      age: Number(formData.get('age')),
      customFields: JSON.parse(formData.get('customFields') as string),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  
    // Add to start of array to maintain sort order
    mockData.unshift(submission)
    
    revalidatePath('/')
    return { success: true, id: submission.id }
  }

export async function getSubmissions() {
    // Sort by date descending
    return mockData.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  export async function updateSubmission(updatedData: Submission) {
    const index = mockData.findIndex(item => item.id === updatedData.id)
    if (index !== -1) {
      mockData[index] = {
        ...updatedData,
        updatedAt: new Date()
      }
    }
    revalidatePath('/')
    return { success: true }
  }
  