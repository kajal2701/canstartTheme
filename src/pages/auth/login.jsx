import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Logo from "@/assets/images/logo/canstar-logo.svg";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
    <div className="max-w-[620px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Logo */}
      <div className="px-8 pt-8">
        <div className="bg-[var(--primary)] py-6 px-6 flex flex-col items-center rounded-2xl">
          <Link to="/">
            <img
              src={Logo}
              alt="Canstar Lights"
              className="h-16 w-auto object-contain drop-shadow-xl"
            />
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8">
        <LoginForm />
      </div>
    </div>
  </div>
);

export default Login;
