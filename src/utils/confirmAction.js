import Swal from "sweetalert2";

/**
 * Reusable SweetAlert2 confirmation dialog.
 *
 * @param {Object}  options
 * @param {string}  [options.title="Are you sure?"]
 * @param {string}  [options.text=""]
 * @param {string}  [options.icon="warning"]            – "warning" | "info" | "question" | "error" | "success"
 * @param {string}  [options.confirmButtonText="Yes"]
 * @param {string}  [options.cancelButtonText="Cancel"]
 * @param {string}  [options.confirmButtonColor="#3085d6"]
 * @param {string}  [options.cancelButtonColor="#d33"]
 * @returns {Promise<boolean>}  – true if user confirmed, false otherwise
 *
 * @example
 *   const ok = await confirmAction({ text: "Resend this quote?" });
 *   if (!ok) return;
 */
const confirmAction = async ({
  title = "Are you sure?",
  text = "",
  icon = "warning",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  input,
  inputValue,
  inputPlaceholder,
  inputValidator,
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    input,
    inputValue,
    inputPlaceholder,
    inputValidator,
  });

  if (input) {
    return { isConfirmed: result.isConfirmed, value: result.value };
  }

  return result.isConfirmed;
};

export default confirmAction;
