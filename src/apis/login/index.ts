import { request } from '../../services'

export interface LoginPayload {
  account: string
  password: string
}

export interface LoginApiResponse {
  token?: string
  account: string
  name?: string
  email?: string
  phone?: string
  avatar?: string
  cardNo?: string
}

const shouldUseMock = () => {
  if (typeof process !== 'undefined' && process.env && typeof process.env.TARO_APP_USE_MOCK !== 'undefined') {
    return process.env.TARO_APP_USE_MOCK !== 'false'
  }
  return true
}

const mockLogin = (payload: LoginPayload): Promise<LoginApiResponse> =>
  Promise.resolve({
    token: `mock-token-${Date.now()}`,
    account: payload.account,
  })

export const login = (payload: LoginPayload) => {
  if (shouldUseMock()) {
    return mockLogin(payload)
  }
  return request<LoginApiResponse>({
    url: '/login',
    method: 'POST',
    data: payload,
  })
}

export const logout = () => {
  if (shouldUseMock()) {
    return Promise.resolve({ success: true })
  }
  return request({
    url: '/logout',
    method: 'POST',
  })
}
