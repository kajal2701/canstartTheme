import React from "react";

const PaymentInfo = ({ quote }) => {
  // ✅ payment_details is an array — always use [0]
  const pd = quote?.payment_details ?? null;

  if (!pd) return null; // ✅ hide entirely if no payment set yet

  const isFullPayment = pd.payment_type === 1;

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Payment Option
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white">
          {isFullPayment ? "Full Payment" : "Deposit Payment"}
        </p>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Amount Due
        </p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          ${pd.part_payment_amount}
        </p>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
          Payment Methods
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">
          {pd.select_payment_methods}
        </p>
      </div>
    </div>
  );
};

export default PaymentInfo;
