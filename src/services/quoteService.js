const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getQuotes = async (userId, role) => {
  try {
    const params = new URLSearchParams();
    if (userId != null && userId !== "") params.append("user_id", userId);
    if (role != null && role !== "") params.append("role", role);
    const res = await fetch(
      `${BASE_URL}/quote/manage_quote?${params.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || [];
    }
  } catch (e) { }
  return [];
};

export const getQuote = async (quoteId) => {
  if (!quoteId) return null;
  try {
    const res = await fetch(`${BASE_URL}/quote/view_quote/${quoteId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || null;
    }
    throw new Error(result.message || "Failed to fetch quote");
  } catch (e) {
    console.error("getQuote error", e);
    throw e;
  }
};

export const getProductsData = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/quote/get_product_data
`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || [];
    }
  } catch (e) {
    console.error("getQuote error", e);
    throw e;
  }
};

export const getColors = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/quote/get_colors

`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || [];
    }
  } catch (e) {
    console.error("getQuote error", e);
    throw e;
  }
};

export const addQuote = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/quote/add_quote_process`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok || !result?.success) {
      throw new Error(result.message || "Failed to add quote");
    }
    return result;
  } catch (e) {
    console.error("addQuote error", e);
    throw e;
  }
};
export const getProvinces = async () => {
  try {
    const response = await fetch(`${BASE_URL}/quote/get_provinces`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    return [];
  }
};
export const deleteQuote = async (quoteId) => {
  try {
    const response = await fetch(`${BASE_URL}/quote/delete_quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quote_id: quoteId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};

export const getEditQuote = async (quoteId) => {
  const response = await fetch(`${BASE_URL}/quote/edit_quote/${quoteId}`);
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch quote");
  return data.data; // { quote, products, colors, provinces }
};

export const updateQuote = async (formData) => {
  const response = await fetch(`${BASE_URL}/quote/update_quote`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to update quote");
  return data;
};