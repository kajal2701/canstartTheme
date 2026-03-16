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

export const editQuote = async (formData) => {
  const response = await fetch(`${BASE_URL}/quote/edit_quote_process`, {
    method: "POST",
    body: formData, // FormData — no Content-Type header needed
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to edit quote");
  return data;
};


export const addExtraWork = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/add_extra_work_process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to add extra work");
  return data;
};


export const sendFinalQuote = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/send_final_quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to send final quote");
  return data;
};


export const resendQuote = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/resend_quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to resend quote");
  return data;
};

export const updateQuoteSend = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/update_quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to send updated quote");
  return data;
};

export const setPaymentOption = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/quote/set_payment_option`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok || !result?.success) {
      throw new Error(result.message || "Failed to set payment option");
    }
    return result;
  } catch (e) {
    console.error("setPaymentOption error", e);
    throw e;
  }
};


export const sendForApproval = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/send_for_approval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to send for approval");
  return data;
};

export const sendForApprove = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/send_for_approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to approve quote");
  return data;
};

export const paymentReceive = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/payment_receive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to confirm payment");
  return data;
};

export const scheduleInstallation = async (payload) => {
  const response = await fetch(`${BASE_URL}/quote/schedule_installation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Failed to schedule installation");
  return data;
};

export const processPayment = async (formData) => {
  const response = await fetch(`${BASE_URL}/payment/processPayment`, {
    method: "POST",
    body: formData, // multipart — do NOT set Content-Type header
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Payment failed");
  return data;
};

export const processPaymentFinal = async (formData) => {
  const response = await fetch(`${BASE_URL}/payment/processPaymentfinal`, {
    method: "POST",
    body: formData, // FormData handles multipart automatically, no Content-Type header needed
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Payment failed");
  }

  return data;
};

export const getQuotePaymentDetails = async (quoteId) => {
  const response = await fetch(`${BASE_URL}/quote/view_quote_payment/${quoteId}`);

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch payment details");
  }

  return data.data; // returns array of payment records from online_payment_details
};