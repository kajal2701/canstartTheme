import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const AddCustomer = () => {
  const [picker, setPicker] = useState(new Date());

  const provinceOptions = [
    { value: "gujarat", label: "Gujarat" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "mp", label: "Madhya Pradesh" },
  ];

  const countryOptions = [
    { value: "india", label: "India" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "canada", label: "Canada" },
  ];

  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div>
      <Card title="Personal Information">
        <div className=" space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Row 1 */}
            <Textinput
              label="First Name"
              type="text"
              placeholder="First Name"
            />

            <Textinput label="Last Name" type="text" placeholder="Last Name" />

            {/* Row 2 */}
            <Textinput
              label="Email address"
              type="email"
              placeholder="Email address"
            />

            <Textinput
              label="Phone Number"
              type="phone"
              placeholder="Phone Number"
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            {/* Address title */}
            <div className="lg:col-span-2 col-span-1 text-gray-900 text-base dark:text-gray-300 font-medium">
              Address
            </div>

            {/* Street */}
            <div className="lg:col-span-2 col-span-1">
              <Textinput
                label="Street"
                type="text"
                placeholder="Street address"
              />
            </div>

            {/* City */}
            <Textinput label="City" type="text" placeholder="City" />

            {/* Post Code */}
            <Textinput label="Post Code" type="text" placeholder="Post code" />

            {/* Province */}
            <div>
              <label className="form-label">Province</label>
              <Select
                className="react-select"
                classNamePrefix="select"
                placeholder="Select province"
                options={provinceOptions}
                styles={styles}
              />
            </div>

            {/* Country */}
            <div>
              <label className="form-label">Country</label>
              <Select
                className="react-select"
                classNamePrefix="select"
                placeholder="Select country"
                options={countryOptions}
                styles={styles}
              />
            </div>
          </div>

          <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
            <Button text="Save" className="btn-primary btn-sm" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddCustomer;
