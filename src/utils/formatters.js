export const formatCurrency = (v) => {
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (Number.isFinite(n)) return `$${n.toFixed(2)}`;
  return String(v);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";

  // Extract only the date part (YYYY-MM-DD)
  return dateString.split("T")[0];
};
