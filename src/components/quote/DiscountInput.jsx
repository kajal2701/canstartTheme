import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";

const DiscountInput = ({ discountPercent, setDiscountPercent, subtotal }) => {
  const [localDiscountAmount, setLocalDiscountAmount] = useState(null);

  const calculateDiscount = () => {
    return (subtotal * discountPercent) / 100;
  };

  return (
    <div className="flex justify-end gap-4">
      <div className="w-full md:w-64">
        <label className="block text-sm font-medium mb-2 text-right">
          Enter Discount Amount ($):
        </label>
        <Textinput
          type="text"
          placeholder="0.00"
          value={
            localDiscountAmount !== null
              ? localDiscountAmount
              : discountPercent > 0
              ? calculateDiscount().toFixed(2)
              : ""
          }
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9.]/g, "");
            if (val.includes(".")) {
              const parts = val.split(".");
              val = parts[0] + "." + parts[1].slice(0, 2);
            }
            setLocalDiscountAmount(val);
            const amount = parseFloat(val) || 0;
            if (subtotal > 0) {
              const percent = (amount / subtotal) * 100;
              setDiscountPercent(parseFloat(percent.toFixed(2)));
            } else {
              setDiscountPercent(0);
            }
          }}
          onBlur={() => setLocalDiscountAmount(null)}
          className="text-right"
        />
      </div>
      <div className="w-full md:w-64">
        <label className="block text-sm font-medium mb-2 text-right">
          Enter Discount (%):
        </label>
        <Textinput
          type="text"
          placeholder="0"
          value={discountPercent}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9.]/g, "");
            if (value.includes(".")) {
              const parts = value.split(".");
              value = parts[0] + "." + parts[1].slice(0, 2);
            }
            setDiscountPercent(value);
            setLocalDiscountAmount(null); // Clear local amount to sync
          }}
          className="text-right"
        />
      </div>
    </div>
  );
};

export default DiscountInput;
