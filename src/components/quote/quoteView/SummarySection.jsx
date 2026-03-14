import React from "react";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";
import PriceRow from "./PriceRow";
const SummarySection = ({
  quote,
  summaryCalculations,
  onlinePayments = [],
}) => {
  // ✅ payment_details is array
  const pd = quote?.payment_details ?? null;
  const latestConfirmed = onlinePayments.find((r) => Number(r.status) === 1);
  const latestPending = onlinePayments.find((r) => Number(r.status) === 0);
  const isFullyPaid = quote?.payment_details?.status == 1;
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
        {!isFullyPaid && onlinePayments.length > 0 && (
          <div className="pt-3 space-y-2">
            {latestConfirmed && (
              <p className="text-sm font-semibold text-green-600">
                Payment Paid: ${latestConfirmed.amount}
              </p>
            )}
            {latestPending && (
              <p className="text-sm font-semibold text-orange-500">
                Awaiting Confirmation: ${latestPending.amount}
              </p>
            )}
            {pd && Number(pd.pending_payment_amount) > 0 && latestConfirmed && (
              <p className="text-sm font-semibold text-red-500">
                Pending Payment: ${pd.pending_payment_amount}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SummarySection;
