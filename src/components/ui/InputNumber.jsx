import React from "react";
import Icon from "@/components/ui/Icon";

const InputNumber = ({
  label,
  placeholder,
  className = "",
  classLabel = "form-label",
  value,
  onChange,
  error,
  disabled,
  id,
  min = "0",
  step = "0.01",
  horizontal,
  validate,
  description,
  noDecimal = false,
  ...rest
}) => {
  const blockNegative = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
    if (noDecimal && (e.key === "." || e.key === ",")) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "" || Number(val) >= 0) {
      if (onChange) onChange(e);
    }
  };

  return (
    <div
      className={`textfiled-wrapper ${error ? "is-error" : ""} ${horizontal ? "flex" : ""
        } ${validate ? "is-valid" : ""}`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
            }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={handleChange}
          onKeyDown={blockNegative}
          className={`text-control py-[10px] ${error ? "is-error" : ""} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          id={id}
          {...rest}
        />
        <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {error && (
            <span className="text-red-500">
              <Icon icon="ph:info-fill" />
            </span>
          )}
          {validate && (
            <span className="text-green-500">
              <Icon icon="ph:check-circle-fill" />
            </span>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-1 text-red-500 block text-xs">
          {typeof error === "object" ? error.message : error}
        </div>
      )}
      {validate && (
        <div className="mt-2 text-green-500 block text-sm">{validate}</div>
      )}
      {description && <span className="input-help">{description}</span>}
    </div>
  );
};

export default InputNumber;
