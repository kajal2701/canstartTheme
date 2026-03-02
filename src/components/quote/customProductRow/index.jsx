// components/quote/CustomProductRow.jsx
import React from "react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Select from "react-select";

const mandatoryOptions = [
  { value: "mandatory", label: "Mandatory" },
  { value: "optional", label: "Optional" },
];

/**
 * CustomProductRow Component
 *
 * Displays a custom product row with description, quantity, price, amount, and actions
 *
 * Props:
 * @param {object} product - Custom product data
 * @param {function} onChange - Callback when product data changes
 * @param {function} onRemove - Callback when remove button is clicked
 * @param {object} errors - Validation errors
 */
const CustomProductRow = ({
  product,
  onChange,
  onRemove,
  errors = {},
  onErrorChange,
}) => {
  const handleChange = (field, value) => {
    // ✅ Clear error immediately on change
    if (onErrorChange && errors[field]) {
      onErrorChange(field, "");
    }

    const updated = { ...product, [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      const qty =
        parseFloat(field === "quantity" ? value : product.quantity) || 0;
      const price =
        parseFloat(field === "unitPrice" ? value : product.unitPrice) || 0;
      updated.amount = (qty * price).toFixed(2);
    }
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      {/* Product Description */}
      <div className="md:col-span-3">
        <Textarea
          placeholder="Product description"
          rows={1}
          value={product.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="h-[42px]"
        />
      </div>

      {/* Quantity + Error below */}
      <div className="md:col-span-2">
        <Textinput
          type="text"
          placeholder="0"
          value={product.quantity}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            handleChange("quantity", value);
          }}
          className="h-[42px]"
          required
        />
        {errors?.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
        )}
      </div>

      {/* Unit Price + Error below */}
      <div className="md:col-span-2">
        <Textinput
          type="text"
          placeholder="0.00"
          value={product.unitPrice}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            handleChange("unitPrice", value);
          }}
          className="h-[42px]"
          required
        />
        {errors?.unitPrice && (
          <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>
        )}
      </div>

      {/* Amount (calculated, read-only) */}
      <div className="md:col-span-2">
        <Textinput
          type="text"
          placeholder="0.00"
          value={product.amount}
          disabled
          className="h-[42px] bg-gray-50"
        />
      </div>

      {/* Actions: Option select + Remove button */}
      <div className="md:col-span-3 flex items-center gap-2">
        <Select
          className="react-select w-full"
          classNamePrefix="select"
          options={mandatoryOptions}
          value={mandatoryOptions.find((opt) => opt.value === product.option)}
          onChange={(selected) => handleChange("option", selected.value)}
          isSearchable={false}
        />
        <Button
          text="Remove"
          className="btn-danger btn-sm whitespace-nowrap"
          onClick={onRemove}
          type="button"
        />
      </div>
    </div>
  );
};

export default CustomProductRow;
