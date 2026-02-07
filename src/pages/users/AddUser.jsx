import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

const AddUser = () => {
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ];
  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div>
      <Card title="Add User">
        <div className="space-y-5">
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
              label="Password"
              type="password"
              placeholder="Password"
            />

            {/* Row 3 – full width */}
            <div className="lg:col-span-1 col-span-1">
              <label className="form-label">Role</label>
              <Select
                className="react-select"
                classNamePrefix="select"
                placeholder="-- Select Role --"
                options={roles}
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

export default AddUser;
