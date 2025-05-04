import "./App.css";

import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { useDispatch, useSelector } from "react-redux";
import { updateProgress } from "./redux/compressionProgress";
import { RootStore } from "./redux/store";
import {
  changeSameFolderSave,
  changeOutputFolder,
  changeOutputFileSuffix,
  changeSaveSettingsOnClose,
} from "./redux/appSettingSlice";

import FileSelection from "./components/section/FileSelection";
import ExecuteButton from "./components/section/ExecuteButton";
import OutputPathSection from "./components/section/OutputPath";
import ProgressModal from "./components/modal/ProgressModal";
import CompressionSetting from "./components/section/CompressionSetting";
import AppSetting from "./components/section/app-setting/AppSetting";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { isCompressing } = useSelector(
    (state: RootStore) => state.compressionProgress
  );
  const {
    sameFolderSave,
    outputFolder,
    outputFileSuffix,
    saveSettingsOnClose,
  } = useSelector((state: RootStore) => state.appSetting);

  // 設定データの型を定義
  type AppSettings = {
    sameFolderSave: boolean;
    outputFolder: string;
    outputFileSuffix: string;
    saveSettingsOnClose: boolean;
  };

  // 設定値が変更されたら ref を更新
  useEffect(() => {
    settingsRef.current = {
      sameFolderSave,
      outputFolder,
      outputFileSuffix,
      saveSettingsOnClose,
    };
  }, [sameFolderSave, outputFolder, outputFileSuffix, saveSettingsOnClose]);

  // 設定値を保持するための ref を作成
  const settingsRef = useRef({
    sameFolderSave,
    outputFolder,
    outputFileSuffix,
    saveSettingsOnClose,
  });

  // 起動時に設定を読み出し
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = (await invoke(
          "load_app_settings"
        )) as Partial<AppSettings>;

        if (settings) {
          console.log(settings.saveSettingsOnClose);
          // 保存する設定のときはファイルに保存
          if (settings.saveSettingsOnClose) {
            if (settings.sameFolderSave !== undefined) {
              dispatch(changeSameFolderSave(settings.sameFolderSave));
            }
            if (settings.outputFolder !== undefined) {
              dispatch(changeOutputFolder(settings.outputFolder));
            }
            if (settings.outputFileSuffix !== undefined) {
              dispatch(changeOutputFileSuffix(settings.outputFileSuffix));
            }
          }
          if (settings.saveSettingsOnClose !== undefined) {
            dispatch(changeSaveSettingsOnClose(settings.saveSettingsOnClose));
          }
        }
      } catch (error) {
        console.log("設定ファイルが読み込めませんでした");
      }
    };

    loadSettings();
  }, []);

  // 閉じるときに設定保存
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await getCurrentWindow().onCloseRequested(async () => {
        await invoke("save_app_settings", {
          settings: settingsRef.current,
        });
      });
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // 進捗のリスナーを設定
  useEffect(() => {
    const progressListener = listen<number>("compressionProgress", (event) => {
      dispatch(updateProgress(event.payload));
    });

    return () => {
      progressListener.then((f) => f());
    };
  }, []);

  return (
    <main className="flex flex-col h-screen w-screen items-center px-10">
      <AppSetting />
      <FileSelection />
      <OutputPathSection />
      <CompressionSetting />
      <ExecuteButton />
      {isCompressing && <ProgressModal />}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        closeOnClick={true}
        toastClassName="max-w-[300px] !rounded-sm text-sm !pr-6 !pt-3 !pb-5"
      />
    </main>
  );
}

export default App;
