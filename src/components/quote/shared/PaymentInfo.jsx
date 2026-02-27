import React from "react";

const PaymentInfo = ({ quote }) => {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Payment Option
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white">
          Deposit Payment
        </p>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Amount Due
        </p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          ${quote.payment_details.part_payment_amount}
        </p>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Payment Methods
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">
          {quote.payment_details.select_payment_methods}
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;
