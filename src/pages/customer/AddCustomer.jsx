import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import { addCustomer } from "@/services/customersService";
import { toast } from "react-toastify";

const AddCustomer = () => {
  const navigate = useNavigate();

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
      extraEmails: [],
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  const onSubmit = async (data, provincesData) => {
    const email_json = (data.extraEmails || [])
      .map((e) => e.value)
      .filter(Boolean);
    const selectedProvince = provincesData.find(
      (p) => p.Province === data.province,
    );
    const gst = selectedProvince?.GST ?? "0.00";

    const payload = {
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      email_json: email_json.length ? JSON.stringify(email_json) : null,
      phone: data.phoneNumber,
      street: data.street,
      city: data.city,
      post_code: data.postCode,
      state: data.province,
      country: data.country,
      gst,
    };

    const result = await addCustomer(payload);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
      if (result.message?.toLowerCase().includes("email")) {
        setError("email", {
          type: "server",
          message: "This email is already registered",
        });
      }
    }
  };

  return (
    <CustomerForm
      methods={methods}
      onSubmit={onSubmit}
      title="Add Customer"
      submitText="Save"
    />
  );
};

export default AddCustomer;
