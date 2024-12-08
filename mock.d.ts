import { Submission } from '@/lib/types/customField'

declare module '@/lib/actions' {
  export const mockCreateSubmission: jest.Mock<Promise<{ success: boolean, id: string }>, [Submission]>
  export const mockCheckEmailExists: jest.Mock<Promise<boolean>, [string]>
}