const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const getInstalls = async (userId, role) => {
    const res = await fetch(`${BASE_URL}/quote/installs2?user_id=${userId}&role=${role}`);
    if (!res.ok) throw new Error("Failed to fetch installs");
    const json = await res.json();
    return json.data;
}// { upcoming_installations, non_scheduled_jobs }

export const getCalendarInstalls = async (userId, role) => {
    const res = await fetch(`${BASE_URL}/quote/calendar_installs?user_id=${userId}&role=${role}`);
    if (!res.ok) throw new Error("Failed to fetch calendar installs");
    const json = await res.json();
    return json.data;
};

// ─── Install Process API ─────────────────────────────────────────────────────

// GET /install/process/:quote_id — Fetch saved process state
export const getInstallProcess = async (quoteId) => {
    const res = await fetch(`${BASE_URL}/install/process/${quoteId}`);
    if (!res.ok) throw new Error("Failed to fetch install process");
    const json = await res.json();
    return json.data; // null if no record exists
};

// POST /install/save-step — Save a single step's data
// For step 3, sends FormData with files; for other steps, sends JSON
export const saveInstallStep = async ({ quote_id, installer_id, current_step, step_data, pendingFiles }) => {
    const stepNum = parseInt(current_step);

    // Step 3 with pending files → use FormData (1 API call for files + data)
    if (stepNum === 3 && pendingFiles) {
        const formData = new FormData();
        formData.append("quote_id", quote_id);
        formData.append("installer_id", installer_id || "");
        formData.append("current_step", current_step);

        // Clean step_data: remove File objects before stringifying
        const cleanData = { ...step_data };
        if (cleanData.photo?.file) {
            delete cleanData.photo; // will be set by backend from uploaded file
        }
        if (cleanData.preAssessmentImages) {
            cleanData.preAssessmentImages = cleanData.preAssessmentImages
                .filter((img) => img.filePath) // keep only already-uploaded images
                .map(({ name, filePath }) => ({ name, filePath }));
        }
        formData.append("step_data", JSON.stringify(cleanData));

        // Append files
        if (pendingFiles.controllerBoxPhoto) {
            formData.append("controller_box_photo", pendingFiles.controllerBoxPhoto);
        }
        if (pendingFiles.assessmentImages?.length > 0) {
            pendingFiles.assessmentImages.forEach((file, idx) => {
                formData.append(`assessment_image_${idx}`, file);
            });
        }

        const res = await fetch(`${BASE_URL}/install/save-step`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Failed to save step");
        return await res.json();
    }

    // All other steps → JSON body
    const res = await fetch(`${BASE_URL}/install/save-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote_id, installer_id, current_step, step_data }),
    });
    if (!res.ok) throw new Error("Failed to save step");
    return await res.json();
};

// POST /install/complete — Mark installation as complete
export const completeInstallProcess = async (quoteId) => {
    const res = await fetch(`${BASE_URL}/install/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote_id: quoteId }),
    });
    if (!res.ok) throw new Error("Failed to complete installation");
    const json = await res.json();
    return json;
};

// POST /install/:quote_id/on-the-way — Send on-the-way email notification
export const sendOnTheWayNotification = async (quoteId, etaMinutes) => {
    const res = await fetch(`${BASE_URL}/install/${quoteId}/on-the-way`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etaMinutes }),
    });
    if (!res.ok) throw new Error("Failed to send on-the-way notification");
    const json = await res.json();
    return json;
};

// POST /install/:quote_id/controller-box-email — Send controller box confirmation
export const sendControllerBoxEmailApi = async (quoteId, photo) => {
    const res = await fetch(`${BASE_URL}/install/${quoteId}/controller-box-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo }),
    });
    if (!res.ok) throw new Error("Failed to send controller box email");
    const json = await res.json();
    return json;
};

// POST /install/:quote_id/pre-assessment-email — Send pre-assessment to customer
export const sendPreAssessmentEmailApi = async (quoteId, images, notes) => {
    const res = await fetch(`${BASE_URL}/install/${quoteId}/pre-assessment-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, notes }),
    });
    if (!res.ok) throw new Error("Failed to send pre-assessment email");
    const json = await res.json();
    return json;
};