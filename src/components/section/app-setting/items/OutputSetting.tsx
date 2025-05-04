import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { motion, AnimatePresence } from "framer-motion";
import SettingLabel from "../../../common/SettingLabel";
import SettingHeader from "../../../common/SettingHeader";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../../redux/store";
import {
  changeSameFolderSave,
  changeOutputFolder,
  changeOutputFileSuffix,
  changeSaveSettingsOnClose,
} from "../../../../redux/appSettingSlice";

const OutputSetting = () => {
  const [isSettingOpen, setIsSettingOpen] = useState(true);

  const dispatch = useDispatch();
  const {
    sameFolderSave,
    outputFolder,
    outputFileSuffix,
    saveSettingsOnClose,
  } = useSelector((state: RootStore) => state.appSetting);

  // ファイル選択
  const handleFileSelect = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });

    if (typeof selected === "string") {
      dispatch(changeOutputFolder(selected));
    }
  };

  return (
    <div className="h-full p-10 flex flex-col">
      <SettingHeader
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
        label={"出力ファイル設定"}
      />
      <div
        className={`overflow-hidden border-t ${
          isSettingOpen ? "border-b" : ""
        } border-slate-300 bg-slate-100`}
      >
        <AnimatePresence initial={false}>
          {isSettingOpen && (
            <motion.div
              key="setting"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-5 bg-slate-100 overflow-hidden "
            >
              {/* スペース確保用 */}
              <div className="mt-3"></div>
              <SettingLabel
                label={"同じフォルダに保存"}
                tooltip={
                  <p>
                    この設定をONにすると
                    <br />
                    圧縮後のファイルの出力先が
                    <br />
                    元ファイルと同じフォルダに
                    <br />
                    指定されます
                  </p>
                }
              />
              <ToggleSwitch
                isChecked={sameFolderSave}
                onChange={(checked) => {
                  dispatch(changeSameFolderSave(checked));
                }}
              />

              <SettingLabel
                label={"出力先フォルダ"}
                tooltip={
                  <p>
                    上記設定を OFF にしたとき
                    <br />
                    ここで出力先を指定できます
                  </p>
                }
              />
              <div className="flex">
                <input
                  className={`flex-grow min-h-[28px] h-[28px] px-2 text-sm border bg-slate-50 border-slate-300 focus:border-sky-500 focus:outline-none rounded-sm ${
                    sameFolderSave
                      ? "bg-slate-200 cursor-not-allowed text-slate-500"
                      : "focus:ring-0 hover:border-sky-500"
                  }`}
                  value={outputFolder}
                  disabled={sameFolderSave}
                  onChange={(e) => {
                    dispatch(changeOutputFolder(e.target.value));
                  }}
                />
                <button
                  onClick={handleFileSelect}
                  className={`ml-1 px-2 min-h-[28px] h-[28px] bg-sky-700 text-white rounded-sm text-sm focus:outline-none ${
                    sameFolderSave
                      ? "bg-slate-300 cursor-not-allowed"
                      : "hover:bg-sky-600"
                  }`}
                  disabled={sameFolderSave}
                >
                  選択
                </button>
              </div>

              <SettingLabel
                label={"付与する文字列"}
                tooltip={
                  <p>
                    圧縮後のファイルに付与する
                    <br />
                    文字列を指定します
                  </p>
                }
              />
              <input
                value={outputFileSuffix}
                onChange={(e) => {
                  dispatch(changeOutputFileSuffix(e.target.value));
                }}
                className="w-full min-h-[28px] h-[28px] px-2 text-sm border bg-slate-50 border-slate-300 focus:border-sky-500 focus:outline-none focus:ring-0 hover:border-sky-500 rounded-sm"
              />

              {/* スペース確保用 */}
              <div className="mt-3"></div>

              <SettingLabel
                label={"これらの設定を保存"}
                tooltip={
                  <p>
                    この設定をONにすると
                    <br />
                    上記の設定を記憶し
                    <br />
                    次回起動時も使用します
                  </p>
                }
                tooltipPos={"-translate-y-3"}
              />
              <ToggleSwitch
                isChecked={saveSettingsOnClose}
                onChange={(checked) => {
                  dispatch(changeSaveSettingsOnClose(checked));
                }}
              />
              {/* スペース確保用 */}
              <div className="mt-4"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OutputSetting;
