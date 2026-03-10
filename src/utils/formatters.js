export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Return in "Month DD, YYYY" format
  return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};

// Safe image URL generator
export const getImgSrc = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};