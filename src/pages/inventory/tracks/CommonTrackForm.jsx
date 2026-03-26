import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CommonTrackForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

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
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
    { value: "bronze", label: "Bronze" },
  ];

  const suppliers = [
    { value: "supplier_a", label: "Track Supplier A" },
    { value: "supplier_b", label: "Track Supplier B" },
    { value: "supplier_c", label: "Track Supplier C" },
  ];

  const sizes = [
    { value: "1_meter", label: "1 meter" },
    { value: "4_feet", label: "4 feet" },
    { value: "6_feet", label: "6 feet" },
    { value: "other", label: "Other" },
  ];

  // Dummy data for editing
  const dummyTrackData = {
    1: { color: "white", supplier: "supplier_a", totalLength: "1000", size: "1_meter", cost: "5.50", price: "8.50", quantity: "500" },
    2: { color: "black", supplier: "supplier_b", totalLength: "800", size: "4_feet", cost: "12.00", price: "18.00", quantity: "300" },
    3: { color: "silver", supplier: "supplier_a", totalLength: "600", size: "6_feet", cost: "18.00", price: "25.00", quantity: "200" },
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchTrackData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const trackData = dummyTrackData[id];
          if (trackData) {
            setFormData(trackData);
          } else {
            toast.error("Track not found");
            navigate("/inventory");
          }
        } catch (error) {
          toast.error("Failed to load track data");
          navigate("/inventory");
        } finally {
          setLoading(false);
        }
      };

      fetchTrackData();
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

    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.supplier) newErrors.supplier = "Supplier is required";
    if (!formData.totalLength) newErrors.totalLength = "Total length is required";
    if (!formData.size) newErrors.size = "Size is required";
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
        toast.success(`Track ${isEdit ? 'updated' : 'added'} successfully!`);
        navigate("/inventory");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} track`);
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
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <Select
                value={colors.find(c => c.value === formData.color)}
                onChange={(selected) => handleInputChange("color", selected?.value || "")}
                options={colors}
                placeholder="Select Color"
                className={errors.color ? "border-red-500" : ""}
              />
              {errors.color && (
                <p className="text-red-500 text-xs mt-1">{errors.color}</p>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <Select
                value={suppliers.find(s => s.value === formData.supplier)}
                onChange={(selected) => handleInputChange("supplier", selected?.value || "")}
                options={suppliers}
                placeholder="Select Supplier"
                className={errors.supplier ? "border-red-500" : ""}
              />
              {errors.supplier && (
                <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
              )}
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
                placeholder="Enter total length"
                error={errors.totalLength}
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <Select
                value={sizes.find(s => s.value === formData.size)}
                onChange={(selected) => handleInputChange("size", selected?.value || "")}
                options={sizes}
                placeholder="Select Size"
                className={errors.size ? "border-red-500" : ""}
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">{errors.size}</p>
              )}
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
            {/* <div>
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
            </div> */}
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
