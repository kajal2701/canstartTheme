import React from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";

// import images
import MobileLogo from "@/assets/images/logo/logo-c.svg";
import MobileLogoWhite from "@/assets/images/logo/logo-c-white.svg";
import canStarLogo from "@/assets/images/logo/canstar-logo.svg";

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  const [isSemiDark] = useSemiDark();

  return (
    <div
      className={`logo-segment flex justify-between items-center z-[9] py-6 px-4  
      ${menuHover ? "logo-hovered" : ""}
      ${!isDark ? " bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]" : ""}
      `}
    >
      <Link to="/dashboard">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="h-[45px] w-auto">
            <div className="h-full flex items-center">
              <img
                src={canStarLogo}
                alt="Canstar Lights"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 border-[1px] border-gray-400 rounded-full transition-all duration-150 cursor-pointer
          ${
            collapsed
              ? ""
              : "ring-1 ring-inset ring-offset-[4px] ring-gray-400 bg-gray-400 ring-offset-gray-800"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
