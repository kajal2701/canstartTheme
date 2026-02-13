import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Icon } from "@iconify/react";
import Button from "../../ui/Button";
import ImageLineAnnotationEditor from "../imageLineAnnotationEditor";
import ImageTextBoxAnnotationEditor from "../imageTextBoxAnnotationEditor";

const AnnotationImagePreview = ({ sectionId, onRemoveSection }) => {
  const [files, setFiles] = useState([{ file: null, preview: "" }]);
  const [modal3, setModal3] = useState(false);
  const [textBoxModel, setTextBoxModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form fields state
  const [formData, setFormData] = useState({
    color: "",
    peaksCount: "",
    jumpersCount: "",
    sftCount: "",
    sqftSize: "",
    total: "",
    unitPrice: "",
    amount: "",
    action: "Mandatory",
  });

  // Add new empty input row
  const handleAdd = () => {
    setFiles([...files, { file: null, preview: "" }]);
  };

  // Handle file select
  const handleChange = (e, index) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const updatedFiles = [...files];
    updatedFiles[index] = {
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    };

    setFiles(updatedFiles);
  };

  // Remove input row
  const handleRemove = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">
      {/* File Inputs */}
      <div className="space-y-3">
        {files.map((item, index) => (
          <div key={index} className="flex gap-3 items-center w-full">
            <label className="flex-1 cursor-pointer">
              <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3 bg-white hover:border-indigo-400 transition-colors">
                <span className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Choose File
                </span>
                <span className="text-gray-400 text-sm">
                  {files[index]?.file?.name || "No file chosen"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, index)}
                className="hidden"
              />
            </label>

            {index !== 0 && (
              <Button
                text="Remove"
                className="btn-danger"
                onClick={() => handleRemove(index)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add Image Button */}

      <Button
        text="+ Add Image"
        className="btn-primary mt-3"
        onClick={handleAdd}
      />

      {/* Image Preview Grid for line edit */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {files
          .filter((item) => item.preview)
          .map((item, index) => (
            <div
              key={index}
              className="relative group w-full h-32 rounded-lg overflow-hidden border"
            >
              <img
                src={item.preview}
                alt="preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(item.preview);
                    setModal3(true);
                  }}
                  className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Icon
                    icon="ph:pencil-simple"
                    className="text-xl text-gray-700"
                  />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Image Preview Grid for box edit */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {files
          .filter((item) => item.preview)
          .map((item, index) => (
            <div
              key={index}
              className="relative group w-full h-32 rounded-lg overflow-hidden border"
            >
              <img
                src={item.preview}
                alt="preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(item.preview);
                    setTextBoxModel(true);
                  }}
                  className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
                >
                  <Icon
                    icon="ph:pencil-simple"
                    className="text-xl text-gray-700"
                  />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Form Fields Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Identify the Photos</h3>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <select
              value={formData.color}
              onChange={(e) => handleFieldChange("color", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white"
            >
              <option value="">-- Select color --</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="black">Black</option>
              <option value="white">White</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Peaks
            </label>
            <input
              type="text"
              value={formData.peaksCount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("peaksCount", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Jumpers
            </label>
            <input
              type="text"
              value={formData.jumpersCount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("jumpersCount", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">SFT Count</label>
            <input
              type="text"
              value={formData.sftCount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("sftCount", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sqft size</label>
            <input
              type="text"
              value={formData.sqftSize}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                handleFieldChange("sqftSize", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total</label>
            <input
              type="text"
              value={formData.total}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                handleFieldChange("total", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit Price</label>
            <input
              type="text"
              value={formData.unitPrice}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                handleFieldChange("unitPrice", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                handleFieldChange("amount", value);
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <select
              value={formData.action}
              onChange={(e) => handleFieldChange("action", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white"
            >
              <option value="Mandatory">Mandatory</option>
              <option value="Optional">Optional</option>
              <option value="Review">Review</option>
            </select>
          </div>
        </div>

        {/* Remove Section Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onRemoveSection(sectionId)}
            type="button"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Remove Section
          </button>
        </div>
      </div>

      {/* MODAL Line */}
      <Modal
        title="Edit Image – Lines Only"
        activeModal={modal3}
        onClose={() => setModal3(false)}
        className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
      >
        {selectedImage && <ImageLineAnnotationEditor image={selectedImage} />}
      </Modal>

      {/* MODAL Text Box */}
      <Modal
        title="Edit Image – Text Boxes Only"
        activeModal={textBoxModel}
        onClose={() => setTextBoxModel(false)}
        className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
      >
        {selectedImage && (
          <ImageTextBoxAnnotationEditor image={selectedImage} />
        )}
      </Modal>
    </div>
  );
};

export default AnnotationImagePreview;
