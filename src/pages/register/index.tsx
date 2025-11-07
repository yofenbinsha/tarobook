import React, { useMemo, useState } from 'react'
import { Navigator, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Cell, CellGroup, Checkbox, Input, NoticeBar } from '@nutui/nutui-react-taro'
import './index.less'

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [agree, setAgree] = useState(false)

  const passwordHint = useMemo(() => {
    if (!form.password) return '至少 8 位，包含字母和数字'
    if (form.password.length < 8) return '密码长度不足'
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      return '需同时包含字母和数字'
    }
    return '密码强度良好'
  }, [form.password])

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.confirm) {
      Taro.showToast({ title: '请完整填写信息', icon: 'none' })
      return
    }
    if (form.password !== form.confirm) {
      Taro.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }
    if (!agree) {
      Taro.showToast({ title: '请先阅读并同意服务条款', icon: 'none' })
      return
    }
    Taro.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/login/index' })
    }, 400)
  }

  return (
    <View className='register-page'>
      <NoticeBar content='填写真实信息以便图书馆核验，自助审核预计 2 小时完成。' />
      <View className='register-card'>
        <Text className='register-title'>创建图书账户</Text>
        <Text className='register-subtitle'>即可同步预约记录与借阅历史</Text>
        <CellGroup>
          <Cell title='姓名' className='form-cell'>
            <Input
              value={form.name}
              placeholder='请填写真实姓名'
              clearable
              onChange={(val) => updateForm('name', val)}
            />
          </Cell>
          <Cell title='手机号' className='form-cell'>
            <Input
              value={form.phone}
              type='number'
              placeholder='用于接收预约通知'
              clearable
              onChange={(val) => updateForm('phone', val)}
            />
          </Cell>
          <Cell title='邮箱' className='form-cell'>
            <Input
              value={form.email}
              type='text'
              placeholder='用于登录和找回密码'
              clearable
              onChange={(val) => updateForm('email', val)}
            />
          </Cell>
          <Cell title='密码' className='form-cell'>
            <Input
              value={form.password}
              type='password'
              placeholder='至少 8 位，需包含字母数字'
              clearable
              onChange={(val) => updateForm('password', val)}
            />
          </Cell>
          <Cell title='确认密码' className='form-cell'>
            <Input
              value={form.confirm}
              type='password'
              placeholder='再次输入密码'
              clearable
              onChange={(val) => updateForm('confirm', val)}
            />
          </Cell>
        </CellGroup>
        <Text className='password-hint'>{passwordHint}</Text>

        <View className='agree-row'>
          <Checkbox checked={agree} onChange={(value) => setAgree(value)}>
            我已阅读并同意
          </Checkbox>
          <Text
            className='link'
            onClick={() => Taro.showToast({ title: '《服务条款》已发送到邮箱', icon: 'none' })}>
            《服务条款》
          </Text>
        </View>

        <Button type='primary' block className='submit-btn' onClick={handleRegister}>
          提交注册
        </Button>
        <Navigator url='/pages/login/index' className='link login-link' openType='navigate'>
          已有账号？立即登录
        </Navigator>
      </View>
    </View>
  )
}

export default RegisterPage
