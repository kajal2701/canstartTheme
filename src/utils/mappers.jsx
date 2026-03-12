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

// with color
export const getQuoteStage = (row) => {
  // Step 1: Get payment details
  const paymentDetails = row.payment_details || [];
  const hasPayment = paymentDetails.length > 0;

  // Step 2: Get paymentStatus and payStatus from first payment record
  let paymentStatus = null;
  let payStatus = null;

  if (hasPayment && paymentDetails[0]?.status !== undefined) {
    paymentStatus = paymentDetails[0].status;
    payStatus = paymentDetails[0].payment_status;
  }

  // Step 3: Loop ALL payments → check if all confirmed or all pending
  let paymentStatusValue = null;

  if (hasPayment) {
    let allConfirmed = true;
    let allPending = true;

    paymentDetails.forEach((payment) => {
      if (payment.payment_status == 1) {
        allPending = false;
      } else if (payment.payment_status == 0) {
        allConfirmed = false;
      } else {
        allConfirmed = false;
        allPending = false;
      }
    });

    if (allConfirmed) paymentStatusValue = 1;
    else if (allPending) paymentStatusValue = 0;
    else paymentStatusValue = 0;
  }

  // Step 4: Check date flags
  const hasInvoiceDate = !!row.invoice_date;

  // Step 5: Priority conditions — EXACT SAME ORDER AS PHP

  if (row.status == 1) {
    return { label: "Created", color: "bg-blue-500 text-white" }; // bg-info
  } else if (paymentStatusValue == 1 && paymentStatus == 1) {
    return { label: "Fully Paid", color: "bg-green-500 text-white" }; // bg-success
  } else if (paymentStatusValue != 1 && paymentStatus == 0 && hasInvoiceDate) {
    return {
      label: "Invoice Sent - Awaiting Confirmation",
      color: "bg-yellow-400 text-gray-800",
    }; // bg-warning
  } else if (hasInvoiceDate) {
    return { label: "Invoice Sent", color: "bg-indigo-500 text-white" }; // bg-primary
  } else if (
    paymentStatus == 0 &&
    paymentStatusValue == 1 &&
    payStatus != null
  ) {
    return {
      label: "Confirmed - Deposit Paid",
      color: "bg-blue-500 text-white",
    }; // bg-info
  } else if (paymentStatus == 0 && hasPayment && paymentStatusValue != 1) {
    return {
      label: "Confirmed - Awaiting Payment",
      color: "bg-yellow-400 text-gray-800",
    }; // bg-warning
  } else if (paymentStatus === null && row.status == 3) {
    return { label: "Sent", color: "bg-yellow-400 text-gray-800" }; // bg-warning
  } else if (row.status == 3) {
    return { label: "Sent", color: "bg-yellow-400 text-gray-800" }; // bg-warning
  } else if (row.status == 2) {
    return { label: "Pending Approval", color: "bg-indigo-500 text-white" }; // bg-primary
  } else if (row.status == 4) {
    return { label: "Cancelled", color: "bg-red-500 text-white" }; // bg-danger
  } else {
    return { label: "Unknown Status", color: "bg-gray-400 text-white" }; // bg-secondary
  }
};
