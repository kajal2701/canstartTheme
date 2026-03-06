import { useForm, FormProvider } from "react-hook-form";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { addUser } from "../../services/usersService";
import { toast } from "react-toastify";

const AddUser = () => {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,

    formState: { errors },
    reset,
  } = methods;

  const roles = [
    { value: "2", label: "Installer" },
    { value: "3", label: "Operations" },
    { value: "4", label: "Sales" },
  ];

  const onSubmit = async (data) => {
    const payload = {
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    const result = await addUser(payload);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div>
      <Card title="Add User">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
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
                </div>

                {/* Last Name */}
                <div>
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
                </div>

                {/* Email */}
                <div>
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    }}
                  />
                </div>

                {/* Password */}
                <div>
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
                </div>

                {/* Role */}

                {/* Role - Using your Standard Select Component */}
                <div className="lg:col-span-1 col-span-1">
                  <Select
                    label="Role"
                    name="role"
                    placeholder="-- Select Role --"
                    options={roles}
                    register={register}
                    error={errors.role}
                    options_rule={{ required: "Role is required" }}
                  />
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
