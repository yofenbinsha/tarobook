import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Taro from '@tarojs/taro'

export interface UserProfile {
  name: string
  email: string
  phone: string
  avatar?: string
  cardNo: string
}

export interface AuthState {
  profile: UserProfile | null
  token: string
}

const USER_STORAGE_KEY = 'user_profile'
const TOKEN_STORAGE_KEY = 'token'

const readProfileFromStorage = (): UserProfile | null => {
  try {
    const raw = Taro.getStorageSync(USER_STORAGE_KEY)
    return raw || null
  } catch (error) {
    return null
  }
}

const readTokenFromStorage = () => {
  try {
    return Taro.getStorageSync(TOKEN_STORAGE_KEY) || ''
  } catch (error) {
    return ''
  }
}

const initialState: AuthState = {
  profile: readProfileFromStorage(),
  token: readTokenFromStorage(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ profile: UserProfile; token: string }>) {
      state.profile = action.payload.profile
      state.token = action.payload.token
      Taro.setStorageSync(USER_STORAGE_KEY, action.payload.profile)
      Taro.setStorageSync(TOKEN_STORAGE_KEY, action.payload.token)
    },
    clearUser(state) {
      state.profile = null
      state.token = ''
      Taro.removeStorageSync(USER_STORAGE_KEY)
      Taro.removeStorageSync(TOKEN_STORAGE_KEY)
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
