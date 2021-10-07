import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../../constants/firestore";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    userCredential: null,
    currentUser: null,
  },

  reducers: {
    update: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.user = action.payload;
    },
    updateUserCred: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.userCredential = action.payload;
    },
    updateCurrentUser: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.currentUser = action.payload;
    },
    updateLoading: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update, updateLoading, updateCurrentUser, updateUserCred } =
  userSlice.actions;
export const userData = (state) => state.user;
export default userSlice.reducer;
