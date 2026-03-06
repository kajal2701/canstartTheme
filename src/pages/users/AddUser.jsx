import { useForm } from "react-hook-form";
import UserForm from "./UserForm";
import { addUser } from "../../services/usersService";
import { toast } from "react-toastify";

const AddUser = () => {
  const methods = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", role: "",
    },
    mode: "onChange",
  });

  const { reset } = methods;

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
    <UserForm
      methods={methods}
      onSubmit={onSubmit}
      title="Add User"
      submitText="Save"
      isEdit={false}
    />
  );
};

export default AddUser;