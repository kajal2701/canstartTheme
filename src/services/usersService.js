const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/manage_user`, {
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


export const addUser = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/users/add_user_process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (Number(result?.status_code) === 1 && result.success) {
      return { success: true, message: result.message || "User added successfully!" };
    }
    return { success: false, message: result.message || "Failed to add user" };
  } catch (e) { }
  return { success: false, message: "A server error occurred. Please try again." };
};


export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/delete_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/edit_user/${userId}`); 
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateUser = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/users/edit_user_process`, {
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