import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: "transaction",
    initialState: [],
    reducers: {
        setTransactions: (state, action) => action.payload,

        addTransaction: (state, action) => {
            state.push(action.payload);
        },

        deleteTransaction: (state, action) => {
            return state.filter(t => t._id !== action.payload);
        }
    }
});

export const {
    setTransactions,
    addTransaction,
    deleteTransaction
} = transactionSlice.actions;

export default transactionSlice.reducer;