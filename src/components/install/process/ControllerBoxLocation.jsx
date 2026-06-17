import React, { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import StepHeader from "./StepHeader";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { sendControllerBoxEmailApi, sendPreAssessmentEmailApi } from "@/services/installService";
import { getImgSrc } from "@/utils/formatters";

const ControllerBoxLocation = ({ data, onChange, job }) => {
  const photoRef = useRef(null);
  const assessmentRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Get display URL for an image (handles both local preview and uploaded filePath)
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.preview) return img.preview; // local blob preview (not yet uploaded)
    if (img.filePath) return getImgSrc(img.filePath); // already uploaded to server
    return "";
  };

  // Store local preview + File object (upload happens on Save)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    update("photo", { name: file.name, preview, file });
  };

  // Store local previews + File objects for assessment images
  const handleAssessmentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
    }));
    update("preAssessmentImages", [...(data?.preAssessmentImages || []), ...newImages]);
  };

  const removeAssessmentImage = (index) => {
    const updated = [...(data?.preAssessmentImages || [])];
    // Revoke blob URL if it's a local preview
    if (updated[index]?.preview) URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    update("preAssessmentImages", updated);
  };

  const removePhoto = () => {
    if (data?.photo?.preview) URL.revokeObjectURL(data.photo.preview);
    update("photo", null);
  };

  const handleSendEmail = async (type) => {
    // Check if images have been uploaded (saved) before sending email
    if (type === "controllerBox" && data?.photo?.file) {
      toast.error("Please save first before sending the email.");
      return;
    }
    if (type === "assessment") {
      const hasUnsaved = (data?.preAssessmentImages || []).some((img) => img.file);
      if (hasUnsaved) {
        toast.error("Please save first before sending the email.");
        return;
      }
    }

    setIsSending(true);
    try {
      if (type === "controllerBox") {
        const photoUrl = getImgSrc(data?.photo?.filePath);
        await sendControllerBoxEmailApi(job?.quote_id, photoUrl);
        update("emailSent", true);
        toast.success("Controller box location photo sent to customer for confirmation!");
      } else {
        const imageUrls = (data?.preAssessmentImages || []).map((img) => getImgSrc(img.filePath));
        await sendPreAssessmentEmailApi(job?.quote_id, imageUrls, data?.preAssessmentNotes || "");
        update("assessmentEmailSent", true);
        toast.success("Pre-installation assessment sent to customer!");
      }
    } catch (error) {
      console.error(`Failed to send ${type} email:`, error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const confirmWithCustomer = data?.confirmWithCustomer ?? job?.controller_confirm_with_customer ?? false;
  const hasAssessmentContent =
    (data?.preAssessmentImages?.length > 0) || (data?.preAssessmentNotes?.trim());

  // Check if there are unsaved images (need to save before sending email)
  const hasUnsavedPhoto = !!data?.photo?.file;
  const hasUnsavedAssessment = (data?.preAssessmentImages || []).some((img) => img.file);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StepHeader
        icon="ph:cpu"
        iconColorClass="text-violet-500"
        title="Controller Box Location"
        description="Determine and document where the controller box will be placed."
        colorClass="from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-100 dark:border-violet-800"
      />

      {/* ── Section A: Controller Box Photo ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:camera" className="text-violet-500" />
            <span>Controller Box Location Photo</span>
            {confirmWithCustomer && (
              <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                Confirmation Required
              </span>
            )}
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="space-y-4">
          {/* Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmWithCustomer}
              onChange={(e) => update("confirmWithCustomer", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Please confirm with customer (Optional)
            </span>
          </label>

          {/* Upload area */}
          <div
            onClick={() => photoRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${data?.photo
                ? "border-green-300 bg-green-50/50 dark:bg-green-900/10"
                : "border-gray-200 dark:border-gray-600 hover:border-violet-300 hover:bg-violet-50/30"
              }`}
          >
            {data?.photo ? (
              <div className="space-y-3">
                <img
                  src={getImageUrl(data.photo)}
                  alt="Controller box location"
                  className="max-h-48 mx-auto rounded-lg shadow-sm"
                />
                <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-1">
                  <Icon icon="ph:check-circle" />
                  {data.photo.name}
                </p>
                {hasUnsavedPhoto && (
                  <p className="text-xs text-amber-500">⚠ Not saved yet — click Save to upload</p>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Icon icon="ph:camera-plus" className="text-4xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Click to take or upload a photo</p>
              </div>
            )}
          </div>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Send button */}
          {confirmWithCustomer && data?.photo && !hasUnsavedPhoto && (
            <Button
              text={data?.emailSent ? "Email Sent ✓" : isSending ? "Sending..." : "Send to Customer for Confirmation"}
              icon={data?.emailSent ? "ph:check-circle" : isSending ? "ph:circle-notch" : "ph:paper-plane-tilt"}
              className={data?.emailSent ? "btn-success" : "btn-primary"}
              onClick={() => handleSendEmail("controllerBox")}
              disabled={data?.emailSent || isSending}
            />
          )}
        </div>
      </Card>

      {/* ── Section B: Pre-Installation Assessment ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:note-pencil" className="text-amber-500" />
            <span>Pre-Installation Assessment</span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Assessment Images
            </label>

            {/* Uploaded images grid */}
            {data?.preAssessmentImages?.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {data.preAssessmentImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      alt={img.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    {img.file && (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[8px] px-1 rounded">
                        Unsaved
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAssessmentImage(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => assessmentRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all"
            >
              <div className="flex flex-col items-center justify-center">
                <Icon icon="ph:images" className="text-2xl text-gray-300 mb-1" />
                <p className="text-xs text-gray-500">Add images</p>
              </div>
            </div>
            <input
              ref={assessmentRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAssessmentUpload}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Assessment Notes
            </label>
            <textarea
              value={data?.preAssessmentNotes || ""}
              onChange={(e) => update("preAssessmentNotes", e.target.value)}
              placeholder="Add any notes about the pre-installation assessment..."
              rows={3}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Send button */}
          {hasAssessmentContent && !hasUnsavedAssessment && (
            <Button
              text={data?.assessmentEmailSent ? "Assessment Sent ✓" : isSending ? "Sending..." : "Send Assessment to Customer"}
              icon={data?.assessmentEmailSent ? "ph:check-circle" : isSending ? "ph:circle-notch" : "ph:paper-plane-tilt"}
              className={data?.assessmentEmailSent ? "btn-success" : "btn-primary"}
              onClick={() => handleSendEmail("assessment")}
              disabled={data?.assessmentEmailSent || isSending}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ControllerBoxLocation;
