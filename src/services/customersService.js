const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/delete_customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addCustomer = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/add_customer_process`, {
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

export const getCustomerById = async (customerId) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/edit_customer/${customerId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateCustomer = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/customer/update_customer_process`, {
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