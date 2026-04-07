import React, { useRef } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

const PostInstallationImages = ({ data, onChange }) => {
  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = [];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImages.push({ name: file.name, preview: ev.target.result });
        loaded++;
        if (loaded === files.length) {
          onChange({
            ...data,
            images: [...(data?.images || []), ...newImages],
          });
        }
      };
      reader.readAsDataURL(file);
    });
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeImage = (index) => {
    const updated = [...(data?.images || [])];
    updated.splice(index, 1);
    onChange({ ...data, images: updated });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-rose-100 dark:border-rose-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:images" className="text-rose-500 text-xl" />
          Post Installation Images & Notes
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload photos of the completed installation and add any relevant notes.
        </p>
      </div>

      {/* ── Image Upload ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Gallery */}
        {data?.images?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {data.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm">
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Icon icon="ph:trash" className="text-sm" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-[10px] text-white truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-all group"
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon icon="ph:camera-plus" className="text-2xl text-rose-500" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Click to upload photos
          </p>
          <p className="text-xs text-gray-400">JPG, PNG — multiple files allowed</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        {data?.images?.length > 0 && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            {data.images.length} image{data.images.length > 1 ? "s" : ""} uploaded
          </p>
        )}
      </Card>

      {/* ── Notes ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:note-pencil" className="text-rose-500" />
            <span>Notes</span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <textarea
          value={data?.notes || ""}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="Add any notes about the completed installation..."
          rows={4}
          className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
        />
      </Card>
    </div>
  );
};

export default PostInstallationImages;
