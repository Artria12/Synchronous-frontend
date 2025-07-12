import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";

// Combine reducers
const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [miscSlice.name]: miscSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
  [api.reducerPath]: api.reducer, // Don't persist this one
});

// Redux Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: [authSlice.name, miscSlice.name,chatSlice.name], // do NOT include api.reducerPath here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
export default store;
