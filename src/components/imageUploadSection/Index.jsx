import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
const ImageUploadSection = ({
  title,
  enabled,
  setEnabled,
  files,
  setFiles,
}) => {
  const addFile = () => setFiles([...files, { id: Date.now() }]);

  const removeFile = (id) => setFiles(files.filter((f) => f.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{title}</p>

        <Switch
          outline
          activeClass="border-gray-500"
          value={enabled}
          onChange={() => setEnabled(!enabled)}
          badge
        />
      </div>

      {/* OFF → Notes */}
      {!enabled && (
        <textarea
          rows="4"
          placeholder="Notes"
          className="w-full border rounded-md p-3 text-sm"
        />
      )}

      {/* ON → File Upload */}
      {enabled && (
        <div className="space-y-3">
          {files.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="file"
                className="flex-1 border rounded-md p-2 text-sm"
              />
              <button
                onClick={() => removeFile(item.id)}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-md"
              >
                ✕
              </button>
            </div>
          ))}

          <Button onClick={addFile} className="btn-primary">
            Add Image +
          </Button>
        </div>
      )}
    </div>
  );
};
export default ImageUploadSection;
