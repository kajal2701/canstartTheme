import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { getProvinces } from "@/services/quoteService";
import { useNavigate } from "react-router-dom";
import { useFieldArray } from "react-hook-form";
import Icon from "@/components/ui/Icon";

const countryOptions = [
  { value: "Canada", label: "Canada" },
  { value: "USA", label: "USA" },
];

const CustomerForm = ({
  methods,
  onSubmit,
  title,
  submitText,
  hideActions = false,
}) => {
  const navigate = useNavigate();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [provincesData, setProvincesData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extraEmails",
  });

  // ── Fetch provinces ──────────────────────────────────────────────
  useEffect(() => {
    const loadProvinces = async () => {
      const rows = await getProvinces();
      if (Array.isArray(rows)) {
        setProvincesData(rows);
        setProvinceOptions(
          rows.map((p) => ({
            value: p.Province,
            label: p.Province,
          })),
        );
      }
    };
    loadProvinces();
  }, []);
  // ────────────────────────────────────────────────────────────────

  return (
    <Card title={title}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => onSubmit(data, provincesData))}>
          <div className="space-y-5">
            {/* ── Personal Info ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Textinput
                label="First Name"
                type="text"
                placeholder="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                options={{
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                }}
              />

              <Textinput
                label="Last Name"
                type="text"
                placeholder="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                options={{
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                }}
              />

              {/* Primary email */}
              <div className="flex flex-col">
                <Textinput
                  label="Email address"
                  type="email"
                  placeholder="Email address"
                  name="email"
                  register={register}
                  error={errors.email}
                  options={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  }}
                />

                {/* Extra email fields */}
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-3">
                    <div className="flex-1">
                      <Textinput
                        type="email"
                        placeholder="Email address"
                        name={`extraEmails.${index}.value`}
                        register={register}
                        error={errors.extraEmails?.[index]?.value}
                        options={{
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Please enter a valid email address",
                          },
                        }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="shrink-0 bg-red-400 hover:bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  text="Add Email +"
                  className="btn-primary btn-sm mt-2 w-fit"
                  type="button"
                  onClick={() => append({ value: "" })}
                />
              </div>

              <Textinput
                label="Phone Number"
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                register={register}
                error={errors.phoneNumber}
                options={{
                  pattern: {
                    value: /^[+]?[\d\s\-().]{7,15}$/,
                    message: "Please enter a valid phone number",
                  },
                }}
              />
            </div>

            {/* ── Address ── */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
              <div className="lg:col-span-2 col-span-1 text-gray-900 text-base dark:text-gray-300 font-medium">
                Address
              </div>

              <div className="lg:col-span-2 col-span-1">
                <Textinput
                  label="Street"
                  type="text"
                  placeholder="Street address"
                  name="street"
                  register={register}
                  error={errors.street}
                  options={{ required: "Street is required" }}
                />
              </div>

              <Textinput
                label="City"
                type="text"
                placeholder="City"
                name="city"
                register={register}
                error={errors.city}
                options={{ required: "City is required" }}
              />

              <Textinput
                label="Post Code"
                type="text"
                placeholder="Post code"
                name="postCode"
                register={register}
                error={errors.postCode}
                options={{
                  pattern: {
                    value: /^[a-zA-Z0-9\s\-]{3,10}$/,
                    message: "Please enter a valid post code",
                  },
                }}
              />

              <Select
                label="Province"
                name="province"
                placeholder="-- Select Province --"
                options={provinceOptions}
                register={register}
                error={errors.province}
                options_rule={{ required: "Province is required" }}
              />

              <Select
                label="Country"
                name="country"
                placeholder="--Select your Country--"
                options={countryOptions}
                register={register}
                error={errors.country}
                options_rule={{ required: "Country is required" }}
              />
            </div>

            {/* ── Action Buttons — hidden when used inside EditQuote ── */}
            {!hideActions && (
              <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                <Button
                  text="Cancel"
                  type="button"
                  className="btn-outline-dark btn-sm"
                  onClick={() => navigate("/customer")}
                />

                <Button
                  text={isSubmitting ? "Saving..." : submitText}
                  type="submit"
                  className="btn-primary btn-sm"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </Card>
  );
};

export default CustomerForm;
