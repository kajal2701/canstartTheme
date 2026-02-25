const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const getPayments = async (userId, role) => {
  try {
    const params = new URLSearchParams();
    if (userId != null && userId !== "") params.append("user_id", userId);
    if (role != null && role !== "") params.append("role", role);
    const res = await fetch(`${BASE_URL}/payment/manage_invoice?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || [];
    }
  } catch (e) {}
  return [];
};
