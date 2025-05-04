import React from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  return (
    <div
      className={`relative inline-flex w-12 h-6 transition duration-200 ease-in ${
        isChecked ? "bg-sky-600" : "bg-slate-300"
      } rounded-full`}
      onClick={() => {
        onChange(!isChecked);
      }}
      style={{ verticalAlign: "middle" }}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
          isChecked ? "translate-x-6" : ""
        }`}
      ></span>
    </div>
  );
};

export default ToggleSwitch;
