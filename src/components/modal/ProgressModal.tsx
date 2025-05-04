import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RootStore } from "../../redux/store";
import { useSelector } from "react-redux";

function ProgressModal() {
  const { progress } = useSelector(
    (state: RootStore) => state.compressionProgress
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative w-40 z-10">
        <CircularProgressbarWithChildren
          value={progress}
          styles={buildStyles({
            pathColor: "#3e98c7",
            trailColor: "#d6d6d6",
          })}
        >
          <div className="flex flex-col h-1/2 w-1/2 text-[#d6d6d6] items-center">
            <p className="p-0 m-0 text-sm font-bold">圧縮中…</p>
            <div className="flex items-end">
              <p className="text-5xl font-bold">{progress}</p>
              <p className="text-2xl font-bold">%</p>
            </div>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
}

export default ProgressModal;
