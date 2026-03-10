import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuoteForm } from "@/hooks/useQuoteForm";
import ProductRow from "@/components/quote/ProductRow";
import CustomProductRow from "@/components/quote/CustomProductRow";
import AnnotationImagePreview from "@/components/quote/AnnotationImagePreview";
import PriceSummary from "@/components/quote/PriceSummary";
import ImageUploadWithToggle from "../../components/quote/imageUploadWithToggle/Index";

import { getEditQuote, updateQuote } from "../../services/quoteService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomerForm from "../customer/CustomerForm";

const EditQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pageLoading, setPageLoading] = useState(true);
  const [quoteData, setQuoteData] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);

  // ── react-hook-form for CustomerForm ──────────────────────────────
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
  });

  const {
    selectedCustomer,
    setSelectedCustomer,
    isEasyPlugEnabled,
    setIsEasyPlugEnabled,
    easyPlugFiles,
    setEasyPlugFiles,
    easyPlugNotes,
    setEasyPlugNotes,
    isControllerEnabled,
    setIsControllerEnabled,
    controllerFiles,
    setControllerFiles,
    controllerNotes,
    setControllerNotes,
    products,
    setProducts,
    customProducts,
    setCustomProducts,
    annotationSections,
    setAnnotationSections,
    updateAnnotationSection,
    customerNotes,
    setCustomerNotes,
    adminNotes,
    setAdminNotes,
    discountPercent,
    setDiscountPercent,
    totalControllerPrice,
    totalLinearFeetPrice,
    calculateDiscount,
    calculateGST,
    calculateMainTotal,
  } = useQuoteForm();

  const [errors, setErrors] = useState({
    customer: "",
    products: [],
    customProducts: [],
    annotations: {},
  });

  // ==================== FETCH EDIT DATA ====================
  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);

        const data = await getEditQuote(id);

        console.log(data, "data");
        const { quote, products: apiProducts, colors } = data;

        setQuoteData(quote);

        // ✅ Set color options for annotation dropdowns
        setColorOptions(
          colors.map((c) => ({ value: c.color_name, label: c.color_name })),
        );

        // ✅ Pre-fill CustomerForm — all fields are editable
        methods.reset({
          firstName: quote.fname || "",
          lastName: quote.lname || "",
          email: quote.email || "",
          phoneNumber: quote.phone || "",
          street: quote.address || "",
          city: quote.city || "",
          postCode: quote.post_code || "",
          province: quote.state || "",
          country: quote.country || "",
        });

        // ✅ Keep selectedCustomer in sync for GST calculation
        setSelectedCustomer({
          cust_id: quote.user_id,
          fname: quote.fname || "",
          lname: quote.lname || "",
          email: quote.email || "",
          phone: quote.phone || "",
          address: quote.address || "",
          city: quote.city || "",
          state: quote.state || "",
          country: quote.country || "",
          post_code: quote.post_code || "",
          gst: parseFloat(quote.gst_percentage) || 5,
        });

        // ✅ Map API products — pre-fill qty/amount/option from saved product_data
        const savedProducts = JSON.parse(quote.product_data || "[]");
        console.log(savedProducts, "savedProducts");
        const mappedProducts = apiProducts.map((p) => {
          const saved = savedProducts.find(
            (s) => String(s.product_id) === String(p.product_id),
          );
          return {
            id: p.product_id,
            name: p.product_title,
            quantity: saved ? saved.qty : "0",
            amount: saved ? parseFloat(saved.amount).toFixed(2) : "0.00",
            option: saved
              ? saved.required === "Mandatory"
                ? "mandatory"
                : "optional"
              : "mandatory",
            price: p.price,
          };
        });
        setProducts(mappedProducts);

        // ✅ Map custom products
        const savedCustom = JSON.parse(quote.custom_product_data || "[]");
        if (savedCustom.length > 0) {
          const mappedCustom = savedCustom.map((c, i) => ({
            id: Date.now() + i,
            description: c.product || "",
            quantity: c.qty || "",
            unitPrice: c.unit_price || "",
            amount: c.amount || "",
            option: c.required === "Mandatory" ? "mandatory" : "optional",
          }));
          setCustomProducts(mappedCustom);
        }

        // ✅ Set notes & discount
        setCustomerNotes(quote.notes || "");
        setAdminNotes(quote.adminnotes || "");
        setDiscountPercent(quote.discount_percentage || 0);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load quote");
        navigate("/quote");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  // ==================== PRODUCT HANDLERS ====================
  const handleProductChange = (index, updatedProduct) => {
    const updated = [...products];
    updated[index] = updatedProduct;
    setProducts(updated);
    setErrors((prev) => {
      const updatedProductErrors = [...(prev.products || [])];
      updatedProductErrors[index] = { quantity: "", option: "" };
      return { ...prev, products: updatedProductErrors };
    });
  };

  const handleCustomProductChange = (index, updatedProduct) => {
    const updated = [...customProducts];
    updated[index] = updatedProduct;
    setCustomProducts(updated);
    setErrors((prev) => {
      const updatedErrors = [...(prev.customProducts || [])];
      updatedErrors[index] = { quantity: "", unitPrice: "" };
      return { ...prev, customProducts: updatedErrors };
    });
  };

  const handleAddCustomProduct = () => {
    setCustomProducts([
      ...customProducts,
      {
        id: Date.now(),
        description: "",
        quantity: "",
        unitPrice: "",
        amount: "",
        option: "mandatory",
      },
    ]);
  };

  const handleRemoveCustomProduct = (index) => {
    const updated = [...customProducts];
    updated.splice(index, 1);
    setCustomProducts(updated);
    setErrors((prev) => {
      const updatedErrors = [...(prev.customProducts || [])];
      updatedErrors.splice(index, 1);
      return { ...prev, customProducts: updatedErrors };
    });
  };

  // ==================== ANNOTATION HANDLERS ====================
  const handleAddAnnotationSection = () => {
    setAnnotationSections([
      ...annotationSections,
      {
        id: Date.now(),
        files: [{ file: null, preview: "", lineSaved: "", textSaved: "" }],
        formData: {
          identifyImageName: "",
          color: "",
          peaksCount: "",
          jumpersCount: "",
          sftCount: "",
          sqftSize: "",
          total: "",
          unitPrice: "",
          amount: "",
          action: "Mandatory",
        },
      },
    ]);
  };

  const handleRemoveAnnotationSection = (sectionId) => {
    if (annotationSections.length > 1) {
      setAnnotationSections(
        annotationSections.filter((s) => s.id !== sectionId),
      );
      setErrors((prev) => {
        const updated = { ...prev.annotations };
        delete updated[sectionId];
        return { ...prev, annotations: updated };
      });
    } else {
      alert("At least one annotation section must remain");
    }
  };

  const handleAnnotationErrorChange = (sectionId, field, message) => {
    setErrors((prev) => ({
      ...prev,
      annotations: {
        ...prev.annotations,
        [sectionId]: {
          ...prev.annotations[sectionId],
          [field]: message,
        },
      },
    }));
  };

  // ==================== VALIDATION ====================
  const validateQuote = () => {
    const nextErrors = {
      customer: "",
      products: [],
      customProducts: [],
      annotations: {},
    };

    const atLeastOneProduct = products.some(
      (p) => (parseInt(p?.quantity) || 0) > 0,
    );

    nextErrors.products = products.map((product) => {
      const qty = parseInt(product?.quantity) || 0;
      return {
        quantity: atLeastOneProduct ? "" : "Quantity is required",
        option:
          qty > 0 &&
          (!product?.option ||
            !["mandatory", "optional"].includes(product.option.toLowerCase()))
            ? "Action is required"
            : "",
      };
    });

    if (customProducts.length > 0) {
      nextErrors.customProducts = customProducts.map((product) => ({
        quantity:
          (parseFloat(product?.quantity) || 0) > 0
            ? ""
            : "Quantity is required",
        unitPrice:
          (parseFloat(product?.unitPrice) || 0) > 0
            ? ""
            : "Unit Price is required",
      }));
    }

    annotationSections.forEach((section) => {
      const fd = section?.formData || {};
      nextErrors.annotations[section.id] = {
        color: fd.color ? "" : "Color is required",
        unitPrice:
          (parseFloat(fd.unitPrice) || 0) > 0 ? "" : "Unit Price is required",
        action:
          fd.action && ["Mandatory", "Optional"].includes(fd.action)
            ? ""
            : "Action is required",
      };
    });

    setErrors(nextErrors);

    const hasErrors =
      !!nextErrors.customer ||
      nextErrors.products.every((e) => e?.quantity) ||
      nextErrors.products.some((e) => e?.option) ||
      nextErrors.customProducts.some((e) => e?.quantity || e?.unitPrice) ||
      Object.values(nextErrors.annotations).some(
        (e) => e?.color || e?.unitPrice || e?.action,
      );

    return !hasErrors;
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async () => {
    // ✅ Validate CustomerForm fields first
    const isCustomerValid = await methods.trigger();
    if (!isCustomerValid) {
      toast.error("Please fix customer form errors");
      return;
    }

    const ok = validateQuote();
    if (!ok) return;

    // ✅ Read latest values from CustomerForm inputs
    const formValues = methods.getValues();

    const toCurrencyString = (v) => Number(v || 0).toFixed(2);
    const requiredFlag = (opt) =>
      opt && String(opt).toLowerCase() === "mandatory" ? "yes" : "no";
    const dataUrlToFile = (dataUrl, filename = "image.png") => {
      try {
        const arr = String(dataUrl).split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1] || "");
        let n = bstr.length;
        const u8 = new Uint8Array(n);
        while (n--) u8[n] = bstr.charCodeAt(n);
        return new File([new Blob([u8], { type: mime })], filename, {
          type: mime,
        });
      } catch {
        return null;
      }
    };

    const formData = new FormData();

    // ✅ quote_id required for update
    formData.append("quote_id", String(quoteData?.quote_id ?? ""));
    formData.append("user_id", String(user?.user_id ?? ""));

    // ✅ Customer fields from editable form
    formData.append("fname", formValues.firstName || "");
    formData.append("lname", formValues.lastName || "");
    formData.append("email", formValues.email || "");
    formData.append("phone", formValues.phoneNumber || "");
    formData.append("street", formValues.street || "");
    formData.append("city", formValues.city || "");
    formData.append("state", formValues.province || "");
    formData.append("country", formValues.country || "");
    formData.append("post_code", formValues.postCode || "");

    formData.append(
      "total_controller_price",
      toCurrencyString(totalControllerPrice),
    );
    formData.append("total_feet_price", toCurrencyString(totalLinearFeetPrice));
    formData.append("discount_percentage", String(discountPercent || 0));
    formData.append("gst_percentage", String(selectedCustomer?.gst || 0));
    formData.append("gst", toCurrencyString(calculateGST()));
    formData.append("main_total", toCurrencyString(calculateMainTotal()));
    formData.append("notes", String(customerNotes || ""));
    formData.append("adminnotes", String(adminNotes || ""));

    const productPayload = (products || [])
      .filter((p) => Number(p.quantity) > 0)
      .map((p) => ({
        product_id: String(p.id || ""),
        product: String(p.name || ""),
        qty: String(p.quantity || "0"),
        amount: toCurrencyString(p.amount),
        required: requiredFlag(p.option),
      }));
    formData.append("product_data", JSON.stringify(productPayload));

    const customPayload = (customProducts || [])
      .filter((p) => Number(p.quantity) > 0 && Number(p.unitPrice) > 0)
      .map((p) => ({
        product: String(p.description || ""),
        qty: String(p.quantity || "0"),
        unit_price: toCurrencyString(p.unitPrice),
        amount: toCurrencyString(
          Number(p.quantity || 0) * Number(p.unitPrice || 0),
        ),
        required: requiredFlag(p.option),
      }));
    formData.append("custom_product_data", JSON.stringify(customPayload));

    const annotationPayload = (annotationSections || []).map((section, idx) => {
      const fd = section?.formData || {};
      const identify =
        String(fd?.identifyImageName?.trim() || "") ||
        section?.files?.[0]?.file?.name ||
        `annotation_${idx + 1}`;
      return {
        identify_image_name: identify,
        sft_count: Number(fd.sftCount || 0),
        divide: Number(fd.sqftSize || 0),
        total_numerical_box: Number(fd.total || 0),
        unit_price: Number(fd.unitPrice || 0),
        total_amount: Number(fd.amount || 0),
        no_peaks: Number(fd.peaksCount || 0),
        no_jumper: Number(fd.jumpersCount || 0),
        color: String(fd.color || ""),
        required: requiredFlag(fd.action),
      };
    });
    formData.append("annotation_data", JSON.stringify(annotationPayload));

    (annotationSections || []).forEach((section, nIdx) => {
      const N = nIdx + 1;
      (section.files || []).forEach((f, jIdx) => {
        const drawn =
          typeof f?.lineSaved === "string"
            ? dataUrlToFile(f.lineSaved, `preview_${N}_${jIdx}.png`)
            : null;
        if (drawn) formData.append(`preview-image_${N}_${jIdx}`, drawn);

        const edited =
          typeof f?.textSaved === "string"
            ? dataUrlToFile(f.textSaved, `edited_${N}_${jIdx}.png`)
            : null;
        if (edited) formData.append(`preview-image-edit_${N}_${jIdx}`, edited);
      });
    });

    try {
      const result = await updateQuote(formData);
      toast.success(result?.message || "Quote updated successfully.");
      navigate("/quote");
    } catch (e) {
      toast.error(e.message || "Failed to update quote");
    }
  };

  // ==================== LOADING ====================
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="text-gray-500 text-lg">Loading quote...</span>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <Card title="Edit Quote">
      <form>
        <div className="space-y-8">
          {/* ==================== CUSTOMER FORM — fully editable ==================== */}
          <CustomerForm
            methods={methods}
            title="Customer Info"
            submitText=""
            onSubmit={() => {}}
            hideActions={true}
          />

          {/* ==================== IMAGE DETAILS ==================== */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Image Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <ImageUploadWithToggle
                title="Easy plug access"
                isEnabled={isEasyPlugEnabled}
                onToggle={() => setIsEasyPlugEnabled(!isEasyPlugEnabled)}
                files={easyPlugFiles}
                onFilesChange={setEasyPlugFiles}
                notes={easyPlugNotes}
                onNotesChange={setEasyPlugNotes}
              />
              <ImageUploadWithToggle
                title="Controller access"
                isEnabled={isControllerEnabled}
                onToggle={() => setIsControllerEnabled(!isControllerEnabled)}
                files={controllerFiles}
                onFilesChange={setControllerFiles}
                notes={controllerNotes}
                onNotesChange={setControllerNotes}
              />
            </div>
          </div>

          {/* ==================== PRODUCTS ==================== */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Products</h2>

            <div className="hidden md:grid md:grid-cols-4 gap-4 text-sm font-medium text-gray-600">
              <div>Product</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Option</div>
            </div>

            {products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                onChange={(updated) => handleProductChange(index, updated)}
                errors={errors.products?.[index]}
                onErrorChange={(field, message) => {
                  setErrors((prev) => {
                    const updatedProducts = [...(prev.products || [])];
                    updatedProducts[index] = {
                      ...updatedProducts[index],
                      [field]: message,
                    };
                    return { ...prev, products: updatedProducts };
                  });
                }}
              />
            ))}

            {customProducts.length > 0 && (
              <div className="hidden md:grid md:grid-cols-12 gap-4 mt-6 text-sm font-medium text-gray-600">
                <div className="col-span-3">Product Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-3">Actions</div>
              </div>
            )}

            {customProducts.map((product, index) => (
              <CustomProductRow
                key={product.id}
                product={product}
                onChange={(updated) =>
                  handleCustomProductChange(index, updated)
                }
                onRemove={() => handleRemoveCustomProduct(index)}
                errors={errors.customProducts?.[index]}
                onErrorChange={(field, message) => {
                  setErrors((prev) => {
                    const updatedErrors = [...(prev.customProducts || [])];
                    updatedErrors[index] = {
                      ...updatedErrors[index],
                      [field]: message,
                    };
                    return { ...prev, customProducts: updatedErrors };
                  });
                }}
              />
            ))}

            <Button
              text="Custom product +"
              className="btn-primary btn-sm"
              onClick={handleAddCustomProduct}
              type="button"
            />
          </div>

          {/* ==================== ANNOTATION SECTIONS ==================== */}
          <div className="space-y-4">
            {annotationSections.map((section) => (
              <div
                key={section.id}
                className="bg-indigo-500/10 p-6 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Annotation Section
                </h3>
                <AnnotationImagePreview
                  sectionId={section.id}
                  onRemoveSection={handleRemoveAnnotationSection}
                  files={section.files}
                  formData={section.formData}
                  onFilesChange={(updatedFiles) =>
                    updateAnnotationSection(section.id, { files: updatedFiles })
                  }
                  onFormDataChange={(updatedFormData) =>
                    updateAnnotationSection(section.id, {
                      formData: updatedFormData,
                    })
                  }
                  errors={errors.annotations?.[section.id]}
                  onErrorChange={(field, message) =>
                    handleAnnotationErrorChange(section.id, field, message)
                  }
                  colorOptions={colorOptions}
                />
              </div>
            ))}

            <Button
              text="Add New File Section +"
              className="btn-primary btn-sm"
              onClick={handleAddAnnotationSection}
              type="button"
            />
          </div>

          {/* ==================== NOTES ==================== */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Notes
              </label>
              <Textarea
                placeholder="Enter customer notes..."
                rows={5}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Admin Notes
              </label>
              <Textarea
                placeholder="Enter admin notes..."
                rows={5}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* ==================== DISCOUNT ==================== */}
          <div className="flex justify-end">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-2 text-right">
                Enter Discount (%):
              </label>
              <Textinput
                type="text"
                placeholder="0"
                value={discountPercent}
                onChange={(e) =>
                  setDiscountPercent(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="text-right"
              />
            </div>
          </div>

          {/* ==================== SUBMIT & SUMMARY ==================== */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <Button
              text="Update Quote"
              icon="ph:check-circle"
              className="btn-outline-primary"
              onClick={handleSubmit}
              type="button"
            />
            <PriceSummary
              totalControllerPrice={totalControllerPrice}
              totalLinearFeetPrice={totalLinearFeetPrice}
              discountPercent={discountPercent}
              discountAmount={calculateDiscount()}
              gstAmount={calculateGST()}
              gstRate={selectedCustomer?.gst || 0}
              mainTotal={calculateMainTotal()}
            />
          </div>
        </div>
      </form>
    </Card>
  );
};

export default EditQuote;
