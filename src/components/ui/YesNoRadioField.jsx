import React from "react";
import Radio from "./Radio";

const YesNoRadioField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = true,
}) => {
  const options = ["yes", "no"];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <label className="block font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-6">
        {options.map((opt) => (
          <Radio
            key={opt}
            label={opt === "yes" ? "Yes" : "No"}
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default YesNoRadioField;
