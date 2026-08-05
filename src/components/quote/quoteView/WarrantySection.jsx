import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import QuoteButton from "./QuoteButton";
import confirmAction from "../../../utils/confirmAction";
import { toast } from "react-toastify";
import {
  setWarrantyParams,
  sendWarrantyEmail,
} from "../../../services/quoteService";
import { formatDateLong } from "../../../utils/formatters";

const WarrantySection = ({ quote, onSubmitSuccess }) => {
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [productYears, setProductYears] = useState(
    quote?.warranty_data?.product_years ?? 5
  );
  const [labourYears, setLabourYears] = useState(
    quote?.warranty_data?.labour_years ?? 4
  );
  const [isSavingWarranty, setIsSavingWarranty] = useState(false);
  const [isSendingWarrantyEmail, setIsSendingWarrantyEmail] = useState(false);

  // ── Save warranty params ──
  const handleSaveWarranty = async () => {
    try {
      setIsSavingWarranty(true);
      const result = await setWarrantyParams({
        quote_id: quote?.quote_id,
        product_years: Number(productYears),
        labour_years: Number(labourYears),
      });
      toast.success(result.message);
      setWarrantyModalOpen(false);
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSavingWarranty(false);
    }
  };

  // ── Send warranty & review email ──
  const handleSendWarrantyEmail = async () => {
    const ok = await confirmAction({
      text: quote?.review_email_sent_at
        ? `Email was already sent on ${new Date(quote.review_email_sent_at).toLocaleDateString()}. Send again?`
        : "Send warranty registration & Google review email to the customer?",
      confirmButtonText: quote?.review_email_sent_at ? "Yes, resend" : "Yes, send it!",
    });
    if (!ok) return;

    try {
      setIsSendingWarrantyEmail(true);
      const result = await sendWarrantyEmail({ quote_id: quote?.quote_id });
      toast.success(result.message);
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSendingWarrantyEmail(false);
    }
  };

  return (
    <>
      {/* ── Warranty Action Buttons ── */}
      <div className="mt-4 flex flex-wrap gap-3">
        <QuoteButton
          icon="ph:shield-check"
          variant="primary"
          onClick={() => setWarrantyModalOpen(true)}
        >
          {quote?.warranty_data ? "Edit Warranty Parameters" : "Set Warranty Parameters"}
        </QuoteButton>

        {quote?.warranty_data && (
          <QuoteButton
            icon="ph:envelope-simple"
            variant="success"
            onClick={handleSendWarrantyEmail}
            disabled={isSendingWarrantyEmail}
          >
            {isSendingWarrantyEmail
              ? "Sending..."
              : quote?.review_email_sent_at
                ? "Resend Warranty & Review Email"
                : "Send Warranty & Review Email"}
          </QuoteButton>
        )}
      </div>

      {/* ── Warranty Info Card ── */}
      {quote?.warranty_data && (
        <div className="mt-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 space-y-1">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2">
            <Icon icon="ph:shield-check" className="text-lg" /> Warranty Registered
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Start Date: <span className="font-semibold">{formatDateLong(quote.warranty_data.start_date)}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Product Warranty: <span className="font-semibold">{quote.warranty_data.product_years} Years</span> — Ends <span className="font-semibold">{formatDateLong(quote.warranty_data.product_end_date)}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Labour Warranty: <span className="font-semibold">{quote.warranty_data.labour_years} Years</span> — Ends <span className="font-semibold">{formatDateLong(quote.warranty_data.labour_end_date)}</span>
          </p>
          {quote?.review_email_sent_at && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✉️ Email sent on {new Date(quote.review_email_sent_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
        </div>
      )}

      {/* ── Warranty Parameters Modal ── */}
      <Modal
        title="Set Warranty Parameters"
        activeModal={warrantyModalOpen}
        onClose={() => setWarrantyModalOpen(false)}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Warranty Start Date (Installation Date)</p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {quote?.installation_date
                ? formatDateLong(quote.installation_date)
                : "Not set"}
            </p>
          </div>
          <Textinput
            label="Product Warranty (Years)"
            type="number"
            min="1"
            max="25"
            value={productYears}
            onChange={(e) => setProductYears(e.target.value)}
          />
          <Textinput
            label="Labour Warranty (Years)"
            type="number"
            min="1"
            max="25"
            value={labourYears}
            onChange={(e) => setLabourYears(e.target.value)}
          />
          {quote?.installation_date && productYears > 0 && labourYears > 0 && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Calculated End Dates:</p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Product Warranty Ends: <strong>{
                  (() => {
                    const d = new Date(quote.installation_date);
                    d.setFullYear(d.getFullYear() + Number(productYears));
                    return formatDateLong(d.toISOString());
                  })()
                }</strong>
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Labour Warranty Ends: <strong>{
                  (() => {
                    const d = new Date(quote.installation_date);
                    d.setFullYear(d.getFullYear() + Number(labourYears));
                    return formatDateLong(d.toISOString());
                  })()
                }</strong>
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              text={isSavingWarranty ? "Saving..." : "Save Warranty"}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              type="button"
              disabled={isSavingWarranty || !productYears || !labourYears}
              onClick={handleSaveWarranty}
            />
            <Button
              text="Cancel"
              className="bg-slate-300 hover:bg-slate-400 text-slate-800"
              type="button"
              onClick={() => setWarrantyModalOpen(false)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WarrantySection;
