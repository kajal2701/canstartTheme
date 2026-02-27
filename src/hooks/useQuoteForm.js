// hooks/useQuoteForm.js
import { useEffect, useMemo, useState } from "react";

export const useQuoteForm = () => {
  // Customer selection
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Image details - Easy Plug
  const [isEasyPlugEnabled, setIsEasyPlugEnabled] = useState(true);
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

  // Notes
  const [customerNotes, setCustomerNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Pricing
  const [discountPercent, setDiscountPercent] = useState(0);
  // const [totalLinearFeetPrice, setTotalLinearFeetPrice] = useState(0);

  console.log(annotationSections, "annotationSections")

  // calculate the controller price
  const totalControllerPrice = useMemo(() => {
    const allProducts = [...products, ...customProducts];

    return allProducts.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
  }, [products, customProducts]);

  // calculate linear feet price
  const totalLinearFeetPrice = useMemo(() => {
    return annotationSections.reduce((sum, item) => {
      return sum + (parseFloat(item.formData.amount) || 0);
    }, 0);
  }, [annotationSections])


  // Add a handler to update a specific section's data
  const updateAnnotationSection = (sectionId, updatedData) => {
    console.log(updatedData, "updatdata")
    setAnnotationSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, ...updatedData }
          : section
      )
    )
  };


  // Calculated values
  const calculateDiscount = () => {
    const subtotal = totalControllerPrice + totalLinearFeetPrice;
    return (subtotal * discountPercent) / 100;
  };

  const calculateGST = () => {
    const subtotal = totalControllerPrice + totalLinearFeetPrice;
    const afterDiscount = subtotal - calculateDiscount();

    // ✅ Use GST from selected customer, fallback to 0 if not available
    const gstRate = parseFloat(selectedCustomer?.gst) || 0;

    return (afterDiscount * gstRate) / 100;
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
    // setTotalLinearFeetPrice,
    calculateDiscount,
    calculateGST,
    calculateMainTotal,
  };
};
