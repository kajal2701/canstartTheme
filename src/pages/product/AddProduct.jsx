import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const AddProduct = () => {
  const typeOptions = [
    { value: "physical", label: "Physical Product" },
    { value: "digital", label: "Digital Product" },
    { value: "service", label: "Service" },
  ];

  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  return (
    <div>
      <Card title="Add Product">
        <div className="space-y-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            {/* Title */}
            <Textinput label="Title" type="text" placeholder="Title" />

            {/* SKU */}
            <Textinput label="SKU" type="text" placeholder="SKU" />

            {/* Description - full width */}
            <div className="lg:col-span-2 col-span-1">
              <Textarea
                label="Description"
                placeholder="Description"
                rows="3"
              />
            </div>

            {/* Inventory */}
            <Textinput
              label="Inventory"
              type="number"
              placeholder="Inventory"
            />

            {/* Price */}
            <Textinput label="Price" type="number" placeholder="Price" />

            {/* Type - full width select */}
            <div className="lg:col-span-2 col-span-1">
              <label className="form-label">Type</label>
              <Select
                className="react-select"
                classNamePrefix="select"
                placeholder="-- Select type --"
                options={typeOptions}
                styles={styles}
              />
            </div>
          </div>

          <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
            <Button text="Save" className="btn-primary light" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddProduct;
