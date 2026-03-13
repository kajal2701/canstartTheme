import React from "react";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";
import PriceRow from "./PriceRow";
const SummarySection = ({ quote, summaryCalculations }) => {
  // ✅ payment_details is array
  const pd = Array.isArray(quote?.payment_details)
    ? quote.payment_details[0]
    : quote?.payment_details;

  return (
    <Card>
      <SectionHeader icon="ph:calculator" title="Summary" />
      <div className="space-y-2.5">
        <PriceRow
          label="Total Linear Feet"
          value={`$${quote.total_feet_price}`}
        />
        <PriceRow
          label="Total Controller"
          value={`$${quote.total_controller_price}`}
        />
        <PriceRow
          label={`Discount (${quote.discount_percentage}%)`}
          value={summaryCalculations.discountAmountFormatted}
          red={true}
        />
        {summaryCalculations.extraWorkTotal > 0 && (
          <PriceRow
            label="Extra Work Total"
            value={`$${Number(summaryCalculations.extraWorkTotal).toFixed(2)}`}
          />
        )}
        <PriceRow
          label={`GST (${quote.gst_percentage}%)`}
          value={`$${Number(summaryCalculations.gstValue || 0).toFixed(2)}`}
        />

        <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-base">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
              Main Total
            </span>
            <span className="text-2xl font-bold text-white">
              $
              {Number(
                summaryCalculations.mainTotalValue || quote.main_total || 0,
              ).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ✅ Payment status section — matches PHP logic */}
        {pd && (
          <div className="pt-3 space-y-2">
            {pd.status === 1 ? (
              <>
                <p className="text-sm font-semibold text-green-600">
                  Payment Paid: $
                  {Number(pd.part_payment_amount || 0).toFixed(2)}
                </p>
                {Number(pd.pending_payment_amount) > 0 && (
                  <p className="text-sm font-semibold text-red-500">
                    Pending Payment: $
                    {Number(pd.pending_payment_amount).toFixed(2)}
                  </p>
                )}
              </>
            ) : pd.status === 0 ? (
              <p className="text-sm font-semibold text-orange-500">
                Awaiting Confirmation: $
                {Number(pd.part_payment_amount || 0).toFixed(2)}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SummarySection;
