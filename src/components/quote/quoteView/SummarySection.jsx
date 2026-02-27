import React from "react";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";
import PriceRow from "./PriceRow";

const SummarySection = ({ quote, summaryCalculations }) => {
  return (
    <Card>
      <SectionHeader icon="ph:calculator" title="Summary" />
      <div className="space-y-2.5">
        <PriceRow label="Total Linear Feet" value={`$${quote.total_feet_price}`} />
        <PriceRow label="Total Controller" value={`$${quote.total_controller_price}`} />
        <PriceRow 
          label={`Discount (${quote.discount_percentage}%)`} 
          value={summaryCalculations.discountAmountFormatted} 
          red={true} 
        />
        <PriceRow label={`GST (${quote.gst_percentage}%)`} value={`$${quote.gst}`} />

        <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-base">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
              Main Total
            </span>
            <span className="text-2xl font-bold text-white">
              ${quote.main_total}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SummarySection;
