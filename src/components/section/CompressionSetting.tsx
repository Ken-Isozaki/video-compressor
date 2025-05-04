import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  VideoCodec,
  VideoCodecDispName,
  Preset,
  PresetDispName,
  AudioCodec,
  AudioCodecDispName,
  Resolution,
  ResolutionDispName,
  Crf,
  CrfDispName,
} from "../../interfaces/encodeOptions";
import SelectOption from "../common/SelectOption";
import SettingHeader from "../common/SettingHeader";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../redux/store";
import {
  changeVcodecOpt,
  changePresetOpt,
  changeCrfOpt,
  changeAcodecOpt,
  changeResolutionOpt,
} from "../../redux/compressionSettingSlice";

const CompressionSetting = ({}) => {
  const dispatch = useDispatch();
  const { vcodecOpt, presetOpt, crfOpt, acodecOpt, resolutionOpt } =
    useSelector((state: RootStore) => state.compressionSetting);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  useEffect(() => {
    const changeWindowSize = async () => {
      const appWindow = getCurrentWindow();
      const windowHeight = isSettingOpen ? 694 : 386;
      if (!isSettingOpen) {
        // 0.3秒待ってからサイズを変更
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      await appWindow.setSize(new LogicalSize(400, windowHeight));
    };
    changeWindowSize();
  }, [isSettingOpen]);

  return (
    <div className="flex flex-col w-full space-y-3">
      <SettingHeader
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
        label={"圧縮設定"}
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
              className="overflow-hidden px-5"
            >
              <SelectOption
                label="ビデオコーデック"
                value={vcodecOpt}
                onChange={(val) => dispatch(changeVcodecOpt(val as VideoCodec))}
                options={Object.values(VideoCodec)}
                optionsDispName={VideoCodecDispName}
                tooltip={
                  <p>
                    圧縮手法を選択します。
                    <br />
                    LibX265はより新しい手法ですが
                    <br />
                    デバイスによっては再生できない
                    <br />
                    場合があります。
                    <br />
                    LibX264が推奨です。
                  </p>
                }
              />

              <SelectOption
                label="圧縮速さ"
                value={presetOpt}
                onChange={(val) => dispatch(changePresetOpt(val as Preset))}
                options={Object.values(Preset)}
                optionsDispName={PresetDispName}
                tooltip={
                  <p>
                    圧縮処理の速さを選択します。
                    <br />
                    処理が速いほど画質は悪くなります。
                  </p>
                }
              />

              <SelectOption
                label="画像品質"
                value={crfOpt}
                onChange={(val) => dispatch(changeCrfOpt(Number(val)))}
                options={Object.keys(CrfDispName).map(
                  (key) => Number(key) as Crf
                )}
                optionsDispName={CrfDispName}
                tooltip={
                  <p>
                    圧縮後の画質を選択します。
                    <br />
                    高画質なほどファイルサイズは
                    <br />
                    大きくなります。
                  </p>
                }
              />

              <SelectOption
                label="オーディオコーデック"
                value={acodecOpt}
                onChange={(val) => dispatch(changeAcodecOpt(val as AudioCodec))}
                options={Object.values(AudioCodec)}
                optionsDispName={AudioCodecDispName}
                tooltip={
                  <p>
                    音声の圧縮方法を選択します。
                    <br />
                    音声を削除することもできます。
                  </p>
                }
              />

              <SelectOption
                label="サイズ (横幅)"
                value={resolutionOpt}
                onChange={(val) =>
                  dispatch(changeResolutionOpt(val as Resolution))
                }
                options={Object.values(Resolution)}
                optionsDispName={ResolutionDispName}
                tooltip={
                  <p>
                    動画の横幅を選択します。
                    <br />
                    縦幅は自動で調整されます。
                  </p>
                }
              />
              <div className="h-1"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompressionSetting;
