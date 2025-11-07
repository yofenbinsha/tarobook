import { request } from '../../services'

export interface RegisterPayload {
  name: string
  phone: string
  email: string
  password: string
}

export interface RegisterApiResponse {
  id: string
  name: string
  phone: string
  email: string
}

const shouldUseMock = () => {
  if (typeof process !== 'undefined' && process.env && typeof process.env.TARO_APP_USE_MOCK !== 'undefined') {
    return process.env.TARO_APP_USE_MOCK !== 'false'
  }
  return true
}

const mockRegister = (payload: RegisterPayload): Promise<RegisterApiResponse> =>
  Promise.resolve({
    id: `mock-user-${Date.now()}`,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
  })

export const register = (payload: RegisterPayload) => {
  if (shouldUseMock()) {
    return mockRegister(payload)
  }
  return request<RegisterApiResponse>({
    url: '/register',
    method: 'POST',
    data: payload,
  })
}
