import { BsQuestionCircle } from "react-icons/bs";
interface SettingLabelProps {
  label: string;
  tooltip: React.ReactNode;
  tooltipPos?: string;
}

const SettingLabel = ({
  label,
  tooltip,
  tooltipPos = "translate-y-2",
}: SettingLabelProps) => {
  return (
    <label className="flex items-center gap-[3px] text-sm mt-2 mb-1">
      {label}
      <div className="relative group">
        <BsQuestionCircle className="mt-[2px] text-sky-700 cursor-pointer" />
        <div
          className={`absolute left-full ${tooltipPos} ml-2 px-2 py-1 text-xs text-white bg-slate-700 rounded 
                opacity-0 group-hover:opacity-100 
                pointer-events-none group-hover:pointer-events-auto 
                transition-opacity duration-300 whitespace-nowrap z-10`}
        >
          {tooltip}
        </div>
      </div>
    </label>
  );
};

export default SettingLabel;
