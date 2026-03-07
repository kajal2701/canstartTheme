import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { addProduct } from "@/services/productsService";
import { toast } from "react-toastify";

const AddProduct = () => {

  const methods = useForm({
    defaultValues: {
      title: "",
      sku: "",
      description: "",
      inventory: "",
      price: "",
      type: "",
      channel_color: "",
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      sku: data.sku,
      description: data.description,
      inventory: data.inventory,
      price: data.price,
      type: data.type,
      channel_color: data.type === "2" ? data.channel_color : "",
    };

    const result = await addProduct(payload);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
      // ← handle duplicate SKU from backend
      if (result.message?.toLowerCase().includes("sku")) {
        setError("sku", { type: "server", message: "This SKU already exists" });
      }
    }
  };

  return (
    <ProductForm
      methods={methods}
      onSubmit={onSubmit}
      title="Add Product"
      submitText="Save"
    />
  );
};

export default AddProduct;