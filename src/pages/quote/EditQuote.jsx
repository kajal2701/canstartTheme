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
import { editQuote, getEditQuote } from "../../services/quoteService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomerForm from "../customer/CustomerForm";
import { getImgSrc } from "../../utils/formatters";

const EditQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pageLoading, setPageLoading] = useState(true);
  const [quoteData, setQuoteData] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);

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
        const { quote, products: apiProducts, colors } = data;

        setQuoteData(quote);

        // ── Color options ──
        setColorOptions(
          colors.map((c) => ({ value: c.color_name, label: c.color_name })),
        );

        // ── CustomerForm prefill ──
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

        // ── selectedCustomer for GST ──
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

        // ── Products ──
        const savedProducts = JSON.parse(quote.product_data || "[]");
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

        // ── Custom products ──
        const savedCustom = Array.isArray(quote.custom_product_data)
          ? quote.custom_product_data
          : JSON.parse(quote.custom_product_data || "[]");

        if (savedCustom.length > 0) {
          setCustomProducts(
            savedCustom.map((c, i) => ({
              id: Date.now() + i,
              description: c.product || "",
              quantity: c.qty || "",
              unitPrice: c.unit_price || "",
              amount: c.amount || "",
              option: c.required === "Mandatory" ? "mandatory" : "optional",
            })),
          );
        }

        // ── Annotation sections — prefill from API including existing images ──
        if (quote.annotation_image?.length > 0) {
          const mappedSections = quote.annotation_image.map((ann) => {
            // Separate drawnLines and fullyEdited images
            const drawnImages =
              ann.images?.filter((img) => img.type === "drawnLines") || [];
            const editedImages =
              ann.images?.filter((img) => img.type === "fullyEdited") || [];

            // Build files array — pair drawnLines with fullyEdited by index
            const maxLen = Math.max(drawnImages.length, editedImages.length, 1);
            const files = Array.from({ length: maxLen }, (_, i) => ({
              file: null,
              preview: drawnImages[i]
                ? getImgSrc(drawnImages[i].image_url)
                : "",
              lineSaved: drawnImages[i]
                ? getImgSrc(drawnImages[i].image_url)
                : "",
              textSaved: editedImages[i]
                ? getImgSrc(editedImages[i].image_url)
                : "",
              // Keep existing image IDs for backend reference
              existingDrawnImageId: drawnImages[i]?.image_id ?? null,
              existingEditedImageId: editedImages[i]?.image_id ?? null,
              textSum: i === 0 ? Number(ann.sft_count || 0) : 0,
            }));

            return {
              id: ann.annotation_image_id,
              files,
              formData: {
                identifyImageName: ann.identify_image_name || "",
                color: ann.color || "",
                peaksCount: String(ann.no_peaks || "0"),
                jumpersCount: String(ann.no_jumper || "0"),
                sftCount: String(ann.sft_count || ""),
                sqftSize: String(ann.divide || ""),
                total: String(ann.total_numerical_box || ""),
                unitPrice: String(ann.unit_price || ""),
                amount: String(ann.total_amount || ""),
                action:
                  ann.required === "yes" || ann.required === "Mandatory"
                    ? "Mandatory"
                    : "Optional",
              },
            };
          });
          setAnnotationSections(mappedSections);
        }

        // ── Notes & discount ──
        setCustomerNotes(quote.notes || "");
        setAdminNotes(quote.adminnotes || "");
        setDiscountPercent(quote.discount_percentage || 0);

        // ── Easy plug / Controller access images ──
        if (quote.access_image_plug) {
          setIsEasyPlugEnabled(true);
          setEasyPlugFiles([
            {
              file: null,
              preview: getImgSrc(quote.access_image_plug),
            },
          ]);
        }
        if (quote.access_image_controller) {
          setIsControllerEnabled(true);
          setControllerFiles([
            {
              file: null,
              preview: getImgSrc(quote.access_image_controller),
            },
          ]);
        }
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
        [sectionId]: { ...prev.annotations[sectionId], [field]: message },
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
    const isCustomerValid = await methods.trigger();
    if (!isCustomerValid) {
      toast.error("Please fix customer form errors");
      return;
    }

    const ok = validateQuote();
    if (!ok) return;

    const formValues = methods.getValues();

    const toCurrencyString = (v) => Number(v || 0).toFixed(2);
    const requiredFlag = (opt) =>
      opt && String(opt).toLowerCase() === "mandatory" ? "yes" : "no";

    const dataUrlToFile = (dataUrl, filename = "image.png") => {
      try {
        // Skip existing remote URLs
        if (typeof dataUrl === "string" && dataUrl.startsWith("http"))
          return null;
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

    const isRemoteUrl = (url) =>
      typeof url === "string" &&
      (url.startsWith("http") || url.startsWith("/"));

    const formData = new FormData();

    formData.append("quote_id", String(quoteData?.quote_id ?? ""));
    formData.append("user_id", String(user?.user_id ?? ""));
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

    // ── Products ──
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

    // ── Custom products ──
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

    // ── Annotation data — include existing_images so backend keeps them ──
    const annotationPayload = (annotationSections || []).map((section, idx) => {
      const fd = section?.formData || {};
      const identify =
        String(fd?.identifyImageName?.trim() || "") ||
        section?.files?.[0]?.file?.name ||
        `annotation_${idx + 1}`;

      // ── Collect existing remote image URLs to tell backend to keep them ──
      const existing_images = [];
      (section.files || []).forEach((f) => {
        if (f.lineSaved && isRemoteUrl(f.lineSaved)) {
          // Extract relative path from full URL e.g. http://localhost/uploads/xxx.jpg → uploads/xxx.jpg
          const url = f.lineSaved.includes("/uploads/")
            ? "uploads/" + f.lineSaved.split("/uploads/")[1]
            : f.lineSaved;
          existing_images.push({ image_url: url, type: "drawnLines" });
        }
        if (f.textSaved && isRemoteUrl(f.textSaved)) {
          const url = f.textSaved.includes("/uploads/")
            ? "uploads/" + f.textSaved.split("/uploads/")[1]
            : f.textSaved;
          existing_images.push({ image_url: url, type: "fullyEdited" });
        }
      });

      return {
        // Send existing annotation_image_id so backend UPDATEs instead of INSERTs
        annotation_image_id:
          typeof section.id === "number" && section.id < 1e12
            ? section.id
            : null,
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
        existing_images, // ← backend uses this to keep existing images
      };
    });
    formData.append("annotation_data", JSON.stringify(annotationPayload));

    // ── Only append NEW images (skip existing remote URLs) ──
    (annotationSections || []).forEach((section, nIdx) => {
      const N = nIdx + 1;
      (section.files || []).forEach((f, jIdx) => {
        // drawnLines — only if new base64
        if (f.lineSaved && !isRemoteUrl(f.lineSaved)) {
          const drawn = dataUrlToFile(f.lineSaved, `preview_${N}_${jIdx}.jpg`);
          if (drawn) formData.append(`preview-image_${N}_${jIdx}`, drawn);
        }
        // fullyEdited — only if new base64
        if (f.textSaved && !isRemoteUrl(f.textSaved)) {
          const edited = dataUrlToFile(f.textSaved, `edited_${N}_${jIdx}.jpg`);
          if (edited)
            formData.append(`preview-image-edit_${N}_${jIdx}`, edited);
        }
      });
    });

    try {
      const result = await editQuote(formData);
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
          <CustomerForm
            methods={methods}
            title="Customer Info"
            submitText=""
            onSubmit={() => {}}
            hideActions={true}
          />

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
