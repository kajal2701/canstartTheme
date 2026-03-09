export const formatCurrency = (v) => {
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (Number.isFinite(n)) return `$${n.toFixed(2)}`;
  return String(v);
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