export interface BookInfo {
  id: string
  title: string
  author: string
  category: BookCategory
  slots: number
  desc: string
  isbn?: string
  publisher?: string
  publishDate?: string
}

export type BookCategory = 'tech' | 'design' | 'literature'

export interface BookCategoryInfo {
  label: string
  value: BookCategory
  desc: string
}

export interface ReserveForm {
  name: string
  phone: string
  pickupDate: string
  comment: string
}

export interface ReserveRequest {
  bookId: string
  bookTitle: string
  name: string
  phone: string
  pickupDate: string
  comment: string
}

export interface ReserveResponse {
  reserveId: string
  status: 'pending' | 'confirmed' | 'rejected'
  estimatedTime: string
}