import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'
import cartSlice from './cartSlice'

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      data: dataSlice,
      cart: cartSlice
    }
  })

  if (typeof window !== 'undefined') {
    store.subscribe(() => {
      const actualState = store.getState();
      localStorage.setItem('mi_contador', JSON.stringify(actualState.cart));
    });
  }

  return store;
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']