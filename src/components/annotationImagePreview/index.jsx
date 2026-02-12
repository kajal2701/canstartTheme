import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Icon } from "@iconify/react";
import ImageAnnotation from "../imageAnnotation";
import ImageAnnotationTextBox from "../imageAnnotationTextBox";

const AnnotationImage = () => {
  const [files, setFiles] = useState([{ file: null, preview: "" }]);

  const [modal3, setModal3] = useState(false);
  const [textBoxModel, setTextBoxModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  return (
    <div className="p-4">
      {/* File Inputs */}
      <div className="space-y-3">
        {files.map((item, index) => (
          <div key={index} className="flex gap-3 items-center w-full">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(e, index)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            {/* ❌ Hide remove button for first field */}
            {index !== 0 && (
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-400 text-white px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Image Button */}
      <button
        onClick={handleAdd}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg"
      >
        + Add Image
      </button>

      {/* Image Preview Grid */}
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

              {/* Overlay */}
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
      {/* Image Preview Grid */}
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

              {/* Overlay */}
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

      {/* MODAL Line*/}
      <Modal
        title="Edit Image – Lines Only"
        activeModal={modal3}
        onClose={() => setModal3(false)}
        className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
      >
        {selectedImage && <ImageAnnotation image={selectedImage} />}
      </Modal>

      {/* MODAL Text Box*/}
      <Modal
        title="Edit Image – Text Boxes Only"
        activeModal={textBoxModel}
        onClose={() => setTextBoxModel(false)}
        className="w-full max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
      >
        {selectedImage && <ImageAnnotationTextBox image={selectedImage} />}
      </Modal>
    </div>
  );
};

export default AnnotationImage;
