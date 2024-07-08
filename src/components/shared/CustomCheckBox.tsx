import React from "react";

interface CustomCheckboxProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <button
      className={`px-4 py-2 m-1 border rounded ${
        selected
          ? "border-purple-600 bg-purple-100"
          : "border-gray-300 bg-white"
      }`}
      onClick={onSelect}
    >
      <span className="text-black">{label}</span>
    </button>
  );
};

export default CustomCheckbox;
