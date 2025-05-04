import { createSlice } from "@reduxjs/toolkit";
import {
  VideoCodec,
  Preset,
  AudioCodec,
  Crf,
  Resolution,
} from "../interfaces/encodeOptions";

export const compressionSettingSlice = createSlice({
  name: "compressionSetting",
  initialState: {
    inputPath: "",
    outputPath: "",
    vcodecOpt: VideoCodec.LibX264,
    presetOpt: Preset.Medium,
    crfOpt: Crf.Crf23,
    acodecOpt: AudioCodec.Copy,
    resolutionOpt: Resolution.Original,
  },
  reducers: {
    changeInputPath: (state, action) => {
      state.inputPath = action.payload;
    },
    changeOutputPath: (state, action) => {
      state.outputPath = action.payload;
    },
    changeVcodecOpt: (state, action) => {
      state.vcodecOpt = action.payload;
    },
    changePresetOpt: (state, action) => {
      state.presetOpt = action.payload;
    },
    changeCrfOpt: (state, action) => {
      state.crfOpt = action.payload;
    },
    changeAcodecOpt: (state, action) => {
      state.acodecOpt = action.payload;
    },
    changeResolutionOpt: (state, action) => {
      state.resolutionOpt = action.payload;
    },
  },
});

export const {
  changeInputPath,
  changeOutputPath,
  changeVcodecOpt,
  changePresetOpt,
  changeCrfOpt,
  changeAcodecOpt,
  changeResolutionOpt,
} = compressionSettingSlice.actions;

export default compressionSettingSlice.reducer;
