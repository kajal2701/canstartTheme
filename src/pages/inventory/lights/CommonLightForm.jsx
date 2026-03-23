import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CommonLightForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [formData, setFormData] = useState(() => {
    const initial = {
      type: "",
      cost: "",
      price: "",
      quantity: "",
      purchaseInfo: "",
      notes: "",
    };
    return { ...initial, ...initialData };
  });

  const [errors, setErrors] = useState({});

  const lightTypes = [
    { value: "led_strip", label: "LED Strip" },
    { value: "spot_light", label: "Spot Light" },
    { value: "panel_light", label: "Panel Light" },
    { value: "flood_light", label: "Flood Light" },
  ];

  // Dummy data for editing
  const dummyLightData = {
    1: { type: "led_strip", cost: "8.00", price: "15.00", quantity: "200", purchaseInfo: "Supplier A - Bulk Order", notes: "Warm white LED" },
    2: { type: "spot_light", cost: "12.00", price: "22.00", quantity: "100", purchaseInfo: "Supplier B - Premium", notes: "Adjustable spotlight" },
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchLightData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const lightData = dummyLightData[id];
          if (lightData) {
            setFormData(lightData);
          } else {
            toast.error("Light not found");
            navigate("/inventory");
          }
        } catch (error) {
          toast.error("Failed to load light data");
          navigate("/inventory");
        } finally {
          setLoading(false);
        }
      };

      fetchLightData();
    }
  }, [isEdit, id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Light type is required";
    if (!formData.cost) newErrors.cost = "Cost is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        toast.success(`Light ${isEdit ? 'updated' : 'added'} successfully!`);
        navigate("/inventory");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} light`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/inventory");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button
          text="Back to Inventory"
          icon="ph:arrow-left"
          className="btn-outline-primary"
          onClick={handleCancel}
        />
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Light Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={lightTypes.find(t => t.value === formData.type)}
                onChange={(selected) => handleInputChange("type", selected?.value || "")}
                options={lightTypes}
                placeholder="Select Light Type"
                className={errors.type ? "border-red-500" : ""}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
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
                placeholder="Enter cost per unit"
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
                placeholder="Enter selling price"
                error={errors.price}
              />
            </div>

            {/* Purchase Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Info
              </label>
              <Textinput
                type="text"
                value={formData.purchaseInfo}
                onChange={(e) => handleInputChange("purchaseInfo", e.target.value)}
                placeholder="Enter purchase information"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Enter any additional notes"
                rows={3}
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

export default CommonLightForm;
