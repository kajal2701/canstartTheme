import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Select from "react-select";

import ImageUploadSection from "../../components/imageUploadSection/Index";

/* Dummy Data */
const customers = [
  { value: "1", label: "Customer A" },
  { value: "2", label: "Customer B" },
];

const products = [
  { value: "p1", label: "Product One" },
  { value: "p2", label: "Product Two" },
];

const inventory = [
  { value: "in", label: "In Stock" },
  { value: "out", label: "Out of Stock" },
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

        {/* NOTES */}
        <div className="grid md:grid-cols-2 gap-5">
          <Textarea label="Customer Notes" rows="3" />
          <Textarea label="Admin Notes" rows="3" />
        </div>

        {/* SUMMARY */}
        <div className="border-t pt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>$0.00</span>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="text-right">
          <Button text="Submit Order" className="btn-primary" />
        </div>
      </div>
    </Card>
  );
};

export default AddQuote;
