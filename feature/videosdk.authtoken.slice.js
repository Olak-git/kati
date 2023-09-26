import { createSlice } from "@reduxjs/toolkit";

export const videosdkAuthtokenSlice = createSlice({
    name: 'videosdk',
    initialState: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlMWY5YmI2MS1iMTViLTRiNmYtOTRhZC0wNmRiNjU2MmQ5ODUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4NDQzMTAyNSwiZXhwIjoxODQyMjE5MDI1fQ.8JY1Ch5bgwSzV0DSBQpYGaCZ8zjZ8r1yz9OO4JIavo4",
        visible: false
    },
    reducers: {
        setVideoSdkToken: (state, action) => {
            state.token = action.payload
        },
        setVisibleLiveButton: (state, action) => {
            state.visible = action.payload
        }
    }
})

export default videosdkAuthtokenSlice.reducer;
export const { setVideoSdkToken, setVisibleLiveButton } = videosdkAuthtokenSlice.actions