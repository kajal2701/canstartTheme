const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/account/login_process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};
