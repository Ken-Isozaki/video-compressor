import { useDispatch, useSelector } from "react-redux";
import { changeOutputPath } from "../../redux/compressionSettingSlice";
import { RootStore } from "../../redux/store";

const OutputPathSection = () => {
  const dispatch = useDispatch();
  const { outputPath } = useSelector(
    (state: RootStore) => state.compressionSetting
  );

  return (
    <div className="w-full mb-3">
      <input
        type="text"
        className="h-9 w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
        value={outputPath}
        placeholder="出力ファイル名"
        onChange={(e) => dispatch(changeOutputPath(e.target.value))}
      />
    </div>
  );
};

export default OutputPathSection;
