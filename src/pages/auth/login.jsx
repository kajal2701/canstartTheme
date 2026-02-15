import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import Logo from "@/assets/images/logo/canstar-logo.svg";

const login = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-[416px] w-full">
          {/* ✅ Logo Section with Gradient Background */}
          <div className="bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] rounded-t-lg py-8 px-6">
            <Link to="/" className="block">
              <img
                src={Logo}
                alt="Canstar Lights"
                className="h-16 w-auto mx-auto object-contain"
              />
            </Link>
          </div>

          {/* ✅ Form Section */}
          <div className="p-6 auth-box rounded-b-lg">
            <LoginForm />

            {/* ✅ Create Account Link */}
            <div className="text-center text-sm mt-5 space-x-1 rtl:space-x-reverse mb-1">
              <span>Don't have Account?</span>
              <span>
                <Link
                  to="/register"
                  className="text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  Create account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
