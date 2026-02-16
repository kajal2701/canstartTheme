import React from "react";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
import useDarkMode from "@/hooks/useDarkMode";
import CanstarLogo from "@/assets/images/logo/canstar-logo.svg";

const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          // Desktop: Full logo
          <div
            className={`${!isDark ? "bg-gradient-to-br from-[#0F2027] via-[#1a3038] to-[#2C5364] rounded-lg p-2" : ""}`}
          >
            <img
              src={CanstarLogo}
              alt="Canstar Lights"
              className="h-10 w-auto object-contain"
            />
          </div>
        ) : (
          // Mobile: Smaller logo with background in light mode
          <div
            className={`${!isDark ? "bg-gradient-to-br from-[#0F2027] via-[#1a3038] to-[#2C5364] rounded-lg p-1.5" : ""}`}
          >
            <img
              src={CanstarLogo}
              alt="Canstar Lights"
              className="h-8 w-auto object-contain"
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default Logo;
