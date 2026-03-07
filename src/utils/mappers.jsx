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
