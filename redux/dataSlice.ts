import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductsState {
  products: any[];
}

const initialState: ProductsState = { products: [] }

export const dataSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.products = action.payload
    }
  }
})

export const { setData } = dataSlice.actions;
export default dataSlice.reducer;
