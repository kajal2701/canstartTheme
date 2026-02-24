const BASE_URL = "http://localhost:3000";

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
  } catch (e) {}
  return [];
};
