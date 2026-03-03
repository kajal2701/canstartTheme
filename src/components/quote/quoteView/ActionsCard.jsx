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

const ActionsCard = ({ quote, editingPayment, onEditPayment }) => {
  const handlePrint = () => {
    window.print();
  };
  const mainTotal = useMemo(() => {
    const totalFeetPrice = Number(quote?.total_feet_price || 0);
    const totalControllerPrice = Number(quote?.total_controller_price || 0);
    const discountPercentage = Number(quote?.discount_percentage || 0);
    const gstPercentage = Number(quote?.gst_percentage || 0);
    const subtotal = totalFeetPrice + totalControllerPrice;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const taxableBase = subtotal - discountAmount;
    const gstValue = (taxableBase * gstPercentage) / 100;
    const mainTotalValue = quote?.main_total ?? taxableBase + gstValue;
    return Number(mainTotalValue) || 0;
  }, [
    quote?.total_feet_price,
    quote?.total_controller_price,
    quote?.discount_percentage,
    quote?.gst_percentage,
    quote?.main_total,
  ]);

  const defaultPaymentType =
    Number(quote?.payment_details?.part_payment_amount || 0) > 0
      ? "deposit"
      : "full";
  const [paymentType, setPaymentType] = useState(defaultPaymentType);
  useEffect(() => {
    setPaymentType(
      Number(quote?.payment_details?.part_payment_amount || 0) > 0
        ? "deposit"
        : "full",
    );
  }, [quote?.payment_details?.part_payment_amount]);

  const [depositPercent, setDepositPercent] = useState(
    Number(quote?.payment_details?.part_payment_percentage || 25),
  );
  useEffect(() => {
    setDepositPercent(
      Number(quote?.payment_details?.part_payment_percentage || 25),
    );
  }, [quote?.payment_details?.part_payment_percentage]);

  const computedDepositAmount = useMemo(() => {
    const pct = Number(depositPercent) || 0;
    return ((mainTotal * pct) / 100).toFixed(2);
  }, [mainTotal, depositPercent]);
  const [depositAmount, setDepositAmount] = useState(computedDepositAmount);
  useEffect(() => {
    setDepositAmount(computedDepositAmount);
  }, [computedDepositAmount]);

  const initialMethods = useMemo(() => {
    const raw = quote?.payment_details?.select_payment_methods || "";
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
  }, [quote?.payment_details?.select_payment_methods]);
  const [methods, setMethods] = useState(initialMethods);
  useEffect(() => {
    setMethods(initialMethods);
  }, [initialMethods]);

  return (
    <Card>
      <SectionHeader icon="ph:gear-six" title="Actions" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <QuoteButton icon={BUTTON_ICONS.resend} variant="primary">
            Resend Quote
          </QuoteButton>
          <QuoteButton icon={BUTTON_ICONS.update} variant="secondary">
            Updated Quote
          </QuoteButton>
        </div>
        <div className="flex flex-wrap gap-3">
          <QuoteButton icon={BUTTON_ICONS.approve} variant="success">
            Approved
          </QuoteButton>
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

      <div className="flex flex-wrap items-center gap-4">
        <PaymentInfo quote={quote} />
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
      </div>

      <Modal
        title="Edit Payment Option"
        activeModal={editingPayment}
        onClose={onEditPayment}
        className="max-w-md"
      >
        <div className="space-y-5">
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
            <p className="text-gray-900 dark:text-gray-300 text-sm font-medium">
              Payment Methods:
            </p>
            <div className="space-y-2">
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

      <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

      <QuoteButton
        icon={BUTTON_ICONS.invoice}
        variant="gradient"
        size="lg"
        className="shadow-base hover:shadow-card hover:-translate-y-0.5 active:translate-y-0"
      >
        Send Final Invoice
      </QuoteButton>
    </Card>
  );
};

export default ActionsCard;
