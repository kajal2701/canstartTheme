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
