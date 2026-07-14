import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'
import cartSlice from './cartSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      data: dataSlice,
      cart: cartSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']