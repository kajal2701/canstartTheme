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
import { getProductsData } from "../../services/quoteService";

const AddQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

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

    // 2. Products — validate qty & action per row
    // NOTE: removed "products array empty" check — products always come from API
    nextErrors.products = products.map((product) => {
      const qty = parseInt(product?.quantity) || 0;
      return {
        quantity: qty > 0 ? "" : "Quantity is required",
        option:
          product?.option && ["mandatory", "optional"].includes(product.option)
            ? ""
            : "Action is required",
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
  const handleSubmit = () => {
    const ok = validateQuote();
    if (!ok) return;

    const quoteData = {
      customer: selectedCustomer,
      easyPlug: {
        enabled: isEasyPlugEnabled,
        files: easyPlugFiles,
        notes: easyPlugNotes,
      },
      controller: {
        enabled: isControllerEnabled,
        files: controllerFiles,
        notes: controllerNotes,
      },
      products,
      customProducts,
      annotationSections,
      customerNotes,
      adminNotes,
      discount: discountPercent,
      pricing: {
        totalControllerPrice,
        totalLinearFeetPrice,
        discount: calculateDiscount(),
        gst: calculateGST(),
        mainTotal: calculateMainTotal(),
      },
    };

    console.log("Quote Data:", quoteData);
    // TODO: Submit to API
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
