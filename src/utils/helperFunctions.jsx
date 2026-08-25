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
    {/* Google Verified Review Badge */}
    <div className="flex justify-center mb-6">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "#1a1a1a",
          borderRadius: "50px",
          padding: "10px 24px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        {/* Google G Logo */}
        <svg width="30" height="30" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#ffffff", letterSpacing: "0.3px" }}>
            Google Verified Review
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "1px" }}>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#FBBC04" }}>5.0</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#FBBC04", fontSize: "15px" }}>★</span>
              ))}
            </div>
          </div>
        </div>
        {/* Verified Shield Icon */}
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <defs>
            <radialGradient id="shieldGlowVerified" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4444" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#ff4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="shieldGradVerified" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="100%" stopColor="#d32f2f" />
            </linearGradient>
          </defs>
          {/* Outer glow circle */}
          <circle cx="12" cy="12" r="12" fill="url(#shieldGlowVerified)" />
          {/* Red filled circle background */}
          <circle cx="12" cy="12" r="11" fill="url(#shieldGradVerified)" />
          {/* Shield path */}
          <path
            d="M12 4.5C12 4.5 7 6 5.5 6.5C5.5 6.5 5 12.5 7 15.5C9 18.5 12 20 12 20C12 20 15 18.5 17 15.5C19 12.5 18.5 6.5 18.5 6.5C17 6 12 4.5 12 4.5Z"
            fill="rgba(255,255,255,0.2)"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Checkmark inside shield */}
          <path d="M9 12.5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>

    {/* Review Card */}
    <div className="border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 relative bg-white shadow-sm">
      <div className="absolute -top-3 md:-top-3.5 left-4 md:left-6 bg-white px-2 md:px-3">
        <span className="text-[#ee5d59] font-bold text-xs md:text-base tracking-wide">
          Customer Reviews
        </span>
      </div>
      <div className="relative">
        {/* Stars row with Google icon and verified badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg md:text-xl">
                ★
              </span>
            ))}
          </div>
          {/* Small verified checkmark */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="11" fill="#227cc5ff" />
            <path d="M7.5 12.5l3 3 6-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
              className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx
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
  warrantyVersion = "old",
) => (
  <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-12 flex flex-col lg:flex-row gap-6 md:gap-10">
    <div className="w-full lg:w-[70%]">
      <h3 className="text-[#ee5d59] font-semibold mb-2 md:mb-3 text-lg md:text-xl">
        Terms & Conditions
      </h3>
      <p className="text-gray-600 text-xs md:text-base leading-relaxed mb-3 md:mb-4">
        {warrantyVersion === "new" ? (
          <>
            Our estimate includes the supply and professional installation of the color-matched or best-match track, along with the complete master control system. To secure your booking, a deposit of 25% of the quoted amount or the full amount is required. This deposit will reserve your project and prioritize it in our installation queue. Payments can be made via e-transfer to info@canstarlight.ca, by cheque payable to CANSTAR LIGHT LTD, or in cash. Please note that credit card payments may be subject to an additional 2.9% processing fee per transaction. This quotation is valid for 10 days from the date of issue. After this period, pricing and availability may be subject to change.
          </>
        ) : (
          <>
            Our estimate includes the supply and installation of the
            color-matched/best-match track along with the master control system. To
            secure your booking, a deposit of 25% of the quoted amount or the full
            amount is required. This deposit will prioritize your project in our
            completion queue. Payments can be made via e-transfer to
            info@canstarlight.ca, by check payable to CANSTAR LIGHT LTD, or in cash.
            (Please note that if paying by credit card, an additional 3% will be
            charged per transaction for processing fees.) The product comes with a
            5-year warranty, and labor is covered for 4 years from the date of
            installation.
          </>
        )}
        <a
          href={`/quote/termsconditions?v=${warrantyVersion}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600  hover:text-blue-800 ml-1"
        >
          Read More...
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

    <p className="font-bold text-red-700 text-base md:text-lg">
      {quote.customer_company_name}
    </p>
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

// Normalize old ("Mandatory"/"optional") and new ("yes"/"no") required formats
export const normalizeRequired = (val) => {
  if (!val) return null;
  const lower = String(val).toLowerCase();
  if (lower === "yes" || lower === "mandatory") return "yes";
  if (lower === "no" || lower === "optional") return "no";
  return null;
};

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
  // Annotation images
  if (quote.annotation_image && Array.isArray(quote.annotation_image)) {
    quote.annotation_image.forEach((item, idx) => {
      items.push({
        no: ++counter,
        description: getDescription(item.color, item.identify_image_name),
        total: parseFloat(item.total_amount),
        images: (item.images || []).filter((img) => img.type === "drawnLines"),
        required: normalizeRequired(item.required),
        annotation_image_id: item.annotation_image_id,
        source: "annotation",
        sourceIndex: idx,
      });
    });
  }

  // Products
  if (quote.products && Array.isArray(quote.products)) {
    quote.products.forEach((item, idx) => {
      items.push({
        no: ++counter,
        description: item.product_description || item.product,
        total: parseFloat(item.amount),
        images: [],
        required: normalizeRequired(item.required),
        source: "product",
        sourceIndex: idx,
      });
    });
  }

  // Custom products
  if (quote.custom_product_data && Array.isArray(quote.custom_product_data)) {
    quote.custom_product_data.forEach((item, idx) => {
      items.push({
        no: ++counter,
        description: item.product,
        total: parseFloat(item.amount),
        images: [],
        required: normalizeRequired(item.required),
        source: "custom_product",
        sourceIndex: idx,
      });
    });
  }

  // Extra work
  if (quote.extra_work_data && Array.isArray(quote.extra_work_data)) {
    quote.extra_work_data.forEach((item, idx) => {
      items.push({
        no: ++counter,
        description: item.description,
        total: parseFloat(item.total),
        images: [],
        required: null,
        source: "extra_work",
        sourceIndex: idx,
      });
    });
  }

  return items;
};

// ── Auto Calculate Quantities ────────────────────────────────────
export const calculateAutoQuantities = (linearFeet) => {
  const lf = Number(linearFeet) || 0;
  return {
    numberOfLights: Math.ceil(lf * 1.5),
    numberOfTracks: Math.ceil(lf * 1),
    numberOfScrews: Math.ceil(lf * 1),
  };
};

export const blockInvalidNumberKeys = (e) => {
  if (["ArrowUp", "ArrowDown", "e", "E", "-", "+", "."].includes(e.key)) {
    e.preventDefault();
  }
};

// ── Parse products from quote JSON ────────────────────────────────
export const parseQuoteProducts = (job) => {
  let products = [];
  try {
    const pd = typeof job?.product_data === "string"
      ? JSON.parse(job.product_data || "[]")
      : (job?.product_data || []);
    if (Array.isArray(pd)) {
      pd.forEach((p) => {
        if (Number(p.qty) > 0) {
          products.push({ product: p.product || "", qty: p.qty || "0", picked: false });
        }
      });
    }
  } catch (e) { /* ignore parse errors */ }
  try {
    const cpd = typeof job?.custom_product_data === "string"
      ? JSON.parse(job.custom_product_data || "[]")
      : (job?.custom_product_data || []);
    if (Array.isArray(cpd)) {
      cpd.forEach((p) => {
        if (Number(p.qty) > 0) {
          products.push({ product: p.product || "", qty: p.qty || "0", picked: false });
        }
      });
    }
  } catch (e) { /* ignore parse errors */ }
  return products;
};

// ── Default Process State per Job ────────────────────────────────
export const getDefaultProcessState = (job) => {
  const linearFeet = job?.linear_feet || job?.total_numerical_box || 0;
  const { numberOfLights } = calculateAutoQuantities(linearFeet);

  // Extract all products from quote
  const quoteProducts = parseQuoteProducts(job);

  return {
    // Step 1 — Prep
    prep: {
      numberOfLights,
      linearFeet,
      trackType: "",
      trackQty: 0,
      quoteProducts,
      screws: false,
      conduit: false,
      cableTie: false,
      connectorsBag: false,
      otherItems: [],
    },
    // Step 2 — On the Way
    onTheWay: {
      sent: false,
      etaMinutes: 15,
      sentAt: null,
    },
    // Step 3 — Controller Box
    controllerBox: {
      photo: null,
      confirmWithCustomer: job?.controller_confirm_with_customer || false,
      emailSent: false,
      preAssessmentImages: [],
      preAssessmentNotes: "",
    },
    // Step 4 — Post Installation
    postInstall: {
      checklist: {},
      images: [],
      notes: "",
    },
    // Step 5 — Supplies & Drop-off
    dropOff: {
      items: [],
      travelTime: { hours: 0, minutes: 0 },
      notes: "",
    },
    // Step 6 — Time Entry
    timeEntry: {
      totalTime: { hours: 0, minutes: 0 },
      expenses: [],
    },
    // Step 7 — Completion
    completed: false,
  };
};
