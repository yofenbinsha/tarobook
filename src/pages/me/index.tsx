import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Avatar, Button, Cell, CellGroup, NoticeBar, Tag } from '@nutui/nutui-react-taro'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearUser } from '../../store/userSlice'
import { logout } from '../../apis/login'
import './index.less'

const quickEntries = [
  { label: '借阅记录', action: () => Taro.showToast({ title: '查看借阅记录', icon: 'none' }) },
  { label: '预约提醒', action: () => Taro.showToast({ title: '暂无新的预约提醒', icon: 'none' }) },
  { label: '证件管理', action: () => Taro.showToast({ title: '证件有效期至 2026-12', icon: 'none' }) },
]

const defaultAddress = '杭州市西湖区图书路 88 号'
const defaultAvatar = 'https://placehold.co/144x144?text=RD'

function MePage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.user.profile)
  const isLogin = Boolean(profile)

  const level = useMemo(() => {
    if (!profile) return '游客'
    const suffix = Number(profile.cardNo.slice(-1))
    if (suffix % 3 === 0) return '金卡会员'
    if (suffix % 3 === 1) return '银卡会员'
    return '青铜会员'
  }, [profile])

  const tags = useMemo(() => {
    if (!profile) return ['点击登录', '同步借阅']
    return ['夜读达人', '新书优先', '自习常驻']
  }, [profile])

  const handleGoLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // mock 环境直接忽略
    }
    dispatch(clearUser())
    Taro.showToast({ title: '已退出登录', icon: 'none' })
  }

  const stats = [
    { label: '正在借阅', value: profile ? 3 : 0 },
    { label: '可借额度', value: profile ? 10 : 0 },
    { label: '预约响应', value: profile ? '48h' : '-' },
  ]

  return (
    <View className='me-page'>
      <NoticeBar content='图书馆将于 11 月 10 日 22:00 例行维护，预约请提前安排。' closeable />

      <View className='card profile-card' onClick={!isLogin ? handleGoLogin : undefined}>
        <View className='profile-card__header'>
          <Avatar
            size='72'
            src={profile?.avatar || defaultAvatar}
            alt={profile?.name || '游客'}
            background='#edf2ff'
          />
          <View className='profile-card__info'>
            <Text className='profile-card__name'>{profile?.name || '未登录'}</Text>
            <Text className='profile-card__id'>
              {profile ? `读者证号：${profile.cardNo}` : '点击登录同步预约与借阅'}
            </Text>
            <View className='profile-card__tags'>
              <Tag type='primary'>{level}</Tag>
              {tags.map((tag) => (
                <Tag key={tag} type='success' plain>
                  {tag}
                </Tag>
              ))}
            </View>
          </View>
        </View>
        <View className={`profile-card__actions ${!isLogin ? 'profile-card__actions--single' : ''}`}>
          {isLogin ? (
            <>
              <Button type='primary' size='small' onClick={() => Taro.showToast({ title: '编辑资料开发中', icon: 'none' })}>
                编辑资料
              </Button>
              <Button type='danger' fill='outline' size='small' onClick={handleLogout}>
                退出登录
              </Button>
            </>
          ) : (
            <Button type='primary' block onClick={handleGoLogin}>
              立即登录
            </Button>
          )}
        </View>
      </View>

      <View className='card stats-card'>
        <View className='stats-card__row'>
          {stats.map((item) => (
            <View className='stats-card__item' key={item.label}>
              <Text className='stats-card__value'>{item.value}</Text>
              <Text className='stats-card__label'>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='card info-card '>
        <Text className='card-title'>个人信息</Text>
        {isLogin ? (
          <CellGroup>
            <Cell title='邮箱' description={profile?.email} />
            <Cell title='手机号' description={profile?.phone} />
            <Cell title='常用地址' description={defaultAddress} />
          </CellGroup>
        ) : (
          <View className='info-card__empty'>
            <Text>登录后可查看绑定的邮箱、手机号与常用地址</Text>
          </View>
        )}
      </View>

      <View className='card quick-card'>
        <Text className='card-title'>快捷服务</Text>
        <View className='quick-card__grid'>
          {quickEntries.map((entry) => (
            <Button
              key={entry.label}
              type='primary'
              fill='outline'
              onClick={() => (isLogin ? entry.action() : handleGoLogin())}>
              {entry.label}
            </Button>
          ))}
        </View>
      </View>
    </View>
  )
}

export default MePage
