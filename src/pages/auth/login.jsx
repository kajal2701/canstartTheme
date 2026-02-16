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
      {/* Background with subtle gradient */}
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="max-w-[550px] w-full">
          {/* Card Container with shadow */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* ✅ Logo Section with Dark Gradient */}
            <div className="bg-gradient-to-br from-[#0F2027] via-[#1a3038] to-[#2C5364] py-6 px-6 relative">
              <Link to="/" className="block relative z-10">
                <img
                  src={Logo}
                  alt="Canstar Lights"
                  className="h-20 w-auto mx-auto object-contain drop-shadow-2xl"
                />
              </Link>
            </div>

            {/* ✅ Form Section */}
            <div className="p-8">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
