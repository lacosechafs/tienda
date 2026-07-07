import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      data: dataSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']