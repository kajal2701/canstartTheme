import React, { useRef, useEffect, useState } from "react";
import Navmenu from "./Navmenu";
import { menuItems } from "@/mocks/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";

// import Canstar logo
import CanstarLogo from "@/assets/images/logo/canstar-logo.svg";

const MobileMenu = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`${className} fixed top-0 bg-white dark:bg-gray-800 shadow-lg h-full w-[280px]`}
      >
        {/* Logo Section */}
        <div className="logo-segment flex justify-between items-center bg-white dark:bg-gray-800 z-[9] h-[85px] px-4">
          <Link to="/dashboard">
            {/* Logo Icon with conditional background */}
            <div
              className={`inline-flex items-center justify-center ${
                !isDark && !isSemiDark
                  ? "bg-gradient-to-br from-[#0F2027] via-[#1a3038] to-[#2C5364] rounded-lg p-2"
                  : ""
              }`}
            >
              <img
                src={CanstarLogo}
                alt="Canstar Lights"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="cursor-pointer text-gray-900 dark:text-white text-2xl hover:text-red-500 transition-colors"
          >
            <Icon icon="heroicons:x-mark" />
          </button>
        </div>

        {/* Scroll Shadow */}
        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Menu Items */}
        <SimpleBar
          className="sidebar-menu h-[calc(100%-80px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>
      </div>
    </div>
  );
};

export default MobileMenu;
