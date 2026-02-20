import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "@/store/auth/authSlice";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { email, password } = data;
      if (!email || !password) {
        throw new Error("Invalid credentials");
      }
      const token = "local-token";
      const user = { email };
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
      toast.success("Login Successful");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <InputGroup
          name="email"
          type="email"
          placeholder="DashSpace@gmail.com"
          prepend="@"
          defaultValue="DashSpace@gmail.com"
          register={register}
          error={errors.email}
          merged
          disabled={isLoading}
          className="focus:ring-2 focus:ring-[#2C5364] focus:border-[#2C5364]"
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <InputGroup
          name="password"
          type="password"
          placeholder="••••••••"
          prepend={<Icon icon="ph:lock-simple" />}
          defaultValue="DashSpace"
          register={register}
          error={errors.password}
          merged
          disabled={isLoading}
          className="focus:ring-2 focus:ring-[#2C5364] focus:border-[#2C5364]"
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Remember me"
          className="text-sm"
        />
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        text="Sign in"
        className="btn block w-full text-center bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] hover:opacity-90 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
