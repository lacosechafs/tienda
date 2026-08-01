import { UserPayload, UserState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
    data: {
        address: [],
        phone: null,
        name: '',
        favs: [],
        orders: []
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setApData: (state, action) => {
            state.data.address = action.payload.address;
            state.data.phone = action.payload.phone;
            state.data.name = action.payload.name;
            state.data.favs = action.payload.favs;
            state.data.orders = action.payload.orders;
        },
        changeData: (state, action: PayloadAction<UserPayload>) => {
            const { key, value } = action.payload;
            (state.data as Record<string, unknown>)[key] = value;
        },

    }
})

export const {
    setApData,
    changeData

} = userSlice.actions;
export default userSlice.reducer