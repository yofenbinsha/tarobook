import Taro from '@tarojs/taro'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export type ServiceError = {
  message: string
  status: number
  data?: any
  original?: unknown
}

export interface RequestCallbacks<T = any> {
  onSuccess?: (data: T) => void
  onFail?: (error: ServiceError) => void
  onCrash?: (error: ServiceError) => void
}

const service = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000,
})

service.interceptors.request.use((config) => {
  const token = Taro.getStorageSync('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data
    }
    return Promise.reject(normalizeError(response))
  },
  (error: AxiosError) => Promise.reject(normalizeAxiosError(error)),
)

const normalizeError = (response: AxiosResponse): ServiceError => ({
  message: (response.data as any)?.message || '请求失败',
  status: response.status,
  data: response.data,
})

const normalizeAxiosError = (error: AxiosError): ServiceError => {
  if (error.response) {
    return normalizeError(error.response)
  }
  return {
    message: '服务器开小差了，请稍后再试',
    status: 0,
    data: null,
    original: error,
  }
}

export const request = async <T = any>(
  config: AxiosRequestConfig,
  callbacks: RequestCallbacks<T> = {},
) => {
  const { onSuccess, onFail, onCrash } = callbacks
  try {
    const data = await service.request<T>(config)
    onSuccess?.(data)
    return data
  } catch (error) {
    const err = error as ServiceError
    if (err.status === 0) {
      onCrash?.(err)
    } else {
      onFail?.(err)
    }
    throw err
  }
}

export default service
