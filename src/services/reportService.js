const BASE_URL = import.meta.env.VITE_BASE_URL;

// GET /report/sales-by-month — monthly revenue breakdown
export const getSalesByMonth = async (year) => {
  try {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    const res = await fetch(`${BASE_URL}/report/sales-by-month?${params.toString()}`);
    const result = await res.json();
    if (res.ok && result?.success) return result.data || [];
  } catch (e) {
    console.error("getSalesByMonth error", e);
  }
  return [];
};

// GET /report/sales-by-person — revenue by salesperson
export const getSalesByPerson = async (year, month) => {
  try {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);
    
    const res = await fetch(`${BASE_URL}/report/sales-by-person?${params.toString()}`);
    const result = await res.json();
    if (res.ok && result?.success) return result.data || [];
  } catch (e) {
    console.error("getSalesByPerson error", e);
  }
  return [];
};

// GET /report/color-usage — colour usage statistics
export const getColorUsage = async (year, month) => {
  try {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);
    
    const res = await fetch(`${BASE_URL}/report/color-usage?${params.toString()}`);
    const result = await res.json();
    if (res.ok && result?.success) return result.data || [];
  } catch (e) {
    console.error("getColorUsage error", e);
  }
  return [];
};
