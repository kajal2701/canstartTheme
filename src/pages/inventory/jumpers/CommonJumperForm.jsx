import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommonJumperForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({ type: "", quantity: "", notes: "", ...initialData }));
  const [errors, setErrors] = useState({});

  const types = [
    { value: "LED Jumpers", label: "LED Jumpers" },
    { value: "RGB Jumpers", label: "RGB Jumpers" },
    { value: "Extension Jumpers", label: "Extension Jumpers" },
    { value: "Connector Jumpers", label: "Connector Jumpers" },
    { value: "Adapter Jumpers", label: "Adapter Jumpers" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.type) e.type = "Type is required";
    if (!formData.quantity) e.quantity = "Quantity is required";
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
                options={types} placeholder="Select Type" error={errors.type} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
              <Textinput type="number" value={formData.quantity} onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity" error={errors.quantity} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <Textarea value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Enter notes (optional)" rows={3} />
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
