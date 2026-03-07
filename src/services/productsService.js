const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/delete_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addProduct = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/products/add_product_process`, {
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

export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/edit_product/${productId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/products/edit_product_process`, {
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