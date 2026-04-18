import { configureStore } from "@reduxjs/toolkit";
//import incomeReducer from "../features/income/incomeSlice";
//import expenseReducer from "../features/expense/expenseSlice";
import userReducer from "../features/user/userSlice";
import transactionReducer from "../features/transaction/transactionSlice";


import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  //expense: expenseReducer,
  //income: incomeReducer,
  transaction:transactionReducer,
  user: userReducer
});

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);