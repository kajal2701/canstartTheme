import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import { getCustomerById, updateCustomer } from "@/services/customersService";
import { toast } from "react-toastify";

const EditCustomer = () => {
  const { id } = useParams();
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

  // ── Prefill form ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchCustomer = async () => {
      const result = await getCustomerById(id);
      if (result.success) {
        const c = result.data;
        let extraEmails = [];
        if (c.email_json) {
          const parsed =
            typeof c.email_json === "string"
              ? JSON.parse(c.email_json)
              : c.email_json;

          // Filter out the primary email by matching c.email
          extraEmails = parsed
            .filter((email) => email !== c.email)
            .map((email) => ({ value: email }));
        }

        reset({
          firstName: c.fname ?? "",
          lastName: c.lname ?? "",
          email: c.email ?? "",
          phoneNumber: c.phone ?? "",
          street: c.address ?? "",
          city: c.city ?? "",
          postCode: c.post_code ?? "",
          province: c.state ?? "",
          country: c.country ?? "",
          extraEmails,
        });
      } else {
        toast.error("Failed to load customer");
        navigate("/customer");
      }
    };
    fetchCustomer();
  }, [id]);
  // ────────────────────────────────────────────────────────────────

  const onSubmit = async (data, provincesData) => {
    const allEmails = [
      data.email,
      ...(data.extraEmails || []).map((e) => e.value).filter(Boolean),
    ];
    const selectedProvince = provincesData.find(
      (p) => p.Province === data.province,
    );
    const gst = selectedProvince?.GST ?? "0.00";

    const payload = {
      customer_id: id,
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      email_json: JSON.stringify(allEmails),
      phone: data.phoneNumber,
      street: data.street,
      city: data.city,
      post_code: data.postCode,
      state: data.province,
      country: data.country,
      gst,
    };

    const result = await updateCustomer(payload);
    if (result.success) {
      toast.success(result.message);
      navigate("/customer");
    } else {
      toast.error(result.message);
      if (result.message?.toLowerCase().includes("email")) {
        setError("email", {
          type: "server",
          message: "This email already exists for another customer",
        });
      }
    }
  };

  return (
    <CustomerForm
      methods={methods}
      onSubmit={onSubmit}
      title="Edit Customer"
      submitText="Update"
    />
  );
};

export default EditCustomer;
