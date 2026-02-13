// components/quote/ProductRow.jsx
import React from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

const mandatoryOptions = [
  { value: "mandatory", label: "Mandatory" },
  { value: "optional", label: "Optional" },
];

/**
 * ProductRow Component
 *
 * Displays a single product row with quantity, amount, and option
 *
 * Props:
 * @param {object} product - Product data
 * @param {function} onChange - Callback when product data changes
 */
const ProductRow = ({ product, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...product, [field]: value });
  };

  return (
    <div className="grid grid-cols-4 gap-4 items-center">
      {/* Product Name */}
      <Textinput
        value={product.name}
        onChange={(e) => handleChange("name", e.target.value)}
        disabled
        className="bg-gray-50"
      />

      {/* Quantity */}
      <Textinput
        type="text"
        value={product.quantity}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          handleChange("quantity", value);
        }}
        placeholder="0"
      />

      {/* Amount */}
      <Textinput
        type="text"
        value={product.amount}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          handleChange("amount", value);
        }}
        placeholder="0.00"
      />

      {/* Option */}
      <Select
        className="react-select"
        classNamePrefix="select"
        options={mandatoryOptions}
        value={mandatoryOptions.find((opt) => opt.value === product.option)}
        onChange={(selected) => handleChange("option", selected.value)}
        isSearchable={false}
      />
    </div>
  );
};

export default ProductRow;
