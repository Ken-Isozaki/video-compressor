import Select from "react-select";
import SettingLabel from "./SettingLabel";

interface SelectOptionProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<string | number>;
  optionsDispName: Record<string | number, string>;
  tooltip: React.ReactNode;
}

const SelectOption = ({
  label,
  value,
  onChange,
  options,
  optionsDispName,
  tooltip,
}: SelectOptionProps) => {
  // react-select用のオプション形式に変換
  const SelectOptions = options.map((opt) => ({
    value: opt,
    label: optionsDispName[opt],
  }));

  // カスタムスタイル定義
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "28px",
      height: "28px",
      padding: "0 2px",
      fontSize: "0.875rem", // text-sm 相当
      borderColor: state.isFocused ? "#0ea5e9" : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#0ea5e9",
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 6px",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "28px",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0 2px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: "0.875rem",
      padding: "6px 10px",
      backgroundColor: state.isFocused ? "#e0f2fe" : "white",
      color: "black",
    }),
  };

  return (
    <div>
      <SettingLabel label={label} tooltip={tooltip} />
      <Select
        value={SelectOptions.find((opt) => opt.value === value)}
        onChange={(selected) => selected && onChange(selected.value)}
        options={SelectOptions}
        styles={customStyles}
        isSearchable={false}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        className="mb-2"
      />
    </div>
  );
};

export default SelectOption;
