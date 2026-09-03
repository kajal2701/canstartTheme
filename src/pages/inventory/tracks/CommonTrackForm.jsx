import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import InputNumber from "@/components/ui/InputNumber";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getColors } from "@/services/quoteService";
import { TRACK_SIZES_OPTIONS } from "@/utils/constants";
import { calculateTotalPrice } from "@/utils/helperFunctions";

const CommonTrackForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => {
    const initial = {
      color: "",
      supplier: "",
      totalFeet: "",
      size: "",
      pricePerUnit: "",
      totalPrice: "",
    };
    return { ...initial, ...initialData };
  });

  const [errors, setErrors] = useState({});
  const [colorOptions, setColorOptions] = useState([]);

  // Fetch colors from API
  useEffect(() => {
    const loadColors = async () => {
      try {
        const rows = await getColors();
        if (Array.isArray(rows)) {
          const mapped = rows.map((c) => ({
            value: c.color_name,
            label: c.color_name,
          }));
          setColorOptions(mapped);
        } else {
          setColorOptions([]);
        }
      } catch (e) {
        console.error("Failed to load colors", e);
        setColorOptions([]);
      }
    };
    loadColors();
  }, []);

  // Auto-calculate total price
  useEffect(() => {
    const total = calculateTotalPrice(formData.totalFeet, formData.pricePerUnit);
    setFormData((prev) => ({
      ...prev,
      totalPrice: total,
    }));
  }, [formData.totalFeet, formData.pricePerUnit]);



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
    if (!formData.totalFeet || !String(formData.totalFeet).trim()) newErrors.totalFeet = "Total feet is required";
    else if (isNaN(formData.totalFeet) || parseFloat(formData.totalFeet) <= 0) newErrors.totalFeet = "Total feet must be greater than 0";
    if (!formData.size) newErrors.size = "Size is required";
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
                options={colorOptions}
                placeholder="Select Color"
                error={errors.color}
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

            {/* Total Feet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Feet <span className="text-red-500">*</span>
              </label>
              <InputNumber
                value={formData.totalFeet}
                onChange={(e) => handleInputChange("totalFeet", e.target.value)}
                placeholder="Enter total feet"
                error={errors.totalFeet}
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
                options={TRACK_SIZES_OPTIONS}
                placeholder="Select Size"
                error={errors.size}
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

export default CommonTrackForm;
