import { open } from "@tauri-apps/plugin-dialog";
import { useEffect, useRef, useState } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { BsUpload } from "react-icons/bs";
import { BsFileEarmarkPlay } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../redux/store";
import {
  changeInputPath,
  changeOutputPath,
} from "../../redux/compressionSettingSlice";

import { toast } from "react-toastify";

const FileSelection = () => {
  const dispatch = useDispatch();
  const { inputPath } = useSelector(
    (state: RootStore) => state.compressionSetting
  );
  const { sameFolderSave, outputFolder, outputFileSuffix } = useSelector(
    (state: RootStore) => state.appSetting
  );

  const dropAreaRef = useRef<HTMLDivElement | null>(null);
  const [isDropArea, setIsDropArea] = useState(false);

  // 自動で出力ファイル名を生成する関数
  const setOutputPathFromInputPath = (
    newInputPath: string,
    sameFolderSave: boolean
  ) => {
    if (newInputPath) {
      const dotIndex = newInputPath.lastIndexOf(".");
      const output = sameFolderSave
        ? newInputPath.slice(0, dotIndex) +
          outputFileSuffix +
          newInputPath.slice(dotIndex)
        : outputFolder +
          "\\" +
          newInputPath.split("\\").pop()?.split(".")[0] +
          outputFileSuffix +
          newInputPath.slice(dotIndex);
      dispatch(changeOutputPath(output));
    }
  };

  useEffect(() => {
    // ドラッグ＆ドロップのリスナー
    const dropUnsubscribe = getCurrentWebview().onDragDropEvent((event) => {
      const payload = event.payload;

      if (!dropAreaRef.current) return;

      const scale = window.devicePixelRatio;
      const inAreaCheck = (x: number, y: number): boolean => {
        if (dropAreaRef.current) {
          const rect = dropAreaRef.current.getBoundingClientRect();
          const isInside =
            x >= rect.left * scale &&
            x <= rect.right * scale &&
            y >= rect.top * scale &&
            y <= rect.bottom * scale;
          return isInside;
        }
        return false;
      };

      // ドロップエリアに入ったかどうかを確認
      if (payload.type === "over" && payload.position) {
        const isInside = inAreaCheck(payload.position.x, payload.position.y);
        setIsDropArea(isInside);
      }

      // ドロップエリア内でドロップされたかどうかを確認
      if (payload.type === "drop" && payload.position) {
        const isInside = inAreaCheck(payload.position.x, payload.position.y);

        if (!isInside) return;
        if (payload.paths?.length === 1) {
          const isValidExtension = (filePath: string) => {
            const validExtensions = ["mp4", "mov", "avi", "mpeg", "mpg"];
            const fileExtension = filePath.split(".").pop()?.toLowerCase();
            return validExtensions.includes(fileExtension || "");
          };

          if (payload.paths[0] && isValidExtension(payload.paths[0])) {
            dispatch(changeInputPath(payload.paths[0]));
            setOutputPathFromInputPath(payload.paths[0], sameFolderSave);
          } else {
            toast.error("mp4などの動画ファイルを選択してください", {
              autoClose: 3000,
            });
          }
        } else {
          toast.error("ドロップするファイルは一つにしてください", {
            autoClose: 3000,
          });
        }
        setIsDropArea(false);
      }
    });

    return () => {
      dropUnsubscribe.then((f) => f());
    };
  }, [sameFolderSave, outputFolder, outputFileSuffix]);

  // ファイル選択
  const handleFileSelect = async () => {
    const selected = await open({
      filters: [
        { name: "Video", extensions: ["mp4", "mov", "avi", "mpeg", "mpg"] },
      ],
      multiple: false,
    });

    if (typeof selected === "string") {
      dispatch(changeInputPath(selected));
      setOutputPathFromInputPath(selected, sameFolderSave);
    }
  };

  return (
    <div
      className={`w-full h-40 mb-3 flex flex-col items-center justify-center border-dashed transition-colors duration-200 rounded-lg border-2 cursor-pointer
    ${
      isDropArea
        ? "border-green-500 bg-green-50 text-green-800"
        : inputPath === ""
        ? "border-gray-300 bg-white text-gray-500  hover:bg-gray-50"
        : "border-sky-600 bg-sky-50 text-sky-800 border-solid"
    }
  `}
      ref={dropAreaRef}
      onClick={handleFileSelect}
    >
      {inputPath === "" ? (
        <>
          <BsUpload className="h-10 w-10 text-gray-500 mb-2" />
          <span className="text-center px-2 text-sm">
            ここにファイルをドロップするか、
            <br />
            <span className="text-sky-600 font-semibold">
              クリックしてファイルを選択
            </span>{" "}
            してください
          </span>
        </>
      ) : (
        <>
          <BsFileEarmarkPlay className="h-9 w-9 mb-2" />
          <p className="text-center text-base break-all px-4 max-w-full overflow-hidden">
            {inputPath}
          </p>
        </>
      )}
    </div>
  );
};

export default FileSelection;
