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

// 从环境配置获取
const getBaseURL = () => {
  // 可以根据不同环境返回不同的baseURL
  if (process.env.NODE_ENV === 'development') {
    return 'https://api.github.com/dev'
  }
  return 'https://api.github.com'
}

const service = axios.create({
  baseURL: getBaseURL(),
  timeout: process.env.REQUEST_TIMEOUT ? parseInt(process.env.REQUEST_TIMEOUT) : 5000,
})

service.interceptors.request.use((config) => {
  const token = Taro.getStorageSync('token')
  if (token) {
    // 更安全的headers合并方式
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 扩展成功状态码范围
    if (response.status >= 200 && response.status < 300) {
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

// 类型守卫函数
const isServiceError = (error: unknown): error is ServiceError => {
  return typeof error === 'object' && 
         error !== null && 
         'status' in error && 
         'message' in error
}

// 处理未知错误类型
const normalizeUnknownError = (error: unknown): ServiceError => {
  if (error instanceof Error) {
    return {
      message: error.message || '未知错误',
      status: 0,
      data: null,
      original: error,
    }
  }
  return {
    message: '未知错误',
    status: 0,
    data: null,
    original: error,
  }
}

const normalizeAxiosError = (error: AxiosError): ServiceError => {
  if (error.response) {
    return normalizeError(error.response)
  }
  
  // 更详细的错误分类
  let message = '服务器开小差了，请稍后再试'
  if (error.code === 'ECONNABORTED') {
    message = '请求超时，请检查网络连接'
  } else if (error.code === 'NETWORK_ERROR') {
    message = '网络连接失败，请检查网络设置'
  } else if (error.request) {
    message = '无法连接到服务器，请检查网络连接'
  }
  
  return {
    message,
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
    // 安全的错误类型转换
    const err = isServiceError(error) ? error : normalizeUnknownError(error)
    if (err.status === 0) {
      onCrash?.(err)
    } else {
      onFail?.(err)
    }
    throw err
  }
}

export default service
