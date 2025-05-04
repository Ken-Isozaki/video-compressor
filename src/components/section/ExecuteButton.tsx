import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import { CompressionParams } from "../../interfaces/encodeOptions";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../redux/store";
import {
  switchIsCompressing,
  updateProgress,
} from "../../redux/compressionProgress";
import { toast } from "react-toastify";

const handleCompress = async (
  compressionParams: CompressionParams,
  dispatch: ReturnType<typeof useDispatch>
) => {
  if (!compressionParams.inputPath || !compressionParams.outputPath) {
    toast.error("出力先を指定してください", { autoClose: 2000 });
    return;
  }

  if (compressionParams.inputPath === compressionParams.outputPath) {
    toast.error("元ファイルと異なる出力先またはファイル名にしてください", {
      autoClose: 2000,
    });
    return;
  }

  // 圧縮中表示の開始
  dispatch(switchIsCompressing(true));

  const response = await invoke("execute_compression", {
    params: compressionParams,
    force: false, // 最初は確認なしで送る
  }).catch(async (e) => {
    console.log(e);

    if (e.includes("Not a file")) {
      toast.error("ファイル名を含めた出力先を指定してください");
      return;
    } else if (e.includes("Invalid output path")) {
      toast.error("出力先のディレクトリを正しく指定してください");
      return;
    } else if (e.includes("already exists")) {
      // 上書き確認
      const shouldOverwrite = await confirm(
        "出力ファイルがすでに存在します。上書きしますか？",
        {
          title: "確認",
          okLabel: "はい",
          cancelLabel: "いいえ",
        }
      );

      if (shouldOverwrite) {
        // force: true を付けて再実行
        return await invoke("execute_compression", {
          params: compressionParams,
          force: true,
        }).catch(async (e) => {
          toast.error("エラーが発生しました: " + e);
        });
      } else {
        dispatch(switchIsCompressing(false));
        return;
      }
    } else if (e.includes("FFmpeg or FFprobe not found")) {
      toast.error(
        <>
          FFmpeg / FFprobe が見つかりません。
          <br />
          このアプリの実行ファイルと同じフォルダに「ffmpeg」フォルダがあることを確認してください。
        </>,
        { autoClose: false }
      );
    } else {
      toast.error("エラーが発生しました: " + e);
    }
  });

  if (response !== undefined) {
    toast.success("圧縮完了しました！", { autoClose: 2000 });
  }

  dispatch(switchIsCompressing(false));
  dispatch(updateProgress(0)); // 圧縮完了後に進捗をリセット
};

const ExecuteButton = () => {
  const dispatch = useDispatch();
  const {
    inputPath,
    outputPath,
    vcodecOpt,
    presetOpt,
    crfOpt,
    acodecOpt,
    resolutionOpt,
  } = useSelector((state: RootStore) => state.compressionSetting);

  // 圧縮パラメータの設定
  const compressionParams: CompressionParams = {
    inputPath: inputPath,
    outputPath: outputPath,
    vcodec: vcodecOpt,
    preset: presetOpt,
    crf: crfOpt,
    acodec: acodecOpt,
    resolution: resolutionOpt,
  };

  const disableExcuteBtn = inputPath === "";

  return (
    <button
      className={`text-white mt-4 py-3 rounded-full w-full ${
        disableExcuteBtn
          ? "bg-slate-300"
          : "bg-sky-700 cursor-pointer hover:bg-sky-600"
      }`}
      onClick={() => handleCompress(compressionParams, dispatch)}
      disabled={disableExcuteBtn}
    >
      圧縮実行
    </button>
  );
};

export default ExecuteButton;
