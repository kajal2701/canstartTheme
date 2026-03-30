const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Helper ────────────────────────────────────────────────
const api = async (url, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${BASE_URL}${url}`, options);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ─── TRACKS ────────────────────────────────────────────────
export const getTracks = async () => {
  const result = await api("/inventory/tracks");
  return result?.success ? result.data || [] : [];
};
export const addTrack = (payload) => api("/inventory/tracks/add", "POST", payload);
export const editTrack = (payload) => api("/inventory/tracks/edit", "POST", payload);
export const deleteTrack = (trackId) => api("/inventory/tracks/delete", "POST", { track_id: trackId });

// ─── SCREWS ────────────────────────────────────────────────
export const getScrews = async () => {
  const result = await api("/inventory/screws");
  return result?.success ? result.data || [] : [];
};
export const addScrew = (payload) => api("/inventory/screws/add", "POST", payload);
export const editScrew = (payload) => api("/inventory/screws/edit", "POST", payload);
export const deleteScrew = (screwId) => api("/inventory/screws/delete", "POST", { screw_id: screwId });

// ─── POWER CORDS ───────────────────────────────────────────
export const getPowercords = async () => {
  const result = await api("/inventory/powercords");
  return result?.success ? result.data || [] : [];
};
export const addPowercord = (payload) => api("/inventory/powercords/add", "POST", payload);
export const editPowercord = (payload) => api("/inventory/powercords/edit", "POST", payload);
export const deletePowercord = (id) => api("/inventory/powercords/delete", "POST", { powercord_id: id });

// ─── PLUGS ─────────────────────────────────────────────────
export const getPlugs = async () => {
  const result = await api("/inventory/plugs");
  return result?.success ? result.data || [] : [];
};
export const addPlug = (payload) => api("/inventory/plugs/add", "POST", payload);
export const editPlug = (payload) => api("/inventory/plugs/edit", "POST", payload);
export const deletePlug = (id) => api("/inventory/plugs/delete", "POST", { plug_id: id });

// ─── LIGHTS ────────────────────────────────────────────────
export const getLights = async () => {
  const result = await api("/inventory/lights");
  return result?.success ? result.data || [] : [];
};
export const addLight = (payload) => api("/inventory/lights/add", "POST", payload);
export const editLight = (payload) => api("/inventory/lights/edit", "POST", payload);
export const deleteLight = (id) => api("/inventory/lights/delete", "POST", { light_id: id });

// ─── JUMPERS ───────────────────────────────────────────────
export const getJumpers = async () => {
  const result = await api("/inventory/jumpers");
  return result?.success ? result.data || [] : [];
};
export const addJumper = (payload) => api("/inventory/jumpers/add", "POST", payload);
export const editJumper = (payload) => api("/inventory/jumpers/edit", "POST", payload);
export const deleteJumper = (id) => api("/inventory/jumpers/delete", "POST", { jumper_id: id });

// ─── CONTROLLERS ───────────────────────────────────────────
export const getControllers = async () => {
  const result = await api("/inventory/controllers");
  return result?.success ? result.data || [] : [];
};
export const addController = (payload) => api("/inventory/controllers/add", "POST", payload);
export const editController = (payload) => api("/inventory/controllers/edit", "POST", payload);
export const deleteController = (id) => api("/inventory/controllers/delete", "POST", { controller_id: id });

// ─── CONNECTORS ────────────────────────────────────────────
export const getConnectors = async () => {
  const result = await api("/inventory/connectors");
  return result?.success ? result.data || [] : [];
};
export const addConnector = (payload) => api("/inventory/connectors/add", "POST", payload);
export const editConnector = (payload) => api("/inventory/connectors/edit", "POST", payload);
export const deleteConnector = (id) => api("/inventory/connectors/delete", "POST", { connector_id: id });

// ─── CABLES ────────────────────────────────────────────────
export const getCables = async () => {
  const result = await api("/inventory/cables");
  return result?.success ? result.data || [] : [];
};
export const addCable = (payload) => api("/inventory/cables/add", "POST", payload);
export const editCable = (payload) => api("/inventory/cables/edit", "POST", payload);
export const deleteCable = (id) => api("/inventory/cables/delete", "POST", { cable_id: id });
