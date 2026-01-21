// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   access_token: null,
//   refresh_token: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       const { user, access_token, refresh_token } = action.payload;
//       state.user = user;
//       state.access_token = access_token;
//       state.refresh_token = refresh_token;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.access_token = null;
//       state.refresh_token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('authData');
//     },

//         initializeAuth: (state, action) => {
//       const { user, access_token, refresh_token } = action.payload;
//       state.user = user;
//       state.access_token = access_token;
//       state.refresh_token = refresh_token;
//       state.isAuthenticated = true;
//     },

//   },
// });

// export const { login, logout, initializeAuth } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  access_token: null,
  refresh_token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* =========================
          LOGIN
    ========================= */
    login: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;

      state.user = user;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.isAuthenticated = true;

      // ✅ persist auth (dummy or real)
      localStorage.setItem(
        "authData",
        JSON.stringify({ user, access_token, refresh_token })
      );
    },

    /* =========================
          LOGOUT
    ========================= */
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("authData");
    },

    /* =========================
      INIT AUTH (ON REFRESH)
    ========================= */
    initializeAuth: (state) => {
      try {
        const authData = JSON.parse(localStorage.getItem("authData"));

        if (authData?.access_token) {
          state.user = authData.user;
          state.access_token = authData.access_token;
          state.refresh_token = authData.refresh_token;
          state.isAuthenticated = true;
        }
      } catch (err) {
        localStorage.removeItem("authData");
      }
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
