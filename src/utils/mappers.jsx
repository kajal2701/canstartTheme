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

export const buildAddressParts = (obj) => {
  const street =
    obj.address || [obj.address1, obj.address2].filter(Boolean).join(", ");
  const address = [street, obj.city, obj.state, obj.country]
    .filter(Boolean)
    .join(", ");
  return {
    address,
    addressLine: street,
    city: obj.city ?? "",
    state: obj.state ?? "",
    country: obj.country ?? "",
    post_code: obj.post_code ?? "",
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
