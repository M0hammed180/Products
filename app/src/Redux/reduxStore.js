import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; 
import pageRducer from "./pageSlice"; 

const store = configureStore({
  reducer: {
    user: userReducer, 
    page:pageRducer
  },
});

export default store;