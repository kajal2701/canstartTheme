import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Select from "react-select";

import ImageUploadSection from "../../components/imageUploadSection/Index";
import AnnotationImagePreview from "../../components/annotationImagePreview";

/* Dummy Data */
const customers = [
  { value: "1", label: "Customer A" },
  { value: "2", label: "Customer B" },
];

const products = [
  { value: "p1", label: "Product One" },
  { value: "p2", label: "Product Two" },
];

const mandatoryOptions = [
  { value: "mandatory", label: "Mandatory" },
  { value: "optional", label: "Optional" },
];

const AddQuote = () => {
  const [easyPlug, setEasyPlug] = useState(false);
  const [controllerAccess, setControllerAccess] = useState(true);

  const [easyPlugFiles, setEasyPlugFiles] = useState([{ id: Date.now() }]);
  const [controllerFiles, setControllerFiles] = useState([{ id: Date.now() }]);
  const [customProducts, setCustomProducts] = useState([]);
  const [sections, setSections] = useState([{ id: Date.now() }]);

  // Add new section
  const handleAddSection = () => {
    setSections([...sections, { id: Date.now() }]);
  };

  // Remove specific section
  const handleRemoveSection = (id) => {
    if (sections.length > 1) {
      setSections(sections.filter((section) => section.id !== id));
    } else {
      alert("At least one section must remain");
    }
  };
  // Remove custom product
  const removeCustomProduct = (id) => {
    setCustomProducts(customProducts.filter((item) => item.id !== id));
  };

  const addCustomProduct = () => {
    setCustomProducts([
      ...customProducts,
      {
        id: Date.now(),
        description: "",
        qty: "",
        price: "",
        amount: "",
        type: mandatoryOptions[0],
      },
    ]);
  };

  return (
    <Card title="Add Quote">
      <div className="space-y-8">
        {/* CUSTOMER */}
        <div className="grid gap-5">
          <p className="font-medium">Customer</p>
          <Select
            className="react-select"
            classNamePrefix="select"
            options={customers}
            placeholder="Select Customer"
          />
        </div>

        {/* IMAGE DETAILS */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">Image details</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <ImageUploadSection
              title="Easy plug access"
              enabled={easyPlug}
              setEnabled={setEasyPlug}
              files={easyPlugFiles}
              setFiles={setEasyPlugFiles}
            />

            <ImageUploadSection
              title="Controller access"
              enabled={controllerAccess}
              setEnabled={setControllerAccess}
              files={controllerFiles}
              setFiles={setControllerFiles}
            />
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="space-y-6">
          {/* HEADER */}
          <div className="space-y-4">
            {/* HEADER */}
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
              <div>Product</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Option</div>
            </div>

            {/* STATIC ROWS */}
            {products.map((product, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                {/* Product */}
                <Textinput value={product} />

                {/* Quantity */}
                <Textinput type="number" defaultValue={0} />

                {/* Amount */}
                <Textinput type="number" placeholder="0.00" />

                {/* Option */}
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  options={mandatoryOptions}
                  defaultValue={mandatoryOptions[0].value}
                  isSearchable={false}
                />
              </div>
            ))}
          </div>

          {/* CUSTOM PRODUCT ROWS */}
          {customProducts.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
              {/* Product Description */}
              <div className="col-span-3">
                <Textarea
                  placeholder="Product description"
                  rows={1}
                  className="h-[42px] "
                />
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <Textinput type="number" placeholder="0" className="h-[42px]" />
              </div>

              {/* Unit Price */}
              <div className="col-span-2">
                <Textinput
                  type="number"
                  placeholder="0.00"
                  className="h-[42px]"
                />
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <Textinput
                  type="number"
                  placeholder="0.00"
                  disabled
                  className="h-[42px]"
                />
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center gap-2">
                <Select
                  className="react-select w-full"
                  classNamePrefix="select"
                  options={mandatoryOptions}
                  defaultValue={mandatoryOptions[0]}
                  isSearchable={false}
                />
                <Button
                  text="Remove"
                  className="btn-danger btn-sm whitespace-nowrap"
                  onClick={() => removeCustomProduct(item.id)}
                />
              </div>
            </div>
          ))}

          {/* ADD BUTTON */}
          <Button
            text="Custom product +"
            className="btn-primary btn-sm"
            onClick={addCustomProduct}
          />
        </div>

        {/* Annotation Image */}
        <div className="space-y-4">
          {/* Render all sections */}
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-indigo-500/10 p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold">Annotation Image</h2>
              <AnnotationImagePreview
                sectionId={section.id}
                onRemoveSection={handleRemoveSection}
              />
            </div>
          ))}

          {/* Add New Section Button */}
          <div>
            <Button
              text="Add New File Section +"
              className="btn-primary btn-sm"
              onClick={handleAddSection}
            />
          </div>
        </div>

        {/* Customer Notes & Admin Notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer Notes
            </label>
            <Textarea
              placeholder="Enter customer notes..."
              rows={5}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Admin Notes
            </label>
            <Textarea
              placeholder="Enter admin notes..."
              rows={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Discount Input */}
        <div className="flex justify-end">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium mb-2 text-right">
              Enter Discount (%):
            </label>
            <Textinput
              type="text"
              placeholder="0"
              className="text-right"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                e.target.value = value;
              }}
            />
          </div>
        </div>

        {/* Submit Button and Price Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          {/* Submit Button */}
          <Button
            text="Submit"
            icon="heroicons-outline:paper-airplane"
            className="btn-outline-primary"
          />

          {/* Price Summary */}
          <div className="w-full md:w-auto space-y-2 text-right">
            <div className="flex justify-between md:justify-end gap-8 text-gray-700">
              <span>Total Controller price :</span>
              <span className="font-medium">$ 0</span>
            </div>

            <div className="flex justify-between md:justify-end gap-8 text-gray-700">
              <span>Total Linear Feet Price :</span>
              <span className="font-medium">$ 0</span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between md:justify-end gap-8 text-gray-700">
                <span>Discount (0%) :</span>
                <span className="font-medium">- $ 0.00</span>
              </div>

              <div className="flex justify-between md:justify-end gap-8 text-gray-700">
                <span>GST (0%) :</span>
                <span className="font-medium">$ 0.00</span>
              </div>

              <div className="flex justify-between md:justify-end gap-8 text-lg font-bold text-gray-900 mt-2">
                <span>Main Total :</span>
                <span>$ 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddQuote;
