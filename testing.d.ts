// types/testing.d.ts
import { Submission } from '@/lib/types/customField'

export interface MockState {
  emailChecks: string[];
  submissions: Submission[];
}

export interface ActionsMockHelpers {
  _getMockState: () => MockState;
  _clearMockState: () => void;
}