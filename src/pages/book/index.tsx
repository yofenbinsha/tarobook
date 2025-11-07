import React, { useEffect, useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SearchBar, Tabs, Tag, Button, Cell, CellGroup, Input, TextArea } from '@nutui/nutui-react-taro'
import { bookStock as mockBooks, categories as mockCategories } from '@mock/book'
import { BookInfo, BookCategory, ReserveForm } from '@types/book'
import { reserveBook } from '@apis/book'
import { useAppSelector } from '@store/hooks'
import './index.less'

const defaultForm: ReserveForm = {
  name: '',
  phone: '',
  pickupDate: '',
  comment: '',
}

function BookPage() {
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<BookCategory>('tech')
  const [form, setForm] = useState<ReserveForm>(defaultForm)
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const profile = useAppSelector((state) => state.user.profile)

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.name || '',
        phone: prev.phone || profile.phone || '',
      }))
    }
  }, [profile])

  const filteredBooks = useMemo<BookInfo[]>(() => {
    const lowerKeyword = debouncedKeyword.trim().toLowerCase()
    const books = mockBooks as BookInfo[]
    
    if (!lowerKeyword) {
      return books.filter(book => book.category === activeTab)
    }
    
    return books.filter((book) => {
      if (book.category !== activeTab) return false
      
      const searchContent = `${book.title}${book.author}${book.desc}`.toLowerCase()
      return searchContent.includes(lowerKeyword)
    })
  }, [activeTab, debouncedKeyword])

  const updateForm = (field: keyof ReserveForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectBook = (book: BookInfo) => {
    setSelectedBook(book)
    updateForm('comment', `预约《${book.title}》`)
  }

  const validateForm = (): string | null => {
    if (!selectedBook) {
      return '请选择需要预约的图书'
    }
    if (!form.name?.trim()) {
      return '请输入取书人姓名'
    }
    if (!form.phone?.trim()) {
      return '请输入联系方式'
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      return '请输入正确的手机号码'
    }
    if (!form.pickupDate?.trim()) {
      return '请选择取书日期'
    }
    return null
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      Taro.showToast({ title: validationError, icon: 'none' })
      return
    }
    
    setSubmitting(true)
    try {
      const result = await reserveBook({
        bookId: selectedBook!.id,
        bookTitle: selectedBook!.title,
        name: form.name.trim(),
        phone: form.phone.trim(),
        pickupDate: form.pickupDate.trim(),
        comment: form.comment.trim(),
      })
      Taro.showToast({ title: '预约提交成功', icon: 'success' })
      Taro.showModal({
        title: '预约已提交',
        content: `预约编号：${result.reserveId}\n预计 30 分钟内确认`,
        showCancel: false,
      })
      setForm({
        ...defaultForm,
        name: profile?.name || '',
        phone: profile?.phone || '',
      })
      setSelectedBook(null)
      setKeyword('')
    } catch (error: any) {
      let errorMessage = '预约失败，请稍后重试'
      
      if (error?.code === 'NETWORK_ERROR') {
        errorMessage = '网络连接失败，请检查网络后重试'
      } else if (error?.code === 'BOOK_NOT_AVAILABLE') {
        errorMessage = '该图书已被预约，请选择其他图书'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      Taro.showToast({ 
        title: errorMessage, 
        icon: 'none',
        duration: 3000
      })
      
      // 记录错误日志
      console.error('预约失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryDesc = (category: BookCategory) =>
    mockCategories.find((item) => item.value === category)?.desc || ''

  return (
    <View className='book-page'>
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>图书检索</Text>
          <Text className='section-desc'>支持书名、作者关键字模糊搜索</Text>
        </View>
        <SearchBar
          placeholder='例如：TypeScript / 字体 / 茨威格'
          value={keyword}
          clearable
          shape='round'
          onChange={(val) => setKeyword(val)}
        />
      </View>

      <View className='section'>
        <View className='section-header space-between'>
          <View>
            <Text className='section-title'>热门分类</Text>
            <Text className='section-desc'>实时同步在馆可约册数</Text>
          </View>
          <Text className='section-hint'>当前可选 {filteredBooks.length} 本</Text>
        </View>
        <Tabs
          value={activeTab}
          direction='horizontal'
          onChange={(val) => setActiveTab(val as BookCategory)}
          autoHeight>
          {mockCategories.map((category) => (
            <Tabs.TabPane title={category.label} value={category.value} key={category.value}>
              <View className='category-desc'>{category.desc}</View>
              <View className='book-card-list'>
                {filteredBooks.length === 0 ? (
                  <View className='empty-state'>
                    <Text className='empty-state__icon'>📚</Text>
                    <Text className='empty-state__title'>\n暂无匹配图书</Text>
                    <Text className='empty-state__desc'>\n尝试调整搜索关键词或切换分类</Text>
                  </View>
                ) : (
                  filteredBooks.map((book) => (
                  <View
                    className={`book-card ${selectedBook?.id === book.id ? 'book-card--selected' : ''}`}
                    key={book.id}>
                    <View className='book-card__title-row'>
                      <View>
                        <Text className='book-card__title'>{book.title}</Text>
                        <Text className='book-card__subtitle'>{getCategoryDesc(book.category)}</Text>
                      </View>
                      <Tag type='info' round className='book-card__author-tag'>
                        {book.author}
                      </Tag>
                    </View>
                    <Text className='book-card__desc'>{book.desc}</Text>
                    <View className='book-card__footer'>
                      <Text className='book-card__slots'>
                        {book.slots > 0 ? `可约 ${book.slots} 本` : '今日已满'}
                      </Text>
                      <Button
                        className='reserve-btn'
                        type='primary'
                        size='small'
                        shape='round'
                        disabled={book.slots === 0}
                        onClick={() => handleSelectBook(book)}>
                        {selectedBook?.id === book.id ? '已选择' : '预约'}
                      </Button>
                    </View>
                  </View>
                ))
                )}
              </View>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </View>

      <View className='section book-form'>
        <View className='section-header'>
          <Text className='section-title'>填写预约信息</Text>
          <Text className='section-desc'>工作人员将在 30 分钟内确认</Text>
        </View>
        <View className='selected-book-hint'>
          <Text className='hint-title'>已选图书</Text>
          <Text className='hint-value'>
            {selectedBook ? `${selectedBook.title}（${selectedBook.author}）` : '请在上方选择图书'}
          </Text>
        </View>
        <CellGroup>
          <Cell title='取书人' className='form-cell'>
            <Input
              value={form.name}
              placeholder='请输入姓名'
              clearable
              onChange={(val) => updateForm('name', val)}
            />
          </Cell>
          <Cell title='联系方式' className='form-cell'>
            <Input
              value={form.phone}
              type='number'
              placeholder='手机或座机'
              clearable
              onChange={(val) => updateForm('phone', val)}
            />
          </Cell>
          <Cell title='取书日期' className='form-cell'>
            <Input
              value={form.pickupDate}
              placeholder='例如：11 月 08 日 18:00'
              onChange={(val) => updateForm('pickupDate', val)}
            />
          </Cell>
        </CellGroup>
        <View className='comment'>
          <Text className='comment__label'>备注需求</Text>
          <TextArea
            value={form.comment}
            autoSize
            placeholder='可填写优先时间、希望安排的座位等'
            showCount
            maxLength={60}
            onChange={(val) => updateForm('comment', val)}
          />
        </View>
        <Button block type='primary' className='submit-btn' loading={submitting} onClick={handleSubmit}>
          提交预约
        </Button>
      </View>
    </View>
  )
}

export default BookPage
