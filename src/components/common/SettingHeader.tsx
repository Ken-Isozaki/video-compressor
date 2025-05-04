import { IoIosArrowDown } from "react-icons/io";

interface SettingHeaderProps {
  isSettingOpen: boolean;
  setIsSettingOpen: (isOpen: boolean) => void;
  label: string;
}

const SettingHeader = ({
  isSettingOpen,
  setIsSettingOpen,
  label,
}: SettingHeaderProps) => {
  return (
    <h2
      className="mb-1 text-sm flex items-center gap-1 cursor-pointer select-none"
      onClick={() => setIsSettingOpen(!isSettingOpen)}
    >
      <span>{label}</span>
      <span>
        <IoIosArrowDown
          className={`text-gray-600 transition-transform duration-500 text-sm ${
            isSettingOpen ? "rotate-180" : "rotate-360"
          }`}
        />
      </span>
    </h2>
  );
};

export default SettingHeader;
