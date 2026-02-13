// components/quote/PriceSummary.jsx
import React from "react";

/**
 * PriceSummary Component
 *
 * Displays the price breakdown and total
 *
 * Props:
 * @param {number} totalControllerPrice - Total controller price
 * @param {number} totalLinearFeetPrice - Total linear feet price
 * @param {number} discountPercent - Discount percentage
 * @param {number} discountAmount - Calculated discount amount
 * @param {number} gstAmount - Calculated GST amount
 * @param {number} mainTotal - Final total after discount and GST
 */
const PriceSummary = ({
  totalControllerPrice,
  totalLinearFeetPrice,
  discountPercent,
  discountAmount,
  gstAmount,
  mainTotal,
}) => {
  const formatCurrency = (value) => {
    return `$ ${parseFloat(value || 0).toFixed(2)}`;
  };

  return (
    <div className="w-full md:w-auto space-y-2 text-right">
      {/* Controller Price */}
      <div className="flex justify-between md:justify-end gap-8 text-gray-700">
        <span>Total Controller price :</span>
        <span className="font-medium">
          {formatCurrency(totalControllerPrice)}
        </span>
      </div>

      {/* Linear Feet Price */}
      <div className="flex justify-between md:justify-end gap-8 text-gray-700">
        <span>Total Linear Feet Price :</span>
        <span className="font-medium">
          {formatCurrency(totalLinearFeetPrice)}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t pt-2 mt-2">
        {/* Discount */}
        <div className="flex justify-between md:justify-end gap-8 text-gray-700">
          <span>Discount ({discountPercent}%) :</span>
          <span className="font-medium">
            - {formatCurrency(discountAmount)}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between md:justify-end gap-8 text-gray-700">
          <span>GST (0%) :</span>
          <span className="font-medium">{formatCurrency(gstAmount)}</span>
        </div>

        {/* Main Total */}
        <div className="flex justify-between md:justify-end gap-8 text-lg font-bold text-gray-900 mt-2">
          <span>Main Total :</span>
          <span>{formatCurrency(mainTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
