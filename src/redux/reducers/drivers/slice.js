import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../../constants/firestore";

export const driversSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],
    loading: true,
  },

  reducers: {
    updateDrivers: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.drivers = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDrivers } = driversSlice.actions;
export const driversData = (state) => state.drivers;
export default driversSlice.reducer;
