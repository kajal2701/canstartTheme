import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CommonJumperForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [formData, setFormData] = useState(() => {
    const initial = {
      type: "",
      quantity: "",
      notes: "",
    };
    return { ...initial, ...initialData };
  });

  const [errors, setErrors] = useState({});

  const jumperTypes = [
    { value: "led", label: "LED Jumpers" },
    { value: "rgb", label: "RGB Jumpers" },
    { value: "extension", label: "Extension Jumpers" },
    { value: "connector", label: "Connector Jumpers" },
    { value: "adapter", label: "Adapter Jumpers" },
  ];

  // Dummy data for editing
  const dummyJumperData = {
    1: { type: "jumper_wire", quantity: "1000", notes: "Various colors and lengths" },
    2: { type: "dupont_wire", quantity: "500", notes: "Male to female connectors" },
    3: { type: "breadboard_wire", quantity: "300", notes: "Standard breadboard jumpers" },
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchJumperData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const jumperData = dummyJumperData[id];
          if (jumperData) {
            setFormData(jumperData);
          } else {
            toast.error("Jumper not found");
            navigate("/inventory");
          }
        } catch (error) {
          toast.error("Failed to load jumper data");
          navigate("/inventory");
        } finally {
          setLoading(false);
        }
      };

      fetchJumperData();
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

    if (!formData.type) newErrors.type = "Type is required";
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
        toast.success(`Jumper ${isEdit ? 'updated' : 'added'} successfully!`);
        navigate("/inventory");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} jumper`);
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
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={jumperTypes.find(t => t.value === formData.type)}
                onChange={(selected) => handleInputChange("type", selected?.value || "")}
                options={jumperTypes}
                placeholder="Select Jumper Type"
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

export default CommonJumperForm;
