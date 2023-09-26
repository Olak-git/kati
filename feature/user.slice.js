import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {},
        show_all_system: false
    },
    reducers: {
        setUser: (state, action) => {
            for(let index in action.payload) {
                state.data[index] = action.payload[index];
            }
        },
        deleteIndex: (state, action) => {
            delete(state.data[action.payload]);
        },
        deleteUser: (state) => {
            state.data = {};
        },
        setVisibleAllSystem: (state, action) => {
            state.show_all_system = action.payload
        }
    }
})

export default userSlice.reducer;
export const { setUser, deleteIndex, deleteUser, setVisibleAllSystem } = userSlice.actions