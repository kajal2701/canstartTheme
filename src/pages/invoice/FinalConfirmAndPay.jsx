import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { processPaymentFinal } from "../../services/quoteService";

// ─── Validation helpers ───────────────────────────────────────────────────────
const validateName = (v) => /^[a-zA-Z ]+$/.test(v.trim());
const validateNumber = (v) => /^\d{16}$/.test(v);
const validateExpiry = (v) => {
  if (!/^\d{4}$/.test(v)) return false;
  const month = parseInt(v.slice(0, 2));
  const year = parseInt("20" + v.slice(2));
  const now = new Date();
  return (
    month >= 1 &&
    month <= 12 &&
    new Date(year, month - 1) >= new Date(now.getFullYear(), now.getMonth())
  );
};
const validateCVV = (v) => /^\d{3,4}$/.test(v);

const TAB_LABELS = {
  credit_card: "💳 Credit Card",
  etransfer: "🏦 E-Transfer",
  cash: "💵 Cash",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function FinalConfirmAndPay({
  isOpen,
  onClose,
  quote,
  onSuccess,
}) {
  const paymentDetails = quote?.payment_details ?? {};

  // Derived — read-only, never changes (matches PHP: radios are display-only)
  const paymentType = paymentDetails.payment_type == 2 ? "2" : "1";

  // Available tabs from admin-set methods e.g. "credit_card,etransfer"
  const selectedMethods = paymentDetails.select_payment_methods
    ? paymentDetails.select_payment_methods.split(",").map((m) => m.trim())
    : [];

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(selectedMethods[0] || "");
  const [ccForm, setCcForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [etransferFile, setEtransferFile] = useState(null);
  const [etransferPreview, setEtransferPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Pay Now ───────────────────────────────────────────────────────────────
  const handlePayNow = async () => {
    setError("");

    if (activeTab === "credit_card") {
      if (!validateName(ccForm.name))
        return setError("Credit Card Name must contain only letters.");
      if (!validateNumber(ccForm.number))
        return setError("Credit Card Number must be exactly 16 digits.");
      if (!validateExpiry(ccForm.expiry))
        return setError(
          "Expiry Date must be in MMYY format and not in the past.",
        );
      if (!validateCVV(ccForm.cvv))
        return setError("CVV must contain only 3 or 4 numbers.");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // ── Core payment fields ──────────────────────────────────────────────
      formData.append("quote_id", quote.quote_id);
      formData.append("payment_id", paymentDetails.payment_id || "");
      formData.append("payment_type", paymentDetails.payment_type || "");
      formData.append(
        "payment_percentage",
        paymentDetails.payment_percentage || "",
      );
      formData.append("amount", paymentDetails.pending_payment_amount || "");
      formData.append("payment_method", activeTab);

      // ── quotedata_changes fields ─────────────────────────────────────────
      formData.append(
        "product_data_json",
        JSON.stringify(quote.products || []),
      );
      formData.append(
        "custom_product_data_json",
        JSON.stringify(quote.custom_product_data || []),
      );
      formData.append(
        "total-controller-input",
        quote.total_controller_price || 0,
      );
      formData.append("total-feet-input", quote.total_feet_price || 0);
      formData.append("gst-input", quote.gst_percentage || 0);
      formData.append("total-input", quote.main_total || 0);
      formData.append("annotation_image_ids", ""); // empty — no deletions from customer side

      // ── Credit card fields ───────────────────────────────────────────────
      if (activeTab === "credit_card") {
        formData.append("cc_name", ccForm.name); // ← ADD THIS
        formData.append("cc_number", ccForm.number);
        formData.append("cc_expiry", ccForm.expiry);
        formData.append("cc_cvv", ccForm.cvv);
      }

      // ── E-transfer file ──────────────────────────────────────────────────
      if (activeTab === "etransfer" && etransferFile) {
        formData.append("etransfer_screenshot", etransferFile);
      }

      const result = await processPaymentFinal(formData);
      alert(result.message);
      onClose();
      onSuccess?.();
    } catch (e) {
      setError(e.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Modal
      activeModal={isOpen}
      onClose={onClose}
      title="Confirm and Pay"
      className="max-w-lg"
      footerContent={
        <div className="flex items-center gap-3 w-full justify-end">
          {error && (
            <p className="text-red-500 text-xs flex-1 text-left">{error}</p>
          )}
          <button
            type="button"
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed opacity-80"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handlePayNow}
          >
            {loading ? "Loading..." : "Pay Now"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* ── Payment type — read-only display, only shown if payment_type == 2 ── */}
        {paymentDetails.payment_type == 2 && (
          <>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm opacity-70 cursor-not-allowed">
                <input
                  type="radio"
                  name="pay-type"
                  value="1"
                  checked={paymentType === "1"}
                  onChange={() => {}}
                  disabled
                  className="accent-[#ee5d59]"
                />
                Full Payment
              </label>
              <label className="flex items-center gap-2 text-sm opacity-70 cursor-not-allowed">
                <input
                  type="radio"
                  name="pay-type"
                  value="2"
                  checked={paymentType === "2"}
                  onChange={() => {}}
                  disabled
                  className="accent-[#ee5d59]"
                />
                Deposit Payment
              </label>
            </div>

            {paymentType === "2" && (
              <p className="text-base text-gray-700 dark:text-gray-300">
                Deposit Payment Percentage :{" "}
                <b>{paymentDetails.payment_percentage}%</b>
              </p>
            )}
          </>
        )}

        {/* ── Payable Amount — disabled ── */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">
            Payable Amount:
          </label>
          <input
            type="text"
            disabled
            value={paymentDetails.pending_payment_amount || ""}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
          />
        </div>

        {/* ── Payment Method Tabs ── */}
        {selectedMethods.length > 0 && (
          <div>
            <ul className="flex border-b border-gray-300 dark:border-gray-600">
              {selectedMethods.map((method) => (
                <li key={method}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(method)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === method
                        ? "border-[#ee5d59] text-[#ee5d59]"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {TAB_LABELS[method] || method}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              {/* Credit Card */}
              {activeTab === "credit_card" && (
                <div className="space-y-3">
                  {[
                    {
                      label: "Credit Card Name:",
                      key: "name",
                      placeholder: "Full name",
                      maxLength: 100,
                    },
                    {
                      label: "Credit Card Number:",
                      key: "number",
                      placeholder: "16 digits",
                      maxLength: 16,
                    },
                    {
                      label: "Expiry Date (MMYY):",
                      key: "expiry",
                      placeholder: "MMYY",
                      maxLength: 4,
                    },
                    {
                      label: "CVV:",
                      key: "cvv",
                      placeholder: "3 or 4 digits",
                      maxLength: 4,
                    },
                  ].map(({ label, key, placeholder, maxLength }) => (
                    <div key={key}>
                      <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                      <input
                        type="text"
                        maxLength={maxLength}
                        placeholder={placeholder}
                        value={ccForm[key]}
                        onChange={(e) => {
                          setError("");
                          setCcForm((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ee5d59]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* E-Transfer */}
              {activeTab === "etransfer" && (
                <div>
                  <h6 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">
                    E-Transfer Details (info@canstarlight.ca)
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Upload the screenshot of the transfer here.
                  </p>
                  <div
                    className="text-center bg-white dark:bg-gray-700 p-5 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer w-[300px] mx-auto mb-4 hover:border-[#ee5d59] transition-colors"
                    onClick={() =>
                      document.getElementById("etransfer-upload").click()
                    }
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-base block">
                      Click to upload image
                    </span>
                    <input
                      id="etransfer-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setEtransferFile(file);
                        setEtransferPreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                  {etransferPreview && (
                    <div className="max-h-[300px] overflow-hidden rounded-lg">
                      <img
                        src={etransferPreview}
                        alt="Uploaded"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Cash */}
              {activeTab === "cash" && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cash payment instructions...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
