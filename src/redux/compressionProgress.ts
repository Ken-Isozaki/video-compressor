import { createSlice } from "@reduxjs/toolkit";

export const compressionProgress = createSlice({
  name: "compressionProgress",
  initialState: { isCompressing: false, progress: 0 },
  reducers: {
    switchIsCompressing: (state, action) => {
      state.isCompressing = action.payload;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
});

export const { switchIsCompressing, updateProgress } =
  compressionProgress.actions;
export default compressionProgress.reducer;
