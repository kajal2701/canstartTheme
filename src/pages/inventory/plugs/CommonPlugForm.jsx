import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import InputNumber from "@/components/ui/InputNumber";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateTotalPrice } from "@/utils/helperFunctions";
import { PLUG_TYPES } from "@/utils/constants";

const CommonPlugForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({
    type: "",
    supplier: "",
    quantity: "",
    pricePerUnit: "",
    totalPrice: "",
    ...initialData
  }));
  const [errors, setErrors] = useState({});

  // Auto-calculate total price when quantity or pricePerUnit changes
  useEffect(() => {
    const total = calculateTotalPrice(formData.quantity, formData.pricePerUnit);
    setFormData((prev) => ({ ...prev, totalPrice: total }));
  }, [formData.quantity, formData.pricePerUnit]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.type) e.type = "Type is required";
    if (formData.quantity === "" || formData.quantity === null) e.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) e.quantity = "Quantity must be greater than 0";

    if (formData.pricePerUnit === "" || formData.pricePerUnit === null) e.pricePerUnit = "Price per unit is required";
    else if (isNaN(formData.pricePerUnit) || parseFloat(formData.pricePerUnit) <= 0) e.pricePerUnit = "Price per unit must be greater than 0";

    if (!formData.totalPrice) e.totalPrice = "Total price is required";
    else if (isNaN(formData.totalPrice) || parseFloat(formData.totalPrice) < 0) e.totalPrice = "Enter a valid total price";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(formData);
      else { toast.success(`Plug ${isEdit ? "updated" : "added"}!`); navigate("/inventory/plugs"); }
    } catch { toast.error(`Failed to ${isEdit ? "update" : "add"} plug`); }
    finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { onCancel ? onCancel() : navigate("/inventory/plugs"); };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button text="Back to Plugs" icon="ph:arrow-left" className="btn-outline-primary" onClick={handleCancel} />
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
              <Select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)}
                options={PLUG_TYPES} placeholder="Select Type" error={errors.type} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <Textinput type="text" value={formData.supplier} onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Enter supplier (optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
              <InputNumber value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity" error={errors.quantity} step="1" noDecimal />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Unit ($)<span className="text-red-500">*</span></label>
              <InputNumber value={formData.pricePerUnit} onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
                placeholder="Enter price per unit" error={errors.pricePerUnit} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Price ($)<span className="text-red-500">*</span></label>
              <InputNumber value={formData.totalPrice} onChange={(e) => handleInputChange("totalPrice", e.target.value)} disabled={true}
                placeholder="Auto calculated" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <Button text="Cancel" className="btn-outline-dark" onClick={handleCancel} type="button" />
            <Button text={isSubmitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update" : "Add")}
              className="btn-primary" type="submit" disabled={isSubmitting} />
          </div>
        </form>
      </Card>
    </>
  );
};

export default CommonPlugForm;
