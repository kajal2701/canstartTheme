import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { getProductById, updateProduct } from "@/services/productsService";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // ── Fetch product and prefill form ───────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProductById(id);
      if (result.success && result.data) {
        const p = result.data;
        reset({
          title: p.product_title ?? "",
          sku: p.SKU ?? "",
          description: p.product_description ?? "",
          inventory: p.inventory ?? "",
          price: p.price ?? "",
          type: String(p.type) ?? "",          // ← "1" or "2"
          channel_color: p.color ? String(p.color) : "",  // ← prefill color if exists
        });
      } else {
        toast.error("Failed to load product");
        navigate("/product");
      }
    };
    fetchProduct();
  }, [id]);
  // ────────────────────────────────────────────────────────────────

  const onSubmit = async (data) => {
    const payload = {
      product_id: id,
      title: data.title,
      sku: data.sku,
      description: data.description,
      inventory: data.inventory,
      price: data.price,
      type: data.type,
      channel_color: data.type === "2" ? data.channel_color : null,  // ← null for Controller
    };

    const result = await updateProduct(payload);
    if (result.success) {
      toast.success(result.message);
      navigate("/product");
    } else {
      toast.error(result.message);
      if (result.message?.toLowerCase().includes("sku")) {
        setError("sku", { type: "server", message: "This SKU already exists" });
      }
    }
  };

  return (
    <ProductForm
      methods={methods}
      onSubmit={onSubmit}
      title="Edit Product"
      submitText="Update"
    />
  );
};

export default EditProduct;