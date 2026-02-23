import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { setUser } from "@/store/auth/authSlice";
import { loginApi } from "../../../services/authService";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must not exceed 32 characters")
    .required("Password is required"),
});

// Reusable field error message
const FieldError = ({ message }) => (
  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
    <Icon icon="mdi:alert-circle-outline" width="13" />
    {message}
  </p>
);

// Reusable input wrapper with left icon
const InputWithIcon = ({ icon, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <Icon icon={icon} width="18" height="18" />
    </span>
    {children}
  </div>
);

const inputClass = (hasError) =>
  `w-full border rounded-lg py-2.5 text-sm outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-[#fa896b] focus:ring-[#fa896b]/20"
  }`;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const result = await loginApi(email, password);
      dispatch(setUser(result.user));
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <InputWithIcon icon="mdi:email-outline">
          <input
            {...register("email")}
            type="email"
            placeholder="admin@example.com"
            className={`${inputClass(errors.email)} pl-10 pr-4`}
          />
        </InputWithIcon>
        {errors.email && <FieldError message={errors.email.message} />}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <InputWithIcon icon="mdi:lock-outline">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`${inputClass(errors.password)} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa896b] transition"
          >
            <Icon
              icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              width="18"
            />
          </button>
        </InputWithIcon>
        {errors.password && <FieldError message={errors.password.message} />}
      </div>

      {/* Remember me */}
      <Checkbox
        value={checked}
        onChange={() => setChecked(!checked)}
        label="Remember me"
        className="text-sm"
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        text={isLoading ? "Signing in..." : "Sign In"}
        icon={isLoading ? "mdi:loading" : "mdi:login-variant"}
        className={`btn-primary block-btn ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        iconPosition="right"
      />
    </form>
  );
};

export default LoginForm;
