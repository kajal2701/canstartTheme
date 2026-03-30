import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommonConnectorForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({ name: "", type: "", cost: "", notes: "", ...initialData }));
  const [errors, setErrors] = useState({});

  const types = [
    { value: "T", label: "T" },
    { value: "Y", label: "Y" },
    { value: "Male", label: "Male" },
    { value: "2x2", label: "2x2" },
    { value: "3x3", label: "3x3" },
    { value: "4x4", label: "4x4" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name?.trim()) e.name = "Name is required";
    if (!formData.type) e.type = "Connector type is required";
    if (!formData.cost) e.cost = "Cost is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (onSubmit) await onSubmit(formData);
      else { toast.success(`Connector ${isEdit ? "updated" : "added"}!`); navigate("/inventory/connectors"); }
    } catch { toast.error(`Failed to ${isEdit ? "update" : "add"} connector`); }
    finally { setIsSubmitting(false); }
  };

  const handleCancel = () => { onCancel ? onCancel() : navigate("/inventory/connectors"); };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button text="Back to Connectors" icon="ph:arrow-left" className="btn-outline-primary" onClick={handleCancel} />
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
              <Textinput type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter connector name" error={errors.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connector Type <span className="text-red-500">*</span></label>
              <Select value={formData.type} onChange={(e) => handleInputChange("type", e.target.value)}
                options={types} placeholder="Select Type" error={errors.type} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)<span className="text-red-500">*</span></label>
              <Textinput type="number" step="0.01" value={formData.cost} onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="Enter cost" error={errors.cost} />
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

export default CommonConnectorForm;
