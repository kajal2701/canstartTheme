import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CommonTrackForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    const initial = {
      color: "",
      supplier: "",
      totalLength: "",
      size: "",
      cost: "",
      price: "",
      quantity: "",
    };
    return { ...initial, ...initialData };
  });

  const [errors, setErrors] = useState({});

  const colors = [
    { value: "White", label: "White" },
    { value: "Black", label: "Black" },
    { value: "Silver", label: "Silver" },
    { value: "Gold", label: "Gold" },
    { value: "Bronze", label: "Bronze" },
    { value: "Grey", label: "Grey" },
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
  ];

  const sizes = [
    { value: "1 inch", label: "1 inch" },
    { value: "1.5 inch", label: "1.5 inch" },
    { value: "2 inch", label: "2 inch" },
    { value: "2.5 inch", label: "2.5 inch" },
    { value: "3 inch", label: "3 inch" },
  ];

  const suppliers = [
    { value: "Track Supplier A", label: "Track Supplier A" },
    { value: "Track Supplier B", label: "Track Supplier B" },
    { value: "Track Supplier C", label: "Track Supplier C" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.supplier) newErrors.supplier = "Supplier is required";
    if (!formData.totalLength.trim()) newErrors.totalLength = "Total length is required";
    if (!formData.size) newErrors.size = "Size is required";
    if (!formData.cost) newErrors.cost = "Cost is required";
    else if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) newErrors.cost = "Enter a valid cost";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) newErrors.price = "Enter a valid price";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || parseInt(formData.quantity, 10) < 0) newErrors.quantity = "Enter a valid quantity";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        toast.success(`Track ${isEdit ? "updated" : "added"} successfully!`);
        navigate("/inventory/tracks");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "add"} track`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/inventory/tracks");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button
          text="Back to Tracks"
          icon="ph:arrow-left"
          className="btn-outline-primary"
          onClick={handleCancel}
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                options={colors}
                placeholder="Select Color"
                error={errors.color}
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                options={suppliers}
                placeholder="Select Supplier"
                error={errors.supplier}
              />
            </div>

            {/* Total Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Length <span className="text-red-500">*</span>
              </label>
              <Textinput
                type="text"
                value={formData.totalLength}
                onChange={(e) => handleInputChange("totalLength", e.target.value)}
                placeholder="Enter total length (e.g. 50m)"
                error={errors.totalLength}
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                options={sizes}
                placeholder="Select Size"
                error={errors.size}
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost ($)<span className="text-red-500">*</span>
              </label>
              <Textinput
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="Enter cost"
                error={errors.cost}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)<span className="text-red-500">*</span>
              </label>
              <Textinput
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Enter price"
                error={errors.price}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Textinput
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
                error={errors.quantity}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Button
              text="Cancel"
              className="btn-outline-dark"
              onClick={handleCancel}
              type="button"
            />
            <Button
              text={isSubmitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update" : "Add")}
              className="btn-primary"
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Card>
    </>
  );
};

export default CommonTrackForm;
