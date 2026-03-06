import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { getUserById, updateUser } from "../../services/usersService";
import { toast } from "react-toastify";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
     const originalPassword = useRef(""); 

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
        setError,
    } = methods;

    const roles = [
        { value: "2", label: "Installer" },
        { value: "3", label: "Operations" },
        { value: "4", label: "Sales" },
    ];

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
            // ← if user typed a new password use it, otherwise fall back to original
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
            // handle server-side field errors if returned
            if (result.errors) {
                Object.entries(result.errors).forEach(([field, message]) => {
                    setError(field, { type: "server", message });
                });
            }
        }
    };

    return (
        <div>
            <Card title="Edit User">
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
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Please enter a valid email address",
                                            },
                                        }}
                                    />
                                </div>

                                <div>
                                    <Textinput
                                        label="Password"
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        name="password"
                                        register={register}
                                        error={errors.password}
                                        options={{
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        }}
                                    />
                                </div>

                                {/* Role */}
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
                                    text="Cancel"
                                    type="button"
                                    className="btn-outline-dark btn-sm"
                                    onClick={() => navigate("/users")}
                                />
                                <Button
                                    text="Update"
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

export default EditUser;