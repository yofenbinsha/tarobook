import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { Provider } from 'react-redux'
import { store } from './store'
// 全局样式
import './app.less'

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return React.createElement(Provider, { store }, props.children)
}

export default App
