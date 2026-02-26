const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const getQuotes = async (userId, role) => {
    try {
        const params = new URLSearchParams();
        if (userId != null && userId !== "") params.append("user_id", userId);
        if (role != null && role !== "") params.append("role", role);
        const res = await fetch(`${BASE_URL}/quote/manage_quote?${params.toString()}`, {
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