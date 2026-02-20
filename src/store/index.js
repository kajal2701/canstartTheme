import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
const store = configureStore({
  reducer: {
    ...rootReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) => {
    const middleware = [...getDefaultMiddleware()];
    return middleware;
  },
});

export default store;
