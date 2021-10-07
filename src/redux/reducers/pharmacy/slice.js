import { createSlice } from "@reduxjs/toolkit";

export const pharmacySlice = createSlice({
  name: "shops",
  initialState: {
    pharmacies: [],
    selectedPharmacy: null,
    products: [],
  },

  reducers: {
    updatePharmacies: (state, action) => {
      state.pharmacies = action.payload;
    },
    updateSelectedPharmacy: (state, action) => {
      state.selectedPharmacy = action.payload;
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePharmacies, updateSelectedPharmacy, updateProducts } =
  pharmacySlice.actions;
export default pharmacySlice.reducer;
