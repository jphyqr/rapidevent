// types/mock-actions.d.ts
import { Submission } from '@/lib/types/customField'

export interface MockHelpers {
  _getMockState(): {
    emailChecks: string[];
    submissions: Submission[];
  };
  _clearMockState(): void;
}

declare module '@/lib/actions' {
  export const _getMockState: MockHelpers['_getMockState'];
  export const _clearMockState: MockHelpers['_clearMockState'];
}