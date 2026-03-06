import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { getUserById, updateUser } from "../../services/usersService";
import { toast } from "react-toastify";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const originalPassword = useRef("");

  const methods = useForm({
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", role: "",
    },
    mode: "onChange",
  });

  const { reset, setError } = methods;

  // ── Fetch user and prefill form ──────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUserById(id);
      if (result.success) {
        const u = result.data;
        const isAdminRole = Number(u.role) === 1;
        originalPassword.current = u.password ?? "";
        reset({
          firstName: u.fname ?? "",
          lastName: u.lname ?? "",
          email: u.email ?? "",
          password: "",
          role: isAdminRole ? "" : String(u.role),
        });
      } else {
        toast.error("Failed to load user");
        navigate("/users");
      }
    };
    fetchUser();
  }, [id]);
  // ────────────────────────────────────────────────────────────────

  const onSubmit = async (data) => {
    const payload = {
      user_id: id,
      fname: data.firstName,
      lname: data.lastName,
      email: data.email,
      password: data.password && data.password.trim() !== ""
        ? data.password
        : originalPassword.current,
      role: data.role,
    };

    const result = await updateUser(payload);
    if (result.success) {
      toast.success(result.message);
      navigate("/users");
    } else {
      toast.error(result.message);
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });
      }
    }
  };

  return (
    <UserForm
      methods={methods}
      onSubmit={onSubmit}
      title="Edit User"
      submitText="Update"
      isEdit={true}
    />
  );
};

export default EditUser;