import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { SectionHeader } from "../../../utils/helperFunctions";
import QuoteButton from "./QuoteButton";
import PaymentInfo from "./PaymentInfo";
import { BUTTON_ICONS } from "./constants";

const ActionsCard = ({ quote, editingPayment, onEditPayment }) => {
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
          <QuoteButton icon={BUTTON_ICONS.print} variant="warning">
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
