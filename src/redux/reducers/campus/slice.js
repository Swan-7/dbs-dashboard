import { createSlice } from "@reduxjs/toolkit";

export const campusSlice = createSlice({
  name: "campus",
  initialState: {
    campus: [],
  },

  reducers: {
    updatecampus: (state, action) => {
      console.log(action.payload, "campus payload");
      //   console.log(action.payload.first_name, "first name");
      state.campus = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatecampus } = campusSlice.actions;
export const campus = (state) => state.campus;
export default campusSlice.reducer;
