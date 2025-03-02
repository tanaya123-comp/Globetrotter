// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import index from './reducers';  // Import the combined reducers

// Create the Redux store
const store = configureStore({
    reducer: index,  // Pass the combined reducers to configureStore
    devTools: process.env.NODE_ENV !== 'production',  // Enable Redux DevTools only in development
});

export default store;  // Export the store to be used in the app
