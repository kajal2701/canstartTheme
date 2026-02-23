import { useRef, useEffect, useState } from "react";
import Navmenu from "./Navmenu";
import Button from "@/components/ui/Button";
import { menuItems } from "@/mocks/data";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";

// import Canstar logo
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";

const MobileMenu = ({ className = "custom-class" }) => {
  const dispatch = useDispatch();
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [mobileMenu, setMobileMenu] = useMobileMenu();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
  };

  return (
    <div>
      <div
        className={`${className} fixed top-0 bg-white dark:bg-gray-800 shadow-lg h-full w-[280px]`}
      >
        {/* Logo Section */}
        <div className="logo-segment flex justify-between items-center bg-white dark:bg-gray-800 z-[9] h-[85px] px-4">
          <Link to="/dashboard">
            <div className={`inline-flex items-center justify-center `}>
              <img
                src={CanstarLogo}
                alt="Canstar Lights"
                className="h-14 w-auto object-contain"
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

        {/* Menu Items - Adjusted height to make room for logout */}
        <SimpleBar
          className="sidebar-menu h-[calc(100%-165px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>

        {/* Logout Button - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Button
            icon="ph:sign-out"
            text="Logout"
            className="btn-outline-danger block w-full hover:bg-red-500 hover:text-white transition-all duration-300"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
