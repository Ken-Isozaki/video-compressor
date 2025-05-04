import { configureStore } from "@reduxjs/toolkit";
import compressionSettingReducer from "./compressionSettingSlice";
import compressionProgressReducer from "./compressionProgress";
import appSettingReducer from "./appSettingSlice";

export const store = configureStore({
  reducer: {
    compressionSetting: compressionSettingReducer,
    compressionProgress: compressionProgressReducer,
    appSetting: appSettingReducer,
  },
});

export type RootStore = ReturnType<typeof store.getState>;
