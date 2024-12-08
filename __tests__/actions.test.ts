
  import { _clearMockData, _getMockData, createSubmission, getSubmissions, getSubmissionStats} from '@/__mocks__/@/lib/actions'
import { Submission, CustomField } from '@/lib/types/customField'
  
  describe('Server Actions', () => {
    beforeEach(() => {
      _clearMockData()
    })
  
    describe('createSubmission', () => {
      it('creates new submission with basic fields', async () => {
        const newSubmission: Submission = {
          id: '3',
          name: 'New User',
          email: 'new@example.com',
          age: 28,
          customFields: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        const result = await createSubmission(newSubmission)
        expect(result.success).toBe(true)
        expect(result.id).toBe('3')
  
        const mockData = _getMockData()
        expect(mockData[0].email).toBe('new@example.com')
      })
  
      it('creates submission with custom fields', async () => {
        const customFields: CustomField[] = [
          {
            id: 'cf1',
            label: 'Company',
            type: 'text',
            value: 'Test Corp',
            isAdvanced: false,
            required: true
          },
          {
            id: 'cf2',
            label: 'Experience',
            type: 'number',
            value: 5,
            isAdvanced: false,
            required: false
          }
        ]
  
        const newSubmission: Submission = {
          id: '3',
          name: 'Custom User',
          email: 'custom@example.com',
          age: 30,
          customFields,
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        const result = await createSubmission(newSubmission)
        expect(result.success).toBe(true)
  
        const mockData = _getMockData()
        const saved = mockData.find(s => s.id === '3')
        expect(saved?.customFields).toHaveLength(2)
        expect(saved?.customFields[0].value).toBe('Test Corp')
      })
  
      it('prevents duplicate email submissions', async () => {
        const existingEmail: Submission = {
          id: '3',
          name: 'Duplicate User',
          email: 'john@example.com', // Already exists in mock data
          age: 28,
          customFields: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        const result = await createSubmission(existingEmail)
        expect(result.success).toBe(false)
        expect(result.error).toBe('Email already exists')
      })
    })
  
    describe('getSubmissions', () => {
      it('returns paginated results', async () => {
        const { items, metadata } = await getSubmissions({ page: 1, pageSize: 1 })
        expect(items).toHaveLength(1)
        expect(metadata.totalPages).toBe(2)
        expect(metadata.hasNextPage).toBe(true)
        expect(metadata.hasPreviousPage).toBe(false)
      })
  
      it('handles search by name', async () => {
        const { items } = await getSubmissions({ search: 'john' })
        expect(items).toHaveLength(1)
        expect(items[0].name).toBe('John Doe')
      })
  
      it('handles search by email', async () => {
        const { items } = await getSubmissions({ search: 'jane@example' })
        expect(items).toHaveLength(1)
        expect(items[0].email).toBe('jane@example.com')
      })
  
      it('returns empty results for non-matching search', async () => {
        const { items, metadata } = await getSubmissions({ search: 'nonexistent' })
        expect(items).toHaveLength(0)
        expect(metadata.totalItems).toBe(0)
      })
  
      it('handles search by custom field value', async () => {
        const { items } = await getSubmissions({ search: 'Acme' })
        expect(items).toHaveLength(1)
        expect(items[0].customFields[0].value).toBe('Acme Inc')
      })
    })
  
    describe('getSubmissionStats', () => {
      it('calculates correct total submissions', async () => {
        const stats = await getSubmissionStats()
        expect(stats.totals.totalSubmissions).toBe(2) // Based on mock data
      })
  
      it('calculates correct age distribution', async () => {
        const stats = await getSubmissionStats()
        const age25to34 = stats.ageDistribution.find(d => d.range === '25-34')
        expect(age25to34?.count).toBe(1) // John Doe is 25
      })
  
      it('generates timeline data', async () => {
        const stats = await getSubmissionStats()
        expect(stats.timeline).toHaveLength(2) // Two different months in mock data
        expect(stats.timeline[0]).toHaveProperty('date')
        expect(stats.timeline[0]).toHaveProperty('count')
      })
  
      it('tracks custom field usage', async () => {
        const stats = await getSubmissionStats()
        const textFieldUsage = stats.customFieldUsage.find(u => u.type === 'text')
        expect(textFieldUsage?.count).toBe(1) // One text field in mock data
      })
    })
  
    // You can continue adding more test groups here...
  })