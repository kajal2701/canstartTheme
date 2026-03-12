export const mapInventoryType = (val) => {
  const v = val != null ? String(val).trim() : "";
  if (v === "1") return "Controller";
  if (v === "2") return "Channel";
  if (!v) return "-";
  return v.charAt(0).toUpperCase() + v.slice(1);
};

export const mapUserRole = (val) => {
  const v = val != null ? String(val).trim() : "";
  if (v === "1") return "Admin";
  if (v === "2") return "Installer";
  if (v === "3") return "Operations";
  if (v === "4") return "Sales";
  return "User";
};

export const buildAddressParts = (customer) => {
  const parts = [];

  if (customer.address) parts.push(customer.address);
  if (customer.city) parts.push(customer.city);
  if (customer.state) parts.push(customer.state);
  if (customer.country) parts.push(customer.country);

  const address = parts.filter(Boolean).join(", ");

  return {
    address: address,
  };
};

export const AddressCell = ({ row }) => {
  const o = row.original || {};
  const line1 = o.address || "-";
  const line2 = [o.city, o.state, o.country].filter(Boolean).join(", ");
  return (
    <div className="max-w-[220px] break-words overflow-hidden">
      <div className="text-xs text-gray-700 dark:text-gray-300 break-words whitespace-normal">
        {line1}
      </div>
      {(o.city || o.state || o.country) && (
        <div className="text-xs text-gray-500 break-words whitespace-normal">
          {line2}
        </div>
      )}
    </div>
  );
};

export const addressAccessor = (row) =>
  [row.address, row.city, row.state, row.country, row.post_code]
    .filter(Boolean)
    .join(" ");

export const encodeId = (id) => {
  // Add random padding to make each encoding unique and longer
  const randomSalt = Math.random().toString(36).substring(2, 15);
  const paddedId = `${id}__${randomSalt}__${Date.now()}`;

  // Multiple base64 encodings
  let encoded = btoa(paddedId);
  encoded = btoa(encoded);

  return encoded;
};

export const decodeId = (encoded) => {
  try {
    let decoded = encoded;
    decoded = atob(decoded);
    decoded = atob(decoded);

    // Extract the original ID
    const parts = decoded.split("__");
    return parts[0]; // Return just the ID
  } catch (error) {
    console.error("Invalid encoded ID:", error);
    return null;
  }
};

export const getQuoteStage = (quote) => {
  const payment = quote.payment_details?.[0];
  const hasPayment = !!payment;
  const onlinePayment = quote.online_payment_details?.[0];

  // Cancelled
  if (quote.status == 5) return "Cancelled";

  // Fully Paid
  if (payment?.status == 1) return "Fully Paid";

  // Created - no payment set yet
  if (quote.status == 1 && !hasPayment) return "Created";

  // Pending Approval - payment exists but not approved yet
  if (quote.status == 1 && hasPayment) return "Pending Approval";

  // Confirmed - Awaiting Payment (no online payment/deposit yet)
  if (quote.status == 3 && !onlinePayment)
    return "Confirmed - Awaiting Payment";

  // Confirmed - Deposit Paid (deposit made, awaiting admin confirmation)
  if (quote.status == 3 && onlinePayment?.status == 0)
    return "Confirmed - Deposit Paid";

  // Invoice Sent (installation done, invoice not sent yet)
  if (quote.status == 3 && quote.installation_date && !quote.invoice_date)
    return "Invoice Sent";

  // Invoice Sent - Awaiting Confirmation
  if (
    quote.status == 3 &&
    quote.invoice_date &&
    parseFloat(payment?.pending_payment_amount) > 0
  )
    return "Invoice Sent - Awaiting Confirmation";

  return "Created"; // fallback
};
