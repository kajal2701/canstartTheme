import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import Button from "@/components/ui/Button";
import { menuItems } from "@/mocks/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);
  const [isSemiDark] = useSemiDark();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
  };

  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={clsx(
          "sidebar-wrapper bg-white dark:bg-gray-800 shadow-base",
          {
            "w-[72px] close_sidebar": collapsed,
            "w-[280px]": !collapsed,
            "sidebar-hovered": menuHover,
          },
        )}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
      >
        <SidebarLogo menuHover={menuHover} />

        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Menu Items - Adjusted height to make room for logout */}
        <SimpleBar
          className="sidebar-menu h-[calc(100%-160px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>

        {/* Logout Button - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Button
            icon="ph:sign-out"
            text={!collapsed || menuHover ? "Logout" : ""}
            className="btn-outline-danger block w-full hover:bg-red-500 hover:text-white transition-all duration-300"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
