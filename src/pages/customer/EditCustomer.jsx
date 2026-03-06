import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { getCustomerById, updateCustomer } from "@/services/customersService";
import { getProvinces } from "@/services/quoteService";
import { toast } from "react-toastify";

const countryOptions = [
  { value: "Canada", label: "Canada" },
  { value: "USA", label: "USA" },
];

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [provincesData, setProvincesData] = useState([]);

  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      street: "",
      city: "",
      postCode: "",
      province: "",
      country: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = methods;

  // ── Fetch provinces ──────────────────────────────────────────────
  useEffect(() => {
    const loadProvinces = async () => {
      const rows = await getProvinces();
      if (Array.isArray(rows)) {
        setProvincesData(rows);
        setProvinceOptions(rows.map((p) => ({
          value: p.Province,
          label: p.Province,
        })));
      }
    };
    loadProvinces();
  }, []);
  // ────────────────────────────────────────────────────────────────

  // ── Fetch customer and prefill form ─────────────────────────────
  useEffect(() => {
    const fetchCustomer = async () => {
      const result = await getCustomerById(id);
      if (result.success) {
        const c = result.data;
        reset({
          firstName: c.fname ?? "",
          lastName: c.lname ?? "",
          email: c.email ?? "",
          phoneNumber: c.phone ?? "",
          street: c.address ?? "",
          city: c.city ?? "",
          postCode: c.post_code ?? "",
          province: c.state ?? "",      // ← state column maps to province
          country: c.country ?? "",
        });
      } else {
        toast.error("Failed to load customer");
        navigate("/customer");
      }
    };
    fetchCustomer();
  }, [id]);
  // ────────────────────────────────────────────────────────────────

  const onSubmit = async (data) => {
    // ← get GST from selected province
    const selectedProvince = provincesData.find((p) => p.Province === data.province);
    const gst = selectedProvince?.GST ?? "0.00";

    const payload = {
      customer_id: id,
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      street: data.street,
      city: data.city,
      post_code: data.postCode,
      state: data.province,
      country: data.country,
      gst: gst,
    };

    const result = await updateCustomer(payload);
    if (result.success) {
      toast.success(result.message);
      navigate("/customer");
    } else {
      toast.error(result.message);
      if (result.message?.toLowerCase().includes("email")) {
        setError("email", { type: "server", message: "This email already exists for another customer" });
      }
    }
  };

  return (
    <div>
      <Card title="Edit Customer">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    minLength: { value: 2, message: "First name must be at least 2 characters" },
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
                    minLength: { value: 2, message: "Last name must be at least 2 characters" },
                  }}
                />

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

              <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                <Button
                  text="Cancel"
                  type="button"
                  className="btn-outline-dark btn-sm"
                  onClick={() => navigate("/customer")}
                />
                <Button
                  text="Update"
                  type="submit"
                  className="btn-primary btn-sm"
                />
              </div>

            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default EditCustomer;