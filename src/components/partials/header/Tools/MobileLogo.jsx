import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import CanstarLogo from "@/assets/images/logo/canstar-logo.svg";

const MobileLogo = () => {
  const [isDark] = useDarkMode();

  return (
    <Link to="/" className="block">
      {!isDark ? (
        // Light mode: Add dark background for visibility
        <div className="bg-gradient-to-br from-[#0F2027] via-[#1a3038] to-[#2C5364] rounded-lg p-2 inline-block">
          <img
            src={CanstarLogo}
            alt="Canstar Lights"
            className="h-8 w-auto object-contain"
          />
        </div>
      ) : (
        // Dark mode: Logo shows naturally
        <img
          src={CanstarLogo}
          alt="Canstar Lights"
          className="h-8 w-auto object-contain"
        />
      )}
    </Link>
  );
};

export default MobileLogo;
