import { UserPayload, UserState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
    data: {
        address: [],
        phone: null,
        name: ''
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