export const formatCurrency = (v) => {
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (Number.isFinite(n)) return `$${n.toFixed(2)}`;
  return String(v);
};
