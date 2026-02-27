import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Icon } from "@iconify/react";
import Button from "../../ui/Button";
import ImageLineAnnotationEditor from "../imageLineAnnotationEditor";
import ImageTextBoxAnnotationEditor from "../imageTextBoxAnnotationEditor";

const AnnotationImagePreview = ({
  sectionId,
  onRemoveSection,
  files, // ← from hook (NO local useState)
  formData, // ← from hook (NO local useState)
  onFilesChange, // ← emits to hook
  onFormDataChange, // ← emits to hook
}) => {
  // ✅ ONLY UI state kept local
  const [modal3, setModal3] = useState(false);
  const [textBoxModel, setTextBoxModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // ❌ REMOVE THESE - they were overriding props with local state
  // const [files, setFiles] = useState([{ file: null, preview: "" }]);
  // const [formData, setFormData] = useState({...});

  // Add new empty input row
  const handleAdd = () => {
    onFilesChange([
      ...files,
      { file: null, preview: "", lineSaved: "", textSaved: "" },
    ]);
  };

  // Handle file select
  const handleChange = (e, index) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const updatedFiles = [...files];
    updatedFiles[index] = {
      ...updatedFiles[index],
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    };
    onFilesChange(updatedFiles); // ← push to hook
  };

  // Remove input row
  const handleRemove = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onFilesChange(updatedFiles); // ← push to hook
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value }); // ← push to hook
  };

  // Handle line annotation save
  const handleLineSave = (savedImageUrl) => {
    const updatedFiles = [...files];
    updatedFiles[selectedIndex] = {
      ...updatedFiles[selectedIndex],
      lineSaved: savedImageUrl,
    };
    onFilesChange(updatedFiles); // ← push to hook
    setModal3(false);
  };

  // Handle text box annotation save
  const handleTextSave = (savedImageUrl, sum) => {
    const updatedFiles = [...files];
    updatedFiles[selectedIndex] = {
      ...updatedFiles[selectedIndex],
      textSaved: savedImageUrl,
    };
    onFilesChange(updatedFiles); // ← push to hook

    const newSftCount = (parseFloat(formData.sftCount) || 0) + sum;
    const divideValue = parseFloat(formData.sqftSize) || 1;
    const total = Math.ceil((newSftCount * divideValue) / 12);
    onFormDataChange({
      ...formData,
      sftCount: newSftCount,
      total: total,
      amount: (total * parseFloat(formData.unitPrice || 0)).toFixed(2),
    }); // ← push to hook
    setTextBoxModel(false);
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

      <Button
        text="+ Add Image"
        className="btn-primary mt-3"
        onClick={handleAdd}
      />

      {/* Image Preview Grid for LINE edit */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {files
          .filter((item) => item.preview)
          .map((item) => {
            const realIndex = files.findIndex((f) => f === item); // ← real index
            return (
              <div
                key={realIndex}
                className="relative group w-full h-32 rounded-lg overflow-hidden border"
              >
                <img
                  src={item.lineSaved || item.preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(item.lineSaved || item.preview);
                      setSelectedIndex(realIndex); // ← real index
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
            );
          })}
      </div>

      {/* Image Preview Grid for TEXT BOX edit */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {files
          .filter((item) => item.preview)
          .map((item) => {
            const realIndex = files.findIndex((f) => f === item); // ← real index
            return (
              <div
                key={realIndex}
                className="relative group w-full h-32 rounded-lg overflow-hidden border"
              >
                <img
                  src={item.textSaved || item.preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(item.textSaved || item.preview);
                      setSelectedIndex(realIndex); // ← real index
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
            );
          })}
      </div>

      {/* Form Fields Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Identify the Photos</h3>

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
              onChange={(e) =>
                handleFieldChange(
                  "peaksCount",
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
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
              onChange={(e) =>
                handleFieldChange(
                  "jumpersCount",
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">SFT Count</label>
            <input
              type="text"
              value={formData.sftCount}
              onChange={(e) =>
                handleFieldChange(
                  "sftCount",
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sqft size</label>
            <input
              type="text"
              value={formData.sqftSize}
              onChange={(e) =>
                handleFieldChange(
                  "sqftSize",
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total</label>
            <input
              type="text"
              value={formData.total}
              onChange={(e) =>
                handleFieldChange(
                  "total",
                  e.target.value.replace(/[^0-9.]/g, ""),
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit Price</label>
            <input
              type="text"
              value={formData.unitPrice}
              onChange={(e) =>
                handleFieldChange(
                  "unitPrice",
                  e.target.value.replace(/[^0-9.]/g, ""),
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) =>
                handleFieldChange(
                  "amount",
                  e.target.value.replace(/[^0-9.]/g, ""),
                )
              }
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
      >
        {selectedImage && (
          <ImageLineAnnotationEditor
            image={selectedImage}
            onSave={handleLineSave}
          />
        )}
      </Modal>

      {/* MODAL Text Box */}
      <Modal
        title="Edit Image – Text Boxes Only"
        activeModal={textBoxModel}
        onClose={() => setTextBoxModel(false)}
      >
        {selectedImage && (
          <ImageTextBoxAnnotationEditor
            image={selectedImage}
            onSave={handleTextSave}
          />
        )}
      </Modal>
    </div>
  );
};

export default AnnotationImagePreview;
