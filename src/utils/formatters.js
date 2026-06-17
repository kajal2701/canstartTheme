import { MONTH_NAMES } from "./constants";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const formatCurrency = (v) => {
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";

  // Extract only the date part (YYYY-MM-DD)
  const datePart = dateString.split("T")[0];
  const [year, month, day] = datePart.split("-");

  // Return in dd-mm-yyyy format
  return `${day}-${month}-${year}`;
};


export const formatDateLong = (dateString) => {
  if (!dateString) return "-";

  // Extract only the date part (YYYY-MM-DD)
  const datePart = dateString.split("T")[0];
  const [year, month, day] = datePart.split("-");


  // Return in "Month DD, YYYY" format
  return `${MONTH_NAMES[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};

// Safe image URL generator
export const getImgSrc = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};
export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export const formatDateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const isToday = (dateStr) => dateStr === new Date().toISOString().split("T")[0];

export const formatEta = (hours, minutes) => {
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  return `${h}:${m}`;
};

export const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
