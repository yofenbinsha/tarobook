import { request } from '../../services'

export interface ReservePayload {
  bookId: string
  bookTitle: string
  name: string
  phone: string
  pickupDate: string
  comment?: string
}

export interface ReserveResponse {
  reserveId: string
  status: 'pending' | 'confirmed'
}

const shouldUseMock = () => {
  if (typeof process !== 'undefined' && process.env && typeof process.env.TARO_APP_USE_MOCK !== 'undefined') {
    return process.env.TARO_APP_USE_MOCK !== 'false'
  }
  return true
}

const mockReserve = (payload: ReservePayload): Promise<ReserveResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reserveId: `mock-reserve-${Date.now()}`,
        status: 'pending',
      })
    }, 600)
  })

export const reserveBook = (payload: ReservePayload) => {
  if (shouldUseMock()) {
    return mockReserve(payload)
  }
  return request<ReserveResponse>({
    url: '/book/reserve',
    method: 'POST',
    data: payload,
  })
}
