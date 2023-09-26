import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import thunk from 'redux-thunk';
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from '../feature/user.slice';
import videosdkAuthTokenReducer from '../feature/videosdk.authtoken.slice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // whitelist: ['user']
}

const reducers = combineReducers({
    user: userReducer,
    videosdk: videosdkAuthTokenReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV != 'production',
    middleware: [thunk]
})

export default store
