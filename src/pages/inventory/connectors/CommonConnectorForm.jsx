import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CommonConnectorForm = ({ isEdit = false, initialData = {}, onSubmit, onCancel, title }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [formData, setFormData] = useState(() => {
    const initial = {
      name: "",
      type: "",
      cost: "",
      notes: "",
    };
    return { ...initial, ...initialData };
  });

  const [errors, setErrors] = useState({});

  // Connector type options
  const connectorTypes = [
    { value: "T", label: "T" },
    { value: "Y", label: "Y" },
    { value: "Male", label: "Male" },
    { value: "2x2", label: "2x2" },
    { value: "3x3", label: "3x3" },
    { value: "4x4", label: "4x4" },
  ];

  // Dummy data for editing
  const dummyConnectorData = {
    1: { name: "Standard Connector", type: "T", cost: "2.50", notes: "Standard T connector" },
    2: { name: "Split Connector", type: "Y", cost: "3.00", notes: "Y-split connector" },
    3: { name: "End Connector", type: "Male", cost: "1.50", notes: "Male end connector" },
  };

  useEffect(() => {
    if (isEdit && id) {
      const fetchConnectorData = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const connectorData = dummyConnectorData[id];
          if (connectorData) {
            setFormData(connectorData);
          } else {
            toast.error("Connector not found");
            navigate("/inventory");
          }
        } catch (error) {
          toast.error("Failed to load connector data");
          navigate("/inventory");
        } finally {
          setLoading(false);
        }
      };

      fetchConnectorData();
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

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Connector type is required";
    if (!formData.cost) newErrors.cost = "Cost is required";

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
        toast.success(`Connector ${isEdit ? 'updated' : 'added'} successfully!`);
        navigate("/inventory");
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} connector`);
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Textinput
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter connector name"
                error={errors.name}
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

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connector Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={connectorTypes.find(option => option.value === formData.type)}
                onChange={(selected) => handleInputChange("type", selected?.value || "")}
                options={connectorTypes}
                placeholder="Select Connector Type"
                className={errors.type ? "border-red-500" : ""}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
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

export default CommonConnectorForm;
