import { useForm } from "react-hook-form";
import { submitPublicLead } from "@/services/leadService";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Logo from "@/assets/images/logo/canstar-logo.svg";
import bgImage from "@/assets/images/enquiry-bg/background.webp";

/* ---------- Reusable pieces ---------- */

const InputWithIcon = ({ icon, multiline = false, children }) => (
  <div className="relative">
    <span
      className={`absolute left-4 text-white/60 pointer-events-none ${multiline ? "top-3" : "top-1/2 -translate-y-1/2"
        }`}
    >
      <Icon icon={icon} width="18" height="18" />
    </span>
    {children}
  </div>
);

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-white mb-1.5 ml-0.5">
      {label} {required && <span className="text-[#ff8a7a]">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-[#ff5252] text-xs mt-1.5 ml-1 font-bold flex items-center gap-1 drop-shadow-md">
        <Icon icon="mdi:alert-circle-outline" width="14" height="14" />
        {error}
      </p>
    )}
  </div>
);

/* 16px text on mobile stops iOS Safari from zooming on focus */
const baseField =
  "w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-12 pr-4 " +
  "text-base sm:text-sm text-white placeholder-white/40 outline-none " +
  "appearance-none backdrop-blur-sm transition-all duration-300 " +
  "hover:border-white/35 hover:bg-white/15 " +
  "focus:border-[#f0795c] focus:bg-white/15 focus:ring-4 focus:ring-[#f0795c]/20";

const inputClass = `${baseField} h-11`;
const textareaClass = `${baseField} resize-none h-11 block`;

/* ---------- Page ---------- */

const PublicEnquiryForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", phone: "", note: "", address: "" },
  });

  const onSubmit = async (data) => {
    const result = await submitPublicLead(data);

    if (result.success) {
      toast.success(
        result.message || "Your enquiry has been submitted successfully."
      );
      reset();
    } else {
      toast.error(result.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-cover bg-center bg-no-repeat
                 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                 touch-pan-y"
      style={{
        backgroundImage: `url(${bgImage})`,
        /* iOS safe areas via CSS env() */
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Dull / dark overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/45" />

      <div
        className="relative z-10 flex min-h-full w-full
                   px-3 py-4 sm:p-6 md:p-8"
      >
        {/* Dark glass card */}
        <div
          className="relative m-auto w-full
                     max-w-[480px] sm:max-w-[520px] md:max-w-[560px]
                     overflow-hidden
                     rounded-2xl sm:rounded-3xl border border-white/25
                     bg-gradient-to-br from-white/20 via-black/30 to-black/40
                     backdrop-blur-2xl backdrop-saturate-100
                     shadow-[0_25px_70px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)]"
        >
          {/* Soft top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />

          {/* Logo header - full width */}
          <div className="relative px-4 sm:px-7 pt-4 sm:pt-5">
            <div
              className="relative flex w-full items-center justify-center overflow-hidden
                         rounded-xl sm:rounded-2xl
                         bg-black/40 border border-white/15
                         py-2.5 sm:py-3 px-4 sm:px-6
                         shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              <img
                src={Logo}
                alt="Canstar Lights"
                className="relative h-8 sm:h-10 md:h-11 w-auto max-w-full object-contain"
              />
            </div>
          </div>

          {/* Form content */}
          <div className="relative px-4 sm:px-7 pt-2 sm:pt-3 pb-5 sm:pb-6">
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                Quote Request
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2.5 sm:space-y-3"
              noValidate
            >
              <Field label="Name" required error={errors.name?.message}>
                <InputWithIcon icon="mdi:account-outline">
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    autoComplete="name"
                    placeholder="Enter name"
                    className={inputClass}
                  />
                </InputWithIcon>
              </Field>

              <Field label="Phone Number" required error={errors.phone?.message}>
                <InputWithIcon icon="mdi:phone-outline">
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[\d\s\-().]{7,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Enter phone number"
                    className={inputClass}
                  />
                </InputWithIcon>
              </Field>
              <Field label="Address" required error={errors.address?.message}>
                <InputWithIcon icon="mdi:map-marker-outline" multiline>
                  <textarea
                    {...register("address", {
                      required: "Address is required",
                    })}
                    rows={1}
                    autoComplete="street-address"
                    placeholder="Enter address"
                    className={textareaClass}
                  />
                </InputWithIcon>
              </Field>

              <Field label="Note">
                <InputWithIcon icon="mdi:note-text-outline" multiline>
                  <textarea
                    {...register("note")}
                    rows={1}
                    placeholder="Enter any notes..."
                    className={textareaClass}
                  />
                </InputWithIcon>
              </Field>



              <div className="pt-1.5 sm:pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  icon={isSubmitting ? "mdi:loading" : "mdi:send"}
                  iconPosition="right"
                  className={`w-full h-11 sm:h-12 px-4 rounded-xl text-white font-semibold
                    text-sm sm:text-base
                    bg-gradient-to-r from-[#fb8b70] to-[#e8603f]
                    hover:from-[#f97d5f] hover:to-[#dc5233]
                    border-none shadow-[0_10px_24px_-6px_rgba(232,96,63,0.6)]
                    transition-all duration-300 hover:-translate-y-0.5
                    active:translate-y-0 active:scale-[0.99]
                    ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEnquiryForm;