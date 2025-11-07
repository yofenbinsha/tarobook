export type BookCategory = 'tech' | 'design' | 'literature'

export interface BookInfo {
  id: string
  title: string
  author: string
  category: BookCategory
  slots: number
  desc: string
}
