const BASE_URL = "http://localhost:3000";

export const getCustomers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/customer/manage_customer`, {
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
