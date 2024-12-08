import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import 'whatwg-fetch'

// Polyfills and Global Mocks
global.fetch = jest.fn()

// Mock Request/Response with proper typing
const mockResponse = {
  error: () => new Response(null, { status: 400 }),
  json: (data: any) => new Response(JSON.stringify(data)),
  redirect: (url: string, status = 302) => new Response(null, {
    status,
    headers: { Location: url },
  }),
}

global.Response = jest.fn(() => mockResponse) as unknown as typeof Response
global.Request = jest.fn() as unknown as typeof Request

// Mock server environment
;(global as any).isServer = true

// Mock TextEncoder/Decoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver as any

// Mock URL APIs
window.URL.createObjectURL = jest.fn()
window.URL.revokeObjectURL = jest.fn()