import { ArrayProduct, ProductsState, ProductPayload, SliceType } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProductsState = {
    products: [],
    isOpen: false,
    stock: false,
}

const findProduct = (state: Array<ArrayProduct>, action: { id: number, size: number }) => {
    if (state) {
        return state.find(f => f.id === action.id && f.size === action.size) ?? null
    } else {
        return null
    }
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ProductPayload>) => {
            const item = findProduct(state.products, action.payload)

            if (item) {
                item.quantity += 1;
            } else {
                state.products.push({ ...action.payload, quantity: 1 })
            }
        },
        removeToCart: (state, action: PayloadAction<SliceType>) => {
            const item = findProduct(state.products, action.payload)

            if (!item) return

            if (item.quantity > 1 && !action.payload.quantity) {
                item.quantity -= 1
            } else {
                state.products = state.products.filter(f => f.id !== item.id || f.size !== item.size)
            }
        },
        clearCart: (state) => {
            state.products = []
        },
        manualQuantity: (state, action: PayloadAction<SliceType>) => {
            const item = findProduct(state.products, action.payload)


            if (item && action.payload.quantity && action.payload.quantity > 0) {
                item.quantity = action.payload.quantity;
            } else if (item && action.payload.quantity && action.payload.quantity <= 0) {
                state.products = state.products.filter(f => f.id !== item.id || f.size !== item.size)
            } else {
                state.products.push(action.payload)
            }
        },
        setCartProducts: (state, action) => {
            state.products = action.payload ?? [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen
        },
        toggleStock: (state, action) => {
            state.stock = action.payload
        }
    }
})

export const {
    addToCart,
    removeToCart,
    clearCart,
    manualQuantity,
    setCartProducts,
    toggleCart,
    toggleStock
} = cartSlice.actions;
export default cartSlice.reducer