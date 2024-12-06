import { type Submission, type CustomField } from './types/customField'

const generateCustomFields = (): CustomField[] => {
  const fields = [
    { label: 'Company', type: 'text' as const, value: 'Acme Inc' },
    { label: 'Phone', type: 'text' as const, value: '555-0123' },
    { label: 'Department', type: 'text' as const, value: 'Engineering' },
    { label: 'Years of Experience', type: 'number' as const, value: 5 },
    { label: 'Work Email', type: 'email' as const, value: 'work@example.com' }
  ]

  // Randomly select 0-3 fields
  const numFields = Math.floor(Math.random() * 4)
  const selectedFields = fields
    .sort(() => Math.random() - 0.5)
    .slice(0, numFields)

  return selectedFields.map(field => ({
    id: crypto.randomUUID(),
    ...field,
    isAdvanced: false,
    required: false
  }))
}

// Generate 50 mock records

export const mockData: Submission[] = Array.from({ length: 500 }, (_, i) => ({
  id: crypto.randomUUID(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + Math.floor(Math.random() * 40), // Random age between 20-60
  customFields: generateCustomFields(),
  createdAt: new Date(Date.now() - Math.random() * 10000000000), // Random dates within past ~4 months
  updatedAt: new Date(Date.now() - Math.random() * 10000000000)
}))

