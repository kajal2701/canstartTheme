import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

import { useQuoteForm } from "@/hooks/useQuoteForm";
import ProductRow from "@/components/quote/ProductRow";
import CustomProductRow from "@/components/quote/CustomProductRow";
import AnnotationImagePreview from "@/components/quote/AnnotationImagePreview";
import PriceSummary from "@/components/quote/PriceSummary";
import ImageUploadWithToggle from "../../components/quote/imageUploadWithToggle/Index";
import { getCustomers } from "../../services/customersService";
import { getProductsData, addQuote } from "../../services/quoteService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const {
    // Customer
    selectedCustomer,
    setSelectedCustomer,

    // Easy Plug
    isEasyPlugEnabled,
    setIsEasyPlugEnabled,
    easyPlugFiles,
    setEasyPlugFiles,
    easyPlugNotes,
    setEasyPlugNotes,

    // Controller
    isControllerEnabled,
    setIsControllerEnabled,
    controllerFiles,
    setControllerFiles,
    controllerNotes,
    setControllerNotes,

    // Products
    products,
    setProducts,
    customProducts,
    setCustomProducts,

    // Annotation
    annotationSections,
    setAnnotationSections,
    updateAnnotationSection,

    // Notes
    customerNotes,
    setCustomerNotes,
    adminNotes,
    setAdminNotes,

    // Pricing
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

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const customerData = await getCustomers();
        setCustomers(customerData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const productData = await getProductsData();
        const formatted = productData.map((product) => ({
          id: product.product_id,
          name: product.product_title,
          quantity: "",
          amount: "0.00",
          option: "mandatory",
          price: product.price,
        }));
        setProducts(formatted);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ==================== CUSTOMER HANDLER ====================
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selected = customers.find(
      (cust) => cust.cust_id.toString() === customerId,
    );
    setSelectedCustomer(selected || null);

    // Clear customer error on change
    setErrors((prev) => ({ ...prev, customer: "" }));
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleProductChange = (index, updatedProduct) => {
    const updated = [...products];
    updated[index] = updatedProduct;
    setProducts(updated);

    // Clear error for this product on change
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

    // Clear error for this custom product on change
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

    // Remove error for removed row
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

  const handleRemoveAnnotationSection = (id) => {
    if (annotationSections.length > 1) {
      setAnnotationSections(
        annotationSections.filter((section) => section.id !== id),
      );
      // Clear errors for removed section
      setErrors((prev) => {
        const updatedAnnotations = { ...prev.annotations };
        delete updatedAnnotations[id];
        return { ...prev, annotations: updatedAnnotations };
      });
    } else {
      alert("At least one annotation section must remain");
    }
  };

  // ==================== VALIDATION ====================
  const validateQuote = () => {
    const nextErrors = {
      customer: "",
      products: [],
      customProducts: [],
      annotations: {},
    };

    // 1. Customer — required
    if (!selectedCustomer || !selectedCustomer.cust_id) {
      nextErrors.customer = "Customer is required";
    }
    const atLeastOneProduct = products.some(
      (p) => (parseInt(p?.quantity) || 0) > 0,
    );

    // 2. Products — validate qty & action per row
    // NOTE: removed "products array empty" check — products always come from API
    nextErrors.products = products.map((product) => {
      const qty = parseInt(product?.quantity) || 0;

      return {
        // If at least one product in the whole list has qty > 0,
        // we don't show "Quantity is required" on any row.
        quantity: atLeastOneProduct ? "" : "Quantity is required",

        // Validation for Action: Only required if this specific row has a quantity
        option:
          qty > 0 &&
          (!product?.option ||
            !["mandatory", "optional"].includes(product.option.toLowerCase()))
            ? "Action is required"
            : "",
      };
    });

    // 3. Custom Products — validate qty & unit price only
    if (customProducts.length > 0) {
      nextErrors.customProducts = customProducts.map((product) => {
        return {
          quantity:
            (parseFloat(product?.quantity) || 0) > 0
              ? ""
              : "Quantity is required",
          unitPrice:
            (parseFloat(product?.unitPrice) || 0) > 0
              ? ""
              : "Unit Price is required",
        };
      });
    }

    // 4. Annotation Sections — validate color, unitPrice, action only
    // NOTE: removed "amount" validation — amount is auto-calculated
    annotationSections.forEach((section) => {
      const fd = section?.formData || {};
      nextErrors.annotations[section.id] = {
        color: fd.color ? "" : "Color is required",
        unitPrice:
          (parseFloat(fd.unitPrice) || 0) > 0 ? "" : "Unit Price is required",
        // ✅ amount removed — auto calculated from total × unitPrice
        action:
          fd.action && ["Mandatory", "Optional"].includes(fd.action)
            ? ""
            : "Action is required",
      };
    });

    setErrors(nextErrors);

    // 5. Check if any errors exist
    const hasErrors =
      !!nextErrors.customer ||
      // At least one product must have qty > 0
      nextErrors.products.every((e) => e?.quantity) ||
      // Any product row has an error
      nextErrors.products.some((e) => e?.option) ||
      // Any custom product has an error
      nextErrors.customProducts.some((e) => e?.quantity || e?.unitPrice) ||
      // Any annotation section has an error
      Object.values(nextErrors.annotations).some(
        (e) => e?.color || e?.unitPrice || e?.action,
      );

    return !hasErrors;
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
  // ==================== SUBMIT HANDLER ====================
  const handleSubmit = async () => {
    const ok = validateQuote();
    if (!ok) return;

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

    formData.append("user_id", String(user?.user_id ?? ""));
    formData.append("fname", String(selectedCustomer?.fname || ""));
    formData.append("lname", String(selectedCustomer?.lname || ""));
    formData.append("email", String(selectedCustomer?.email || ""));
    formData.append("phone", String(selectedCustomer?.phone || ""));
    formData.append("street", String(selectedCustomer?.address || ""));
    formData.append("city", String(selectedCustomer?.city || ""));
    formData.append("state", String(selectedCustomer?.state || ""));
    formData.append("country", String(selectedCustomer?.country || ""));
    formData.append("post_code", String(selectedCustomer?.post_code || ""));

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
        section?.files?.[0]?.preview?.name ||
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
        if (drawn) {
          formData.append(`preview-image_${N}_${jIdx}`, drawn);
        }
        const edited =
          typeof f?.textSaved === "string"
            ? dataUrlToFile(f.textSaved, `edited_${N}_${jIdx}.png`)
            : null;
        if (edited) {
          formData.append(`preview-image-edit_${N}_${jIdx}`, edited);
        }
      });
    });

    try {
      const result = await addQuote(formData);
      toast.success(result?.message || "Quote added successful.");
    } catch (e) {
      toast.error(e.message || "Failed to add quote");
    }
  };

  // Format customers for select
  const customerOptions = customers
    .filter((customer) => customer && customer.cust_id)
    .map((customer) => ({
      value: customer.cust_id,
      label: `${customer.fname || ""} ${customer.lname || ""} (${customer.email || "No email"})`,
    }));

  return (
    <Card title="Add Quote">
      <form>
        <div className="space-y-8">
          {/* ==================== CUSTOMER SELECTION ==================== */}
          <div className="space-y-3">
            <label className="block font-medium text-gray-700">Customer</label>
            <Select
              className="react-select"
              classNamePrefix="select"
              options={customerOptions}
              value={selectedCustomer?.cust_id || ""}
              onChange={handleCustomerChange}
              placeholder={
                customersLoading ? "Loading customers..." : "Select Customer"
              }
              disabled={customersLoading}
            />
            {/* Customer Error */}
            {errors.customer && (
              <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
            )}
          </div>

          {/* ==================== IMAGE DETAILS ==================== */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Image Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Easy Plug Section */}
              <ImageUploadWithToggle
                title="Easy plug access"
                isEnabled={isEasyPlugEnabled}
                onToggle={() => setIsEasyPlugEnabled(!isEasyPlugEnabled)}
                files={easyPlugFiles}
                onFilesChange={setEasyPlugFiles}
                notes={easyPlugNotes}
                onNotesChange={setEasyPlugNotes}
              />

              {/* Controller Section */}
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

            {/* Loading state */}
            {productsLoading ? (
              <div className="text-center py-4">
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="hidden md:grid md:grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                  <div>Product</div>
                  <div>Quantity</div>
                  <div>Amount</div>
                  <div>Option</div>
                </div>

                {/* Fixed Products from API */}
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

                {/* Custom Products Header — only show if custom products exist */}
                {customProducts.length > 0 && (
                  <div className="hidden md:grid md:grid-cols-12 gap-4 mt-6 text-sm font-medium text-gray-600">
                    <div className="col-span-3">Product Description</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                )}

                {/* Custom Product Rows */}
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

                {/* Add Custom Product Button */}
                <Button
                  text="Custom product +"
                  className="btn-primary btn-sm"
                  onClick={handleAddCustomProduct}
                  type="button"
                />
              </>
            )}
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
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setDiscountPercent(value);
                }}
                className="text-right"
              />
            </div>
          </div>

          {/* ==================== SUBMIT & SUMMARY ==================== */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <Button
              text="Submit"
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

export default AddQuote;
