import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import InputNumber from "@/components/ui/InputNumber";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateTotalPrice } from "@/utils/helperFunctions";
import { APP_CONTROLLER_TYPES } from "@/utils/constants";

const CommonAppcontrollerForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    const initial = {
      type: "",
      supplier: "",
      quantity: "",
      pricePerUnit: "",
      totalPrice: "",
    };
    return { ...initial, ...initialData };
  });

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

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.quantity || !String(formData.quantity).trim()) newErrors.quantity = "Quantity is required";
    else if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!formData.pricePerUnit) newErrors.pricePerUnit = "Price per unit is required";
    else if (isNaN(formData.pricePerUnit) || parseFloat(formData.pricePerUnit) <= 0) newErrors.pricePerUnit = "Price per unit must be greater than 0";
    if (!formData.totalPrice) newErrors.totalPrice = "Total price is required";
    else if (isNaN(formData.totalPrice) || parseFloat(formData.totalPrice) < 0) newErrors.totalPrice = "Enter a valid total price";

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
        toast.success(`App Controller ${isEdit ? "updated" : "added"} successfully!`);
        navigate("/inventory/appcontrollers");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "add"} app controller`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/inventory/appcontrollers");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button
          text="Back to App Controllers"
          icon="ph:arrow-left"
          className="btn-outline-primary"
          onClick={handleCancel}
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                options={APP_CONTROLLER_TYPES}
                placeholder="Select Type"
                error={errors.type}
              />
            </div>

            {/* Supplier (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <Textinput
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Enter Supplier (optional)"
                error={errors.supplier}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
                error={errors.quantity}
                step="1"
                noDecimal
              />
            </div>

            {/* Price Per Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Unit ($)<span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={formData.pricePerUnit}
                onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
                placeholder="Enter price per unit"
                error={errors.pricePerUnit}
              />
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Price ($)<span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={formData.totalPrice}
                onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                placeholder="Auto-calculated total"
                error={errors.totalPrice}
                disabled={true}
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

export default CommonAppcontrollerForm;
