import React from "react";
import Icon from "@/components/ui/Icon";
import { COMPANY_INFO } from "./constants";

const CompanyInfo = ({ quote }) => {
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-8">
        {/* From */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            From
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {COMPANY_INFO.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {COMPANY_INFO.address}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {COMPANY_INFO.city}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {COMPANY_INFO.state} {COMPANY_INFO.postalCode}
          </p>
        </div>

        {/* Logo — center */}
        <div className="flex flex-col items-center justify-center gap-3 order-first md:order-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-red-200 dark:bg-red-900/40 blur-2xl opacity-50 scale-110" />
            <img
              src={COMPANY_INFO.logoPath}
              alt="Canstar Logo"
              className="relative w-[13rem] h-[13rem] object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* To */}
        <div className="space-y-1 md:text-right">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
            To
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {quote.fname} {quote.lname}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {quote.address}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {quote.city}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {quote.state} - {quote.post_code}
          </p>
          <div className="pt-2 space-y-1">
            <div className="flex items-center gap-2 md:justify-end">
              <Icon icon="ph:envelope" className="text-blue-400 text-sm" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Email ID : {quote.email}
              </span>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <Icon icon="ph:phone" className="text-blue-400 text-sm" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Phone No : {quote.phone}
              </span>
            </div>
            <div className="flex items-center gap-2 md:justify-end pt-1">
              <Icon
                icon="ph:calendar-blank"
                className="text-slate-400 text-sm"
              />
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Quote Date : {quote.created_at}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
