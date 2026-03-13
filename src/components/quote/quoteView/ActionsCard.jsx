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
  sendForApprove, // status = 3
  setPaymentOption,
  updateQuoteSend,
  paymentReceive, // confirm deposit
  scheduleInstallation, // schedule installation
} from "../../../services/quoteService";

const ActionsCard = ({ quote, onSubmitSuccess }) => {
  const handlePrint = () => window.print();

  // ── Loading states ──
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSettingPayment, setIsSettingPayment] = useState(false);
  const [isApprovingSend, setIsApprovingSend] = useState(false);
  const [isReceivingPayment, setIsReceivingPayment] = useState(null); // stores idx
  const [isScheduling, setIsScheduling] = useState(false);

  // ── UI states ──
  const [paymentErrors, setPaymentErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [editingPayment, setEditingPayment] = useState(false);
  const [installationDate, setInstallationDate] = useState(
    quote?.installation_date || "",
  );

  // ── Derived: payment_details ──
  const pd = Array.isArray(quote?.payment_details)
    ? quote.payment_details[0]
    : quote?.payment_details;

  const hasPaymentDetails = !!pd;
  const paymentStatus = pd?.status ?? null; // 0=awaiting, 1=confirmed
  const quoteStatus = Number(quote?.status);
  // online_payment_details joined rows
  const onlinePayments = Array.isArray(quote?.payment_details)
    ? quote.payment_details.filter((r) => r.payment_method)
    : pd?.payment_method
      ? [pd]
      : [];

  const hasOnlinePayment = onlinePayments.length > 0;
  const depositConfirmed = onlinePayments.some(
    (r) => Number(r.payment_status ?? r.status) === 1,
  );

  // ── Visibility flags (based on flow) ──
  const canEditPayment =
    hasPaymentDetails && paymentStatus === 0 && quoteStatus !== 3;

  // Stage 1: no payment yet
  const showPaymentForm = !hasPaymentDetails;

  // Stage 2: payment set, awaiting approval (status 1 or 2)
  const showApprove =
    (hasPaymentDetails && [1, 2].includes(quoteStatus)) || quoteStatus === 3;
  // Stage 3 & 4: approved, show payment receive cards if online payment exists
  const showPaymentReceiveCards = quoteStatus === 3 && hasOnlinePayment;


  // Stage 5: deposit confirmed, no installation date yet → show schedule
  const showScheduleInstallation =
    quoteStatus === 3 && depositConfirmed && !quote?.installation_date;

  // Stage 6: installation done, no invoice sent → show send final invoice
  const showSendInvoice =
    quoteStatus === 3 &&
    quote?.installation_date &&
    !quote?.invoice_date &&
    Number(pd?.pending_payment_amount) > 0;

  // Stage 7: invoice sent, awaiting full payment
  const showAwaitingFullPayment =
    quoteStatus === 3 &&
    quote?.invoice_date &&
    paymentStatus === 0 &&
    Number(pd?.pending_payment_amount) > 0;

  // Stage 8: fully paid
  const showFullyPaid =
    paymentStatus === 1 && Number(pd?.pending_payment_amount) === 0;

  // ── mainTotal ──
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

  // ── Payment form state ──
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
      creditCard: set.has("credit_card"),
      eTransfer: set.has("etransfer"),
      cash: set.has("cash"),
    };
  }, [pd?.select_payment_methods]);

  const [methods, setMethods] = useState(initialMethods);
  useEffect(() => {
    setMethods(initialMethods);
  }, [initialMethods]);

  const handleEditPayment = () => setEditingPayment((prev) => !prev);

  // ── Validation ──
  const validatePayment = () => {
    const errs = {};
    if (paymentType === "deposit") {
      if (!depositPercent || Number(depositPercent) <= 0)
        errs.depositPercent = "Deposit percentage is required.";
      if (!depositAmount || Number(depositAmount) <= 0)
        errs.depositAmount = "Deposit amount is required.";
    }
    if (!methods.creditCard && !methods.eTransfer && !methods.cash)
      errs.methods = "Please select at least one payment method.";
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handlers ──
  const handlePaymentSubmit = async () => {
    if (!validatePayment()) return;
    const selectedMethods = [
      methods.creditCard && "credit_card",
      methods.eTransfer && "etransfer",
      methods.cash && "cash",
    ]
      .filter(Boolean)
      .join(",");

    const isFullPayment = paymentType === "full";
    const pendingPaymentAmount = isFullPayment
      ? 0
      : (Number(mainTotal) - Number(depositAmount)).toFixed(2);

    const payload = {
      quote_id: quote?.quote_id,
      payment_type: isFullPayment ? 1 : 2,
      payment_percentage: isFullPayment ? "100" : String(depositPercent),
      amount: isFullPayment ? String(mainTotal) : String(depositAmount),
      pendingPaymentAmount: String(pendingPaymentAmount),
      payment_methods: selectedMethods,
    };

    try {
      setIsSettingPayment(true);
      const result = await setPaymentOption(payload);
      toast.success(result.message);
      if (hasPaymentDetails) handleEditPayment();
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSettingPayment(false);
    }
  };

  // Approve → status = 3
  const handleApprove = async () => {
    try {
      setIsApprovingSend(true);
      const result = await sendForApprove({ quote_id: quote?.quote_id });
      toast.success(result.message);
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsApprovingSend(false);
    }
  };

  // Payment Receive → confirm deposit
  const handlePaymentReceive = async (row, idx) => {
    try {
      setIsReceivingPayment(idx);
      const result = await paymentReceive({
        quote_id: quote?.quote_id,
        online_payment_id: row.payment_id,
        maintotal: mainTotal,
        amount: row.part_payment_amount,
      });
      toast.success(result.message);
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsReceivingPayment(null);
    }
  };

  // Schedule Installation
  const handleScheduleInstallation = async () => {
    if (!installationDate) {
      toast.error("Please select an installation date.");
      return;
    }
    try {
      setIsScheduling(true);
      const result = await scheduleInstallation({
        quote_id: quote?.quote_id,
        installation_date: installationDate,
      });
      toast.success(result.message);
      onSubmitSuccess?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSendFinalInvoice = async () => {
    try {
      setIsSendingInvoice(true);
      const result = await sendFinalQuote({ quote_id: quote?.quote_id });
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
      onSubmitSuccess?.();
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
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
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
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Payment Form JSX ──
  const PaymentForm = (
    <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {hasPaymentDetails ? "Edit Payment Option" : "Select Payment Option"}
      </h4>
      <div className="flex items-center gap-4">
        <Radio
          name="payment-type"
          label="Full Payment"
          checked={paymentType === "full"}
          onChange={() => {
            setPaymentType("full");
            setPaymentErrors({});
          }}
        />
        <Radio
          name="payment-type"
          label="Deposit Payment"
          checked={paymentType === "deposit"}
          onChange={() => {
            setPaymentType("deposit");
            setPaymentErrors({});
          }}
        />
      </div>
      {paymentType === "deposit" && (
        <div className="space-y-3">
          <div>
            <Textinput
              label="Deposit Payment Percentage:"
              type="text"
              placeholder="0"
              value={depositPercent}
              onChange={(e) => {
                setDepositPercent(e.target.value.replace(/[^0-9.]/g, ""));
                setPaymentErrors((prev) => ({ ...prev, depositPercent: "" }));
              }}
            />
            {paymentErrors.depositPercent && (
              <p className="text-red-500 text-xs mt-1">
                {paymentErrors.depositPercent}
              </p>
            )}
          </div>
          <div>
            <Textinput
              label="Deposit Payment Amount:"
              type="text"
              placeholder="0.00"
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value.replace(/[^0-9.]/g, ""));
                setPaymentErrors((prev) => ({ ...prev, depositAmount: "" }));
              }}
            />
            {paymentErrors.depositAmount && (
              <p className="text-red-500 text-xs mt-1">
                {paymentErrors.depositAmount}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
          Payment Methods:
        </p>
        <Checkbox
          label="Credit Card"
          value={methods.creditCard}
          onChange={() => {
            setMethods((m) => ({ ...m, creditCard: !m.creditCard }));
            setPaymentErrors((prev) => ({ ...prev, methods: "" }));
          }}
          activeClass="bg-orange-500 border-orange-500"
        />
        <Checkbox
          label="E-Transfer"
          value={methods.eTransfer}
          onChange={() => {
            setMethods((m) => ({ ...m, eTransfer: !m.eTransfer }));
            setPaymentErrors((prev) => ({ ...prev, methods: "" }));
          }}
          activeClass="bg-orange-500 border-orange-500"
        />
        <Checkbox
          label="Cash"
          value={methods.cash}
          onChange={() => {
            setMethods((m) => ({ ...m, cash: !m.cash }));
            setPaymentErrors((prev) => ({ ...prev, methods: "" }));
          }}
          activeClass="bg-orange-500 border-orange-500"
        />
        {paymentErrors.methods && (
          <p className="text-red-500 text-xs mt-1">{paymentErrors.methods}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          text={isSettingPayment ? "Saving..." : "Payment"}
          className="bg-teal-500 hover:bg-teal-600 text-white"
          type="button"
          disabled={isSettingPayment}
          onClick={handlePaymentSubmit}
        />
        {hasPaymentDetails && editingPayment && (
          <Button
            text="Cancel"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleEditPayment}
            type="button"
          />
        )}
      </div>
    </div>
  );

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
          {/* Stage 2 — Approve button */}
          {showApprove && (
            <QuoteButton
              icon={BUTTON_ICONS.approve}
              variant="success"
              onClick={handleApprove}
              disabled={isApprovingSend || quoteStatus === 3}
            >
              {isApprovingSend
                ? "Approving..."
                : quoteStatus === 3
                  ? "Approved"
                  : "Approve"}
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

      {/* ── Payment section ──
           Case 1: No payment → show form
           Case 2: Payment exists, not editing → show PaymentInfo + edit button
           Case 3: Editing → show form with Cancel
      */}
      {showPaymentForm ? (
        PaymentForm
      ) : !editingPayment ? (
        <div className="flex flex-wrap items-center gap-4">
          <PaymentInfo quote={quote} />
          {canEditPayment && (
            <button
              onClick={handleEditPayment}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-sm flex-shrink-0 bg-orange-400 hover:bg-orange-500"
              title="Edit payment"
            >
              <Icon icon={BUTTON_ICONS.edit} className="text-base" />
            </button>
          )}
        </div>
      ) : (
        PaymentForm
      )}

      {/* ── Stage 3 & 4: Payment Receive Cards ── */}
      {showPaymentReceiveCards && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlinePayments.map((row, idx) => {
              const isConfirmed =
                Number(row.payment_status ?? row.status) === 1;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2"
                >
                  <p className="text-sm font-semibold text-green-600">
                    Payment Details
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Payment Amount:{" "}
                    <span className="font-bold">
                      ${row.amount ?? row.part_payment_amount}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    Payment Method:{" "}
                    <span className="font-bold capitalize">
                      {row.payment_method}
                    </span>
                    {row.payment_method === "etransfer" &&
                      row.etransfer_image && (
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
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
                  <button
                    type="button"
                    disabled={isConfirmed || isReceivingPayment === idx}
                    onClick={() =>
                      !isConfirmed && handlePaymentReceive(row, idx)
                    }
                    className={`mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${
                      isConfirmed
                        ? "bg-green-500 opacity-60 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isConfirmed
                      ? "Payment Received"
                      : isReceivingPayment === idx
                        ? "Processing..."
                        : "Payment Receive"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Stage 5: Schedule Installation ── */}
      {showScheduleInstallation && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Schedule Installation
            </h4>
            <Textinput
              type="date"
              label="Installation Date:"
              value={installationDate}
              onChange={(e) => setInstallationDate(e.target.value)}
            />
            <Button
              text={isScheduling ? "Scheduling..." : "Schedule Installation"}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              type="button"
              disabled={isScheduling}
              onClick={handleScheduleInstallation}
            />
          </div>
        </>
      )}

      {/* ── Stage 6: Send Final Invoice ── */}
      {showSendInvoice && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
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
        </>
      )}

      {/* ── Stage 7: Awaiting Full Payment ── */}
      {showAwaitingFullPayment && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
          <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              Invoice Sent — Awaiting Full Payment
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
              Pending Amount:{" "}
              <span className="font-bold">${pd?.pending_payment_amount}</span>
            </p>
          </div>
        </>
      )}

      {/* ── Stage 8: Fully Paid ── */}
      {showFullyPaid && (
        <>
          <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
              <Icon icon="ph:check-circle" className="text-lg" /> Fully Paid ✅
            </p>
          </div>
        </>
      )}

      {/* ── E-transfer image preview modal ── */}
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
