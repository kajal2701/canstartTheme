const BASE_URL = import.meta.env.VITE_BASE_URL;

export const submitPublicLead = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/lead/public/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getLeads = async () => {
  try {
    const res = await fetch(`${BASE_URL}/lead/manage`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (res.ok && result?.success) {
      return result.data || [];
    }
  } catch (e) { }
  return [];
};

export const viewLead = async (leadId) => {
  try {
    const response = await fetch(`${BASE_URL}/lead/view/${leadId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateLeadStatus = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/lead/update_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteLead = async (leadId) => {
  try {
    const response = await fetch(`${BASE_URL}/lead/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
