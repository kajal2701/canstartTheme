import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommonScrewForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => ({
    color: "", quantity: "", cost: "", price: "",
    ...initialData,
  }));
  const [errors, setErrors] = useState({});

  const colors = [
    { value: "Silver", label: "Silver" },
    { value: "Black", label: "Black" },
    { value: "Gold", label: "Gold" },
    { value: "Bronze", label: "Bronze" },
    { value: "White", label: "White" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.cost) newErrors.cost = "Cost is required";
    if (!formData.price) newErrors.price = "Price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(formData);
      else { toast.success(`Screw ${isEdit ? "updated" : "added"} successfully!`); navigate("/inventory/screws"); }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "add"} screw`);
    } finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { onCancel ? onCancel() : navigate("/inventory/screws"); };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button text="Back to Screws" icon="ph:arrow-left" className="btn-outline-primary" onClick={handleCancel} />
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color <span className="text-red-500">*</span></label>
              <Select value={formData.color} onChange={(e) => handleInputChange("color", e.target.value)}
                options={colors} placeholder="Select Color" error={errors.color} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
              <Textinput type="number" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity" error={errors.quantity} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)<span className="text-red-500">*</span></label>
              <Textinput type="number" step="0.01" value={formData.cost} onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="Enter cost per unit" error={errors.cost} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)<span className="text-red-500">*</span></label>
              <Textinput type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Enter selling price" error={errors.price} />
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

export default CommonScrewForm;
