import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },

  reducers: {
    updateUsers: (state, action) => {
      console.log(action.payload, "users payload");
      //   console.log(action.payload.first_name, "first name");
      state.users = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUsers } = usersSlice.actions;
export const users = (state) => state.users;
export default usersSlice.reducer;
