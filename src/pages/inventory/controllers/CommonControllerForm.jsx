import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommonControllerForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({ type: "", boostBox: "", cost: "", price: "", ...initialData }));
  const [errors, setErrors] = useState({});

  const types = [
    { value: "350W", label: "350W" },
    { value: "600W", label: "600W" },
    { value: "1000W", label: "1000W" },
    { value: "1500W", label: "1500W" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.type) e.type = "Controller type is required";
    if (!formData.boostBox) e.boostBox = "Boost box is required";
    if (!formData.cost) e.cost = "Cost is required";
    if (!formData.price) e.price = "Price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(formData);
      else { toast.success(`Controller ${isEdit ? "updated" : "added"}!`); navigate("/inventory/controllers"); }
    } catch { toast.error(`Failed to ${isEdit ? "update" : "add"} controller`); }
    finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { onCancel ? onCancel() : navigate("/inventory/controllers"); };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button text="Back to Controllers" icon="ph:arrow-left" className="btn-outline-primary" onClick={handleCancel} />
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Controller Type <span className="text-red-500">*</span></label>
              <Select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)}
                options={types} placeholder="Select Type" error={errors.type} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Boost Box <span className="text-red-500">*</span></label>
              <Textinput type="number" value={formData.boostBox} onChange={(e) => handleInputChange("boostBox", e.target.value)}
                placeholder="Enter boost box value" error={errors.boostBox} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)<span className="text-red-500">*</span></label>
              <Textinput type="number" step="0.01" value={formData.cost} onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="Enter cost" error={errors.cost} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)<span className="text-red-500">*</span></label>
              <Textinput type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Enter price" error={errors.price} />
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

export default CommonControllerForm;
