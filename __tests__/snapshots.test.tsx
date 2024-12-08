// __tests__/snapshots.test.tsx
import { getSubmissionStats, getSubmissions } from '@/lib/actions'
import { customRender } from '@/test-setup'
import DataForm from '@/app/_components/data-form'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Snapshot Tests', () => {
  describe('Stats API', () => {
    it('matches stats response structure', async () => {
      const stats = await getSubmissionStats()
      
      // Create a sanitized version with expected types instead of actual values
      const sanitizedStats = {
        ageDistribution: stats.ageDistribution.map(dist => ({
          range: dist.range,
          count: expect.any(Number),
          percentage: expect.any(Number)
        })),
        customFieldUsage: stats.customFieldUsage.map(usage => ({
          type: usage.type,
          count: expect.any(Number),
          percentage: expect.any(Number)
        })),
        timeline: stats.timeline.map(t => ({
          date: expect.any(String),
          count: expect.any(Number)
        })),
        totals: {
          totalSubmissions: expect.any(Number),
          averageAge: expect.any(Number),
          lastMonthSubmissions: expect.any(Number)
        }
      }
      
      expect(sanitizedStats).toMatchSnapshot()
    })
  })

  describe('Pagination API', () => {
    it('matches paginated response structure', async () => {
      const response = await getSubmissions({
        page: 1,
        pageSize: 2
      })

      // Snapshot the structure but not the data
      const sanitizedResponse = {
        metadata: {
          currentPage: response.metadata.currentPage,
          pageSize: response.metadata.pageSize,
          totalItems: expect.any(Number),
          totalPages: expect.any(Number),
          hasNextPage: expect.any(Boolean),
          hasPreviousPage: expect.any(Boolean)
        },
        // Just verify items is an array
        items: expect.any(Array)
      }

      expect(sanitizedResponse).toMatchSnapshot()
    })
  })

  describe('Form Structure', () => {
    const user = userEvent.setup()

    it('matches empty form layout', () => {
      const { container } = customRender(<DataForm />)
      // Remove any dynamic IDs or classes
      const sanitizedHtml = container.innerHTML.replace(/id="[^"]*"/g, 'id="test-id"')
      expect(sanitizedHtml).toMatchSnapshot()
    })

    it('matches form with single custom field', async () => {
      const { container } = customRender(<DataForm />)
      
      // Add a custom field
      await user.click(screen.getByRole('button', { name: /add field/i }))
      
      // Remove any dynamic IDs or classes
      const sanitizedHtml = container.innerHTML.replace(/id="[^"]*"/g, 'id="test-id"')
      expect(sanitizedHtml).toMatchSnapshot()
    })
  })
})