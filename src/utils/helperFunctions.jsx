import React from "react";
import Icon from "@/components/ui/Icon";
import { REVIEW_DATA } from "./constants";

export const RichDescription = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="font-semibold text-slate-900 dark:text-white bg-yellow-200 dark:bg-yellow-500/20 px-1 rounded"
          >
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${map[status] || map.draft}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
      <Icon
        icon={icon}
        className="text-blue-600 dark:text-blue-400 text-base"
      />
    </div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

export const renderCompanyAddress = (title = "Invoice From") => (
  <div className="space-y-1 flex-1">
    <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
      {title}
    </h3>
    <p className="font-bold text-gray-900 text-base md:text-lg">
      CANSTAR LIGHT LTD
    </p>
    <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed">
      3227 18 St NW, Edmonton, AB T6T 0H2
    </p>
    <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
      info@canstarlight.ca
    </p>
    <p className="text-gray-600 text-sm md:text-base">(780) 716-4210</p>
    <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
      GST/HST: 742932601 RT001
    </p>
  </div>
);

export const renderReviews = (reviewIdx, setReviewIdx) => (
  <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
    <div className="border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 relative bg-white shadow-sm">
      <div className="absolute -top-3 md:-top-3.5 left-4 md:left-6 bg-white px-2 md:px-3">
        <span className="text-[#ee5d59] font-bold text-xs md:text-base tracking-wide">
          Customer Reviews
        </span>
      </div>
      <div className="relative">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg md:text-xl">
              ★
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm md:text-base italic leading-relaxed mb-4 min-h-[80px]">
          "{REVIEW_DATA[reviewIdx]?.review_text}"
        </p>
        <span className="text-gray-900 font-medium text-xs md:text-base">
          {REVIEW_DATA[reviewIdx]?.reviewer_name}
        </span>
        <div className="flex justify-center gap-2 mt-4">
          {REVIEW_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === reviewIdx
                  ? "bg-[#ee5d59] w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const renderTermsAndPayment = (
  termsChecked,
  isTermsDisabled,
  onTermsChange,
) => (
  <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-12 flex flex-col lg:flex-row gap-6 md:gap-10">
    <div className="w-full lg:w-[70%]">
      <h3 className="text-[#ee5d59] font-semibold mb-2 md:mb-3 text-lg md:text-xl">
        Terms & Conditions
      </h3>
      <p className="text-gray-600 text-xs md:text-base leading-relaxed mb-3 md:mb-4">
        Our estimate includes the supply and installation of the
        color-matched/best-match track along with the master control system. To
        secure your booking, a deposit of 25% of the quoted amount or the full
        amount is required. This deposit will prioritize your project in our
        completion queue. Payments can be made via e-transfer to
        info@canstarlight.ca, by check payable to CANSTAR LIGHT LTD, or in cash.
        (Please note that if paying by credit card, an additional 3% will be
        charged per transaction for processing fees.) The product comes with a
        5-year warranty, and labor is covered for 4 years from the date of
        installation.{" "}
        <a
          href="/quote/termsconditions"
          target="_blank"
          className="text-[#ee5d59] font-semibold"
        >
          Read more..
        </a>
      </p>{" "}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={termsChecked}
          disabled={isTermsDisabled}
          onChange={onTermsChange}
          className="w-4 h-4 accent-[#ee5d59]"
        />
        <label
          htmlFor="terms"
          className="text-xs md:text-base font-medium text-gray-700"
        >
          I agree to the Terms & Conditions
        </label>
      </div>
    </div>
    <div className="bg-gray-50 p-4 md:p-5 rounded-lg md:rounded-xl w-full lg:w-[30%]">
      <h3 className="text-[#ee5d59] font-semibold mb-2 md:mb-3 text-lg md:text-xl">
        Payment Method
      </h3>
      <div className="space-y-2 text-xs md:text-base text-gray-700">
        <p>
          <span className="font-medium">Interact transfer:</span>{" "}
          info@canstarlight.ca
        </p>
        <p>
          <span className="font-medium">Cheque Payable:</span> Canstar Light LTD
        </p>
      </div>
    </div>
  </div>
);

export const renderContactFooter = () => (
  <div className="mt-10 md:mt-14 bg-[#f8f9fa] py-4 md:py-6 px-4 md:px-10 lg:px-14 flex flex-col md:flex-row justify-start items-start md:items-center gap-3 md:gap-4 text-xs md:text-base relative border-t border-gray-100">
    <div className="flex items-center gap-2 text-gray-600 z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ee5d59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z" />
      </svg>
      <span className="text-xs md:text-base">(780) 716-4210</span>
    </div>
    <div className="flex items-center gap-2 text-gray-600 z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ee5d59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
      <span className="text-xs md:text-base">info@canstarlight.ca</span>
    </div>
    <div className="flex items-center gap-2 text-gray-600 z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ee5d59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span className="truncate text-xs md:text-base">
        3227 18 St NW, Edmonton, AB T6T 0H2
      </span>
    </div>
    <div className="hidden md:block absolute bottom-0 right-0 bg-[#ee5d59] w-40 md:w-80 h-6 md:h-8 rounded-tl-[60px] opacity-90"></div>
  </div>
);

export const renderCustomerAddress = (quote, title = "Invoice To") => (
  <div className="space-y-1 flex-1 md:text-right">
    <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
      {title}
    </h3>
    <p className="font-bold text-gray-900 text-base md:text-lg">
      {quote.fname} {quote.lname}
    </p>
    <p className="text-gray-600 text-sm md:text-base">{quote.email}</p>
    <p className="text-gray-600 text-sm md:text-base">{quote.phone}</p>
    <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed mt-1 md:mt-2 md:ml-auto">
      {quote.address}, {quote.city}, {quote.state} - {quote.post_code}
    </p>
  </div>
);

// src/utils/quoteHelpers.js

export const buildQuoteItems = (quote, options = {}) => {
  const { descriptionStyle = "php" } = options;

  let items = [];
  let counter = 0;

  const getDescription = (color, name) => {
    if (descriptionStyle === "php") {
      return `Canstar puck lights with customised data line system, <b>${color}</b> aluminium channel track package for the <b>${name}</b> of the house`;
    }
    return `Canstar Puck Lights with a customized data line system, paired with a <b>${color}</b> aluminum track package, designed for the <b>${name}</b> of the house/property.`;
  };
  console.log("uote.annotation_image :>> ", quote.annotation_image);
  // Annotation images
  if (quote.annotation_image && Array.isArray(quote.annotation_image)) {
    quote.annotation_image.forEach((item) => {
      items.push({
        no: ++counter,
        description: getDescription(item.color, item.identify_image_name),
        total: parseFloat(item.total_amount),
        images: (item.images || []).filter((img) => img.type === "drawnLines"),
        required: item.required ?? null,
      });
    });
  }

  // Products
  if (quote.products && Array.isArray(quote.products)) {
    quote.products.forEach((item) => {
      items.push({
        no: ++counter,
        description: item.product_description || item.product,
        total: parseFloat(item.amount),
        images: [],
        required: item.required ?? null,
      });
    });
  }

  // Custom products
  if (quote.custom_product_data && Array.isArray(quote.custom_product_data)) {
    quote.custom_product_data.forEach((item) => {
      items.push({
        no: ++counter,
        description: item.product,
        total: parseFloat(item.amount),
        images: [],
        required: item.required ?? null,
      });
    });
  }

  // Extra work
  if (quote.extra_work_data && Array.isArray(quote.extra_work_data)) {
    quote.extra_work_data.forEach((item) => {
      items.push({
        no: ++counter,
        description: item.product,
        total: parseFloat(item.amount),
        images: [],
        required: null,
      });
    });
  }

  return items;
};
