import { useForm, FormProvider } from "react-hook-form";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";

const AddUser = () => {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: null,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = methods;

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

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Add your API call or form submission logic here
  };

  return (
    <div>
      <Card title="Add User">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Row 1 */}
                <Textinput
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  register={register}
                  error={errors.firstName}
                  options={{
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  }}
                />

                <Textinput
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  register={register}
                  error={errors.lastName}
                  options={{
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  }}
                />

                {/* Row 2 */}
                <Textinput
                  label="Email address"
                  type="email"
                  placeholder="Email address"
                  name="email"
                  register={register}
                  error={errors.email}
                  options={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />

                <Textinput
                  label="Password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
                  options={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
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
                    value={watch("role")}
                    onChange={(selected) => setValue("role", selected)}
                  />
                  {errors.role && (
                    <span className="text-danger-500 text-sm mt-1">
                      {errors.role.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                <Button
                  text="Save"
                  type="submit"
                  className="btn-primary btn-sm"
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default AddUser;
