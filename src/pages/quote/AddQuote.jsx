// pages/quotes/AddQuote.jsx
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
import { getProducts } from "../../services/productsService";

const AddQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [apiProducts, setApiProducts] = useState([]);
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
  const printFormData = () => {
    const formData = {
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
      products: {
        standard: products,
        custom: customProducts,
      },
      annotation: annotationSections,
      notes: {
        customer: customerNotes,
        admin: adminNotes,
      },
      pricing: {
        discountPercent,
        totalControllerPrice,
        totalLinearFeetPrice,
        discount: calculateDiscount(),
        gst: calculateGST(),
        mainTotal: calculateMainTotal(),
      },
    };

    console.log("Form Data:", formData);
    // Or use this for better formatting:
    // console.log("Form Data:", JSON.stringify(formData, null, 2));
  };

  // Call it whenever you need:
  printFormData();

  // ==================== PRODUCT HANDLERS ====================
  const handleProductChange = (index, updatedProduct) => {
    const updated = [...products];
    updated[index] = updatedProduct;
    setProducts(updated);
  };

  const handleCustomProductChange = (index, updatedProduct) => {
    const updated = [...customProducts];
    updated[index] = updatedProduct;
    setCustomProducts(updated);
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
    } else {
      alert("At least one annotation section must remain");
    }
  };

  // ==================== SUBMIT HANDLER ====================
  const handleSubmit = () => {
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

  // Fetch customers on component mount
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

  console.log(apiProducts, "apiProducts");
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const productData = await getProducts();

        const formatted = productData.map((product) => ({
          id: product.product_id,
          name: product.product_title,
          quantity: "",
          amount: "0.00",
          option: "mandatory",
          price: product.price,
        }));

        setProducts(formatted);
        setApiProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format customers for react-select
  const customerOptions = customers
    .filter((customer) => customer && customer.cust_id)
    .map((customer) => ({
      value: customer.cust_id,
      label: `${customer.fname || ""} ${customer.lname || ""} (${customer.email || "No email"})`,
    }));

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;

    const selected = customers.find(
      (cust) => cust.cust_id.toString() === customerId,
    );

    setSelectedCustomer(selected || null);
  };

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
            {productsLoading && (
              <div className="text-center py-4">
                <span className="text-gray-500">Loading products...</span>
              </div>
            )}

            {/* Products list */}
            {!productsLoading && (
              <>
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                  <div>Product</div>
                  <div>Quantity</div>
                  <div>Amount</div>
                  <div>Option</div>
                </div>

                {/* API Products */}
                {products.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onChange={(updated) => handleProductChange(index, updated)}
                  />
                ))}

                {customProducts.length > 0 && (
                  <div className="grid grid-cols-12 gap-4 mt-6 text-sm font-medium text-gray-600">
                    <div className="col-span-3">Product Description</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                )}

                {/* Custom Products */}
                {customProducts.map((product, index) => (
                  <CustomProductRow
                    key={product.id}
                    product={product}
                    onChange={(updated) =>
                      handleCustomProductChange(index, updated)
                    }
                    onRemove={() => handleRemoveCustomProduct(index)}
                  />
                ))}

                {/* Add Custom Product Button */}
                <Button
                  text="Custom product +"
                  className="btn-primary btn-sm"
                  onClick={handleAddCustomProduct}
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
                  files={section.files} // ← must pass this
                  formData={section.formData} // ← must pass this
                  onFilesChange={(updatedFiles) =>
                    updateAnnotationSection(section.id, { files: updatedFiles })
                  }
                  onFormDataChange={(updatedFormData) =>
                    updateAnnotationSection(section.id, {
                      formData: updatedFormData,
                    })
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
