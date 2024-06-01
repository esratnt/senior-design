import { createSlice } from "@reduxjs/toolkit";

const userAuthFromLocalStorage = () => {
  const isAuth = localStorage.getItem("isAuth");
  const role = localStorage.getItem("role");

  return {
    isAuth: isAuth && JSON.parse(isAuth) === true,
    role: role || null,
  };
};

const initialState = {
  isAuth: userAuthFromLocalStorage().isAuth,
  role: userAuthFromLocalStorage().role,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.isAuth = true;
      state.role = action.payload.role;
      localStorage.setItem("isAuth", true);
      localStorage.setItem("role", action.payload.role);
    },
    unauthenticateUser: (state) => {
      state.isAuth = false;
      state.role = null;
      localStorage.removeItem("isAuth");
      localStorage.removeItem("role");
    },
  },
});

export const { authenticateUser, unauthenticateUser } = authSlice.actions;

export default authSlice.reducer;
