import { createSlice } from "@reduxjs/toolkit";

export const appSettingSlice = createSlice({
  name: "compressionSetting",
  initialState: {
    sameFolderSave: true,
    outputFolder: "",
    outputFileSuffix: "_new",
    saveSettingsOnClose: true,
  },
  reducers: {
    changeSameFolderSave: (state, action) => {
      state.sameFolderSave = action.payload;
    },
    changeOutputFolder: (state, action) => {
      state.outputFolder = action.payload;
    },
    changeOutputFileSuffix: (state, action) => {
      state.outputFileSuffix = action.payload;
    },
    changeSaveSettingsOnClose: (state, action) => {
      state.saveSettingsOnClose = action.payload;
    },
  },
});

export const {
  changeSameFolderSave,
  changeOutputFolder,
  changeOutputFileSuffix,
  changeSaveSettingsOnClose,
} = appSettingSlice.actions;

export default appSettingSlice.reducer;
