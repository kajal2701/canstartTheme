import React from "react";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
import useDarkMode from "@/hooks/useDarkMode";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";

const Logo = () => {
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          // Desktop: Full logo
          <div>
            <img
              src={CanstarLogo}
              alt="Canstar Lights"
              className="h-10 w-auto object-contain"
            />
          </div>
        ) : (
          // Mobile: Smaller logo with background in light mode
          <div>
            <img
              src={CanstarLogo}
              alt="Canstar Lights"
              className="h-10 w-auto object-contain"
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default Logo;
