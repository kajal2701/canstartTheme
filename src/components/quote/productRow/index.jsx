// components/quote/ProductRow.jsx
import React from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

const mandatoryOptions = [
  { value: "mandatory", label: "Mandatory" },
  { value: "optional", label: "Optional" },
];

/*
 * Props:
 * @param {object} product - Product data
 * @param {function} onChange - Callback when product data changes
 * @param {object} errors - Validation errors
 */
const ProductRow = ({ product, onChange, errors = {}, onErrorChange }) => {
  const handleChange = (field, value) => {
    // ✅ Clear error immediately on change
    if (onErrorChange && errors[field]) {
      onErrorChange(field, "");
    }

    if (field === "quantity") {
      const quantity = parseInt(value) || 0;
      const price = parseFloat(product.price) || 0;
      const calculatedAmount = (quantity * price).toFixed(2);
      onChange({ ...product, [field]: value, amount: calculatedAmount });
    } else {
      onChange({ ...product, [field]: value });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
      {/* Product Name */}
      <div>
        <Textinput
          value={product.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled
          className="bg-gray-50"
        />
      </div>

      {/* Quantity + Error below */}
      <div>
        <Textinput
          type="text"
          value={product.quantity}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            handleChange("quantity", value);
          }}
          placeholder="0"
          required
        />
        {errors?.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <Textinput
          type="text"
          value={product.amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            handleChange("amount", value);
          }}
          placeholder="0.00"
          disabled
        />
      </div>

      {/* Option + Error below */}
      <div>
        <Select
          className="react-select w-full"
          classNamePrefix="select"
          options={mandatoryOptions}
          value={mandatoryOptions.find((opt) => opt.value === product.option)}
          onChange={(selected) => handleChange("option", selected.value)}
          isSearchable={false}
        />
        {errors?.option && (
          <p className="text-red-500 text-xs mt-1">{errors.option}</p>
        )}
      </div>
    </div>
  );
};

export default ProductRow;
