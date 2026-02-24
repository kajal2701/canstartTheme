const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const getProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products/manage_products`, {
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
