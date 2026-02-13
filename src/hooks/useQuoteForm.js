// hooks/useQuoteForm.js
import { useState } from "react";

export const useQuoteForm = () => {
  // Customer selection
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Image details - Easy Plug
  const [isEasyPlugEnabled, setIsEasyPlugEnabled] = useState(false);
  const [easyPlugFiles, setEasyPlugFiles] = useState([{ id: Date.now() }]);
  const [easyPlugNotes, setEasyPlugNotes] = useState("");

  // Image details - Controller
  const [isControllerEnabled, setIsControllerEnabled] = useState(true);
  const [controllerFiles, setControllerFiles] = useState([{ id: Date.now() }]);
  const [controllerNotes, setControllerNotes] = useState("");

  // Products
  const [products, setProducts] = useState([
    {
      id: "p1",
      name: "Product One",
      quantity: 0,
      amount: 0,
      option: "mandatory",
    },
    {
      id: "p2",
      name: "Product Two",
      quantity: 0,
      amount: 0,
      option: "mandatory",
    },
  ]);

  // Custom Products
  const [customProducts, setCustomProducts] = useState([]);

  // Annotation Sections
  const [annotationSections, setAnnotationSections] = useState([
    { id: Date.now() },
  ]);

  // Notes
  const [customerNotes, setCustomerNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Pricing
  const [discountPercent, setDiscountPercent] = useState(0);
  const [totalControllerPrice, setTotalControllerPrice] = useState(0);
  const [totalLinearFeetPrice, setTotalLinearFeetPrice] = useState(0);

  // Calculated values
  const calculateDiscount = () => {
    const subtotal = totalControllerPrice + totalLinearFeetPrice;
    return (subtotal * discountPercent) / 100;
  };

  const calculateGST = () => {
    const subtotal = totalControllerPrice + totalLinearFeetPrice;
    const afterDiscount = subtotal - calculateDiscount();
    return afterDiscount * 0.0; // Assuming 0% GST, change as needed
  };

  const calculateMainTotal = () => {
    const subtotal = totalControllerPrice + totalLinearFeetPrice;
    const discount = calculateDiscount();
    const gst = calculateGST();
    return subtotal - discount + gst;
  };

  return {
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

    // Notes
    customerNotes,
    setCustomerNotes,
    adminNotes,
    setAdminNotes,

    // Pricing
    discountPercent,
    setDiscountPercent,
    totalControllerPrice,
    setTotalControllerPrice,
    totalLinearFeetPrice,
    setTotalLinearFeetPrice,
    calculateDiscount,
    calculateGST,
    calculateMainTotal,
  };
};
