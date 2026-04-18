import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isAuthenticated: false
    },

    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
        }
    }
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;