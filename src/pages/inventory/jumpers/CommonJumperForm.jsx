import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import InputNumber from "@/components/ui/InputNumber";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { JUMPER_TYPES } from "@/utils/constants";
import { calculateTotalPrice } from "@/utils/helperFunctions";

const CommonJumperForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
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

  // Auto-calculate total price
  useEffect(() => {
    const total = calculateTotalPrice(formData.quantity, formData.pricePerUnit);
    setFormData((prev) => ({
      ...prev,
      totalPrice: total,
    }));
  }, [formData.quantity, formData.pricePerUnit]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};

    if (!formData.type) e.type = "Type is required";

    if (!formData.quantity || !String(formData.quantity).trim()) e.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) e.quantity = "Quantity must be greater than 0";

    if (!formData.pricePerUnit) e.pricePerUnit = "Price per unit is required";
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
      else { toast.success(`Jumper ${isEdit ? "updated" : "added"}!`); navigate("/inventory/jumpers"); }
    } catch { toast.error(`Failed to ${isEdit ? "update" : "add"} jumper`); }
    finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { onCancel ? onCancel() : navigate("/inventory/jumpers"); };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button text="Back to Jumpers" icon="ph:arrow-left" className="btn-outline-primary" onClick={handleCancel} />
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
              <Select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)}
                options={JUMPER_TYPES} placeholder="Select Type" error={errors.type} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <Textinput value={formData.supplier} onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Enter supplier (optional)" error={errors.supplier} />
            </div>
            <div>
              <InputNumber label="Quantity *" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity" error={errors.quantity} min="0" noDecimal={true} />
            </div>
            <div>
              <InputNumber label="Price Per Unit *" value={formData.pricePerUnit} onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
                placeholder="Enter price per unit" error={errors.pricePerUnit} min="0" />
            </div>
            <div>
              <InputNumber label="Total Price" value={formData.totalPrice} onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                placeholder="0.00" disabled />
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

export default CommonJumperForm;
