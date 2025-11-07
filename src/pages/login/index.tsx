import React, { useState } from 'react'
import { Navigator, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Cell, CellGroup, Checkbox, Input, NoticeBar } from '@nutui/nutui-react-taro'
import { login as loginApi } from '../../apis/login'
import { useAppDispatch } from '../../store/hooks'
import { setUser, type UserProfile } from '../../store/userSlice'
import { generateCardNo } from '../../utils/card'
import './index.less'

const defaultAvatar = 'https://placehold.co/144x144?text=RD'

const deriveName = (account: string) => account.split('@')[0] || '图书读者'
const deriveEmail = (account: string) =>
  account.includes('@') ? account : `${account.replace(/\s+/g, '')}@book.local`
const derivePhone = (account: string) => {
  const digits = account.replace(/[^\d]/g, '')
  if (digits.length >= 11) {
    return `${digits.slice(0, 3)}****${digits.slice(7, 11)}`
  }
  if (digits.length >= 7) {
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`
  }
  return '137****0000'
}

function LoginPage() {
  const [form, setForm] = useState({ account: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async () => {
    if (!form.account || !form.password) {
      Taro.showToast({ title: '请输入账号和密码', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const result = await loginApi(form)
      const profile: UserProfile = {
        name: result.name || deriveName(result.account),
        email: result.email || deriveEmail(result.account),
        phone: result.phone || derivePhone(result.account),
        cardNo: result.cardNo || generateCardNo(),
        avatar: result.avatar || defaultAvatar,
      }
      const token = result.token || `token-${Date.now()}`
      dispatch(setUser({ profile, token }))
      if (!remember) {
        setForm({ account: '', password: '' })
      }
      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/me/index' })
      }, 300)
    } catch (error) {
      Taro.showToast({ title: (error as Error).message || '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login-page'>
      <NoticeBar content='首次登录请先完成注册，或使用读者证号找回密码。' />
      <View className='login-card'>
        <Text className='login-title'>欢迎回来</Text>
        <Text className='login-subtitle'>使用图书馆账号登录，管理预约与借阅</Text>

        <CellGroup>
          <Cell title='账号' className='form-cell'>
            <Input
              value={form.account}
              placeholder='读者证号 / 手机号 / 邮箱'
              clearable
              onChange={(val) => updateForm('account', val)}
            />
          </Cell>
          <Cell title='密码' className='form-cell'>
            <Input
              value={form.password}
              placeholder='请输入密码'
              type='password'
              clearable
              onChange={(val) => updateForm('password', val)}
            />
          </Cell>
        </CellGroup>

        <View className='login-extra'>
          <Checkbox checked={remember} onChange={(value) => setRemember(value)}>
            记住我
          </Checkbox>
          <Text className='link' onClick={() => Taro.showToast({ title: '已发送验证码', icon: 'none' })}>
            忘记密码？
          </Text>
        </View>

        <Button type='primary' block className='submit-btn' loading={loading} onClick={handleLogin}>
          登录
        </Button>
        <Navigator url='/pages/register/index' className='link register-link' openType='navigate'>
          还没有账号？前往注册
        </Navigator>
      </View>
    </View>
  )
}

export default LoginPage
