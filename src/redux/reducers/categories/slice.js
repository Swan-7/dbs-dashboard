import { createSlice } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
  },

  reducers: {
    updateCategories: (state, action) => {
      console.log(action.payload, "categories payload");
      //   console.log(action.payload.first_name, "first name");
      state.categories = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCategories } = categoriesSlice.actions;
export const categories = (state) => state.categories;
export default categoriesSlice.reducer;
