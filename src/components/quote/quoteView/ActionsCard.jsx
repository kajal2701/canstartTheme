import React, { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";
import QuoteButton from "./QuoteButton";
import PaymentInfo from "./PaymentInfo";
import { BUTTON_ICONS } from "./constants";
import Modal from "@/components/ui/Modal";
import Radio from "@/components/ui/Radio";
import Checkbox from "@/components/ui/Checkbox";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { getImgSrc } from "../../../utils/formatters";
import { toast } from "react-toastify";
import {
  resendQuote,
  sendFinalQuote,
  updateQuoteSend,
} from "../../../services/quoteService";

const ActionsCard = ({ quote, editingPayment, onEditPayment }) => {
  const handlePrint = () => window.print();
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ payment_details is array
  const pd = Array.isArray(quote?.payment_details)
    ? quote.payment_details[0]
    : quote?.payment_details;

  console.log(pd, "action card", quote);

  const hasPaymentDetails = !!pd;
  const paymentStatus = pd?.status ?? null; // 0=awaiting, 1=confirmed
  const canEditPayment = !hasPaymentDetails || paymentStatus === 0;
  const showApprove =
    hasPaymentDetails && [1, 2].includes(Number(quote?.status));
  const showSendInvoice =
    hasPaymentDetails &&
    paymentStatus === 0 &&
    Number(pd?.pending_payment_amount) > 0;

  // ── existing payment modal state (keep as-is) ──
  const mainTotal = useMemo(() => {
    const totalFeetPrice = Number(quote?.total_feet_price || 0);
    const totalControllerPrice = Number(quote?.total_controller_price || 0);
    const discountPercentage = Number(quote?.discount_percentage || 0);
    const gstPercentage = Number(quote?.gst_percentage || 0);
    const subtotal = totalFeetPrice + totalControllerPrice;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const taxableBase = subtotal - discountAmount;
    const gstValue = (taxableBase * gstPercentage) / 100;
    return Number(quote?.main_total ?? taxableBase + gstValue) || 0;
  }, [
    quote?.total_feet_price,
    quote?.total_controller_price,
    quote?.discount_percentage,
    quote?.gst_percentage,
    quote?.main_total,
  ]);

  const [paymentType, setPaymentType] = useState(
    Number(pd?.part_payment_amount || 0) > 0 ? "deposit" : "full",
  );
  const [depositPercent, setDepositPercent] = useState(
    Number(pd?.payment_percentage || 25),
  );
  const computedDepositAmount = useMemo(
    () => ((mainTotal * (Number(depositPercent) || 0)) / 100).toFixed(2),
    [mainTotal, depositPercent],
  );
  const [depositAmount, setDepositAmount] = useState(computedDepositAmount);
  useEffect(() => {
    setDepositAmount(computedDepositAmount);
  }, [computedDepositAmount]);

  const initialMethods = useMemo(() => {
    const raw = pd?.select_payment_methods || "";
    const set = new Set(
      raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    );
    return {
      creditCard: set.has("credit card") || set.has("credit_card"),
      eTransfer:
        set.has("e-transfer") || set.has("etransfer") || set.has("e_transfer"),
      cash: set.has("cash"),
    };
  }, [pd?.select_payment_methods]);
  const [methods, setMethods] = useState(initialMethods);
  useEffect(() => {
    setMethods(initialMethods);
  }, [initialMethods]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleSendFinalInvoice = async () => {
    try {
      setIsSendingInvoice(true);
      const result = await sendFinalQuote({ quote_id: quote?.quote_id });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSendingInvoice(false);
    }
  };
  const handleResendQuote = async () => {
    try {
      setIsResending(true);
      const result = await resendQuote({ quote_id: quote?.quote_id });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsResending(false);
    }
  };

  const handleUpdateQuote = async () => {
    try {
      setIsUpdating(true);
      const result = await updateQuoteSend({ quote_id: quote?.quote_id });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <SectionHeader icon="ph:gear-six" title="Actions" />

      {/* ── Top action buttons ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <QuoteButton
            icon={BUTTON_ICONS.resend}
            variant="primary"
            onClick={handleResendQuote}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend Quote"}
          </QuoteButton>
          <QuoteButton
            icon={BUTTON_ICONS.update}
            variant="secondary"
            onClick={handleUpdateQuote}
            disabled={isUpdating}
          >
            {isUpdating ? "Sending..." : "Updated Quote"}
          </QuoteButton>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* ✅ Approve only if payment_details exists */}
          {showApprove && (
            <QuoteButton icon={BUTTON_ICONS.approve} variant="success">
              {[1, 2].includes(Number(quote?.status)) ? "Approve" : "Approved"}
            </QuoteButton>
          )}
          <QuoteButton
            icon={BUTTON_ICONS.print}
            variant="warning"
            onClick={handlePrint}
          >
            Print
          </QuoteButton>
        </div>
      </div>

      <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

      {/* ── Payment section ── */}
      {hasPaymentDetails ? (
        /* ✅ Show payment summary + edit button if payment already set */
        <div className="flex flex-wrap items-center gap-4">
          <PaymentInfo quote={quote} />
          {/* Edit button only if status == 0 */}
          {canEditPayment && (
            <button
              onClick={onEditPayment}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-sm flex-shrink-0 ${
                editingPayment
                  ? "bg-slate-500 hover:bg-slate-600"
                  : "bg-orange-400 hover:bg-orange-500"
              }`}
              title="Edit payment"
            >
              <Icon
                icon={editingPayment ? BUTTON_ICONS.close : BUTTON_ICONS.edit}
                className="text-base"
              />
            </button>
          )}
        </div>
      ) : (
        /* ✅ Show full payment setup form if no payment details yet */
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Select Payment Option
          </h4>
          <div className="flex items-center gap-4">
            <Radio
              name="payment-type"
              label="Full Payment"
              checked={paymentType === "full"}
              onChange={() => setPaymentType("full")}
            />
            <Radio
              name="payment-type"
              label="Deposit Payment"
              checked={paymentType === "deposit"}
              onChange={() => setPaymentType("deposit")}
            />
          </div>
          {paymentType === "deposit" && (
            <div className="space-y-3">
              <Textinput
                label="Deposit Payment Percentage:"
                type="text"
                placeholder="0"
                value={depositPercent}
                onChange={(e) =>
                  setDepositPercent(e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
              <Textinput
                label="Deposit Payment Amount:"
                type="text"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Payment Methods:
            </p>
            <Checkbox
              label="Credit Card"
              value={methods.creditCard}
              onChange={() =>
                setMethods((m) => ({ ...m, creditCard: !m.creditCard }))
              }
              activeClass="bg-orange-500 border-orange-500"
            />
            <Checkbox
              label="E-Transfer"
              value={methods.eTransfer}
              onChange={() =>
                setMethods((m) => ({ ...m, eTransfer: !m.eTransfer }))
              }
              activeClass="bg-orange-500 border-orange-500"
            />
            <Checkbox
              label="Cash"
              value={methods.cash}
              onChange={() => setMethods((m) => ({ ...m, cash: !m.cash }))}
              activeClass="bg-orange-500 border-orange-500"
            />
          </div>
          <Button
            text="Payment"
            className="bg-teal-500 hover:bg-teal-600 text-white"
            type="button"
          />
        </div>
      )}

      {/* ✅ Edit Payment Modal — only when editingPayment is true */}
      <Modal
        title="Edit Payment Option"
        activeModal={editingPayment}
        onClose={onEditPayment}
        className="max-w-md"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Radio
              name="payment-type-modal"
              label="Full Payment"
              checked={paymentType === "full"}
              onChange={() => setPaymentType("full")}
            />
            <Radio
              name="payment-type-modal"
              label="Deposit Payment"
              checked={paymentType === "deposit"}
              onChange={() => setPaymentType("deposit")}
            />
          </div>
          {paymentType === "deposit" && (
            <div className="space-y-4">
              <Textinput
                label="Deposit Payment Percentage:"
                type="text"
                placeholder="0"
                value={depositPercent}
                onChange={(e) =>
                  setDepositPercent(e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
              <Textinput
                label="Deposit Payment Amount:"
                type="text"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""))
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Payment Methods:
            </p>
            <Checkbox
              label="Credit Card"
              value={methods.creditCard}
              onChange={() =>
                setMethods((m) => ({ ...m, creditCard: !m.creditCard }))
              }
              activeClass="bg-orange-500 border-orange-500"
            />
            <Checkbox
              label="E-Transfer"
              value={methods.eTransfer}
              onChange={() =>
                setMethods((m) => ({ ...m, eTransfer: !m.eTransfer }))
              }
              activeClass="bg-orange-500 border-orange-500"
            />
            <Checkbox
              label="Cash"
              value={methods.cash}
              onChange={() => setMethods((m) => ({ ...m, cash: !m.cash }))}
              activeClass="bg-orange-500 border-orange-500"
            />
          </div>
          <div className="flex gap-3">
            <Button
              text="Payment"
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={onEditPayment}
              type="button"
            />
            <Button
              text="Close"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={onEditPayment}
              type="button"
            />
          </div>
        </div>
      </Modal>

      {/* ✅ Payment Receive Card — PHP: show when payment_details exists & status == 0 */}
      {hasPaymentDetails && paymentStatus === 0 && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(quote.payment_details)
              ? quote.payment_details
              : [quote.payment_details]
            ).map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2"
              >
                <p className="text-sm font-semibold text-green-600">
                  Payment Details
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Payment Amount:{" "}
                  <span className="font-bold">${row.part_payment_amount}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  Payment Method:{" "}
                  <span className="font-bold capitalize">
                    {row.payment_method}
                  </span>
                  {/* ✅ Show etransfer image view button */}
                  {row.payment_method === "etransfer" &&
                    row.etransfer_image && (
                      <button
                        type="button"
                        className="w-7 h-7 rounded bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                        title="View transfer image"
                        onClick={() => {
                          setPreviewSrc(getImgSrc(row.etransfer_image));
                          setPreviewOpen(true);
                        }}
                      >
                        <Icon icon="ph:eye" className="text-sm" />
                      </button>
                    )}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Payment Date:{" "}
                  <span className="font-bold">
                    {row.created_at?.split("T")[0]}
                  </span>
                </p>
                {/* ✅ Payment Receive button — disabled + green if already received */}
                <button
                  type="button"
                  disabled={row.status === 1}
                  className={`mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${
                    row.status === 1
                      ? "bg-green-500 opacity-60 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {row.status === 1 ? "Payment Received" : "Payment Receive"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

      {/* ✅ Send Final Invoice — only if payment_details exists, status==0, pending > 0 */}
      {showSendInvoice && (
        <QuoteButton
          icon={BUTTON_ICONS.invoice}
          variant="gradient"
          size="lg"
          className="shadow-base hover:shadow-card hover:-translate-y-0.5 active:translate-y-0"
          onClick={handleSendFinalInvoice}
          disabled={isSendingInvoice}
        >
          {isSendingInvoice ? "Sending..." : "Send Final Invoice"}
        </QuoteButton>
      )}

      {/* ✅ etransfer image preview modal */}
      <Modal
        title="Payment Image"
        activeModal={previewOpen}
        onClose={() => setPreviewOpen(false)}
        className="max-w-3xl"
      >
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Payment proof"
            className="w-full h-auto rounded-lg"
          />
        )}
      </Modal>
    </Card>
  );
};

export default ActionsCard;
