import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Flatpickr from "react-flatpickr";

const AddUser = () => {
  const [picker, setPicker] = useState(new Date());
  return (
    <div>
      <Card title="Add User">
        <div className=" space-y-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 ">
            <Textinput label="Name" type="text" placeholder="Add your name" />
            <Textinput label="Phone" type="text" placeholder="Add your phone" />
            <div className="lg:col-span-2 col-span-1">
              <Textinput
                label="Email"
                type="email"
                placeholder="Add your email"
              />
            </div>

            <div className="lg:col-span-2 col-span-1">
              <Textarea
                label="Address"
                type="email"
                placeholder="address"
                rows="2"
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

export default AddUser;
