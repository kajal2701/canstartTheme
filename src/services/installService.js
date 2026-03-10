const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const getInstalls = async (userId, role) => {
    const res = await fetch(`${BASE_URL}/quote/installs?user_id=${userId}&role=${role}`);
    if (!res.ok) throw new Error("Failed to fetch installs");
    const json = await res.json();
    return json.data;
}// { upcoming_installations, non_scheduled_jobs }