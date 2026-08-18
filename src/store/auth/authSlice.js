import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUserFromStorage(),
    isAuth: !!getUserFromStorage(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("lastActivityTime", Date.now().toString());
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("user");
      localStorage.removeItem("lastActivityTime");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
