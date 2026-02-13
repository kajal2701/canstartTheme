import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Multilevel from "./multi-lavel";

const Submenu = ({ activeSubmenu, item, i }) => {
  const [activeMultiMenu, setMultiMenu] = useState(null);

  const toggleMultiMenu = (j) => {
    if (activeMultiMenu === j) {
      setMultiMenu(null);
    } else {
      setMultiMenu(j);
    }
  };

  // Helper function to determine if a route needs exact matching
  const shouldUseEndProp = (childlink) => {
    // Check if this is a parent route (doesn't end with /add, /edit, etc.)
    // For routes like "users", "customer", "quote", "product" - use exact match
    const pathSegments = childlink.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    // If the last segment is one of these common parent routes, use end prop
    return !["add", "edit", "view", "detail"].includes(lastSegment);
  };

  function LockLink({ to, children, subItem }) {
    if (subItem.badge) {
      return (
        <span className="text-sm flex space-x-3 items-center transition-all duration-150 cursor-not-allowed">
          <span
            className={`bg-gray-600 dark:bg-white h-2 w-2 rounded-full border inline-block flex-none`}
          ></span>
          <div className="flex-1 dark:text-gray-300/60 text-gray-600/50">
            {subItem.childtitle}
            <span className="badge bg-cyan-500/10 text-cyan-500 py-1 ltr:ml-2 rtl:mr-2 rounded-full">
              {subItem.badge}
            </span>
          </div>
        </span>
      );
    } else {
      return (
        <NavLink
          to={to}
          end={shouldUseEndProp(to)} // Add end prop for exact matching
        >
          {children}
        </NavLink>
      );
    }
  }

  return (
    <Collapse isOpened={activeSubmenu === i}>
      <ul className="sub-menu space-y-[14px] pl-8 pr-6">
        {item.child?.map((subItem, j) => (
          <li
            key={j}
            className="block relative first:pt-3 last:pb-3 capitalize"
          >
            {subItem?.submenu ? (
              <div>
                <div
                  className="has-multilevel-menu text-sm flex space-x-3 items-center transition-all duration-150 cursor-pointer"
                  onClick={() => toggleMultiMenu(j)}
                >
                  <span className="flex-none h-2 w-2 rounded-full border inline-block bg-gray-600 dark:bg-white"></span>
                  <span className="flex-1 text-gray-600 dark:text-gray-300">
                    {subItem.childtitle}
                  </span>
                  <span className="flex-none">
                    <span
                      className={`menu-arrow transform transition-all duration-300 ${
                        activeMultiMenu === j ? " rotate-90" : ""
                      }`}
                    >
                      <Icon icon="ph:caret-right" />
                    </span>
                  </span>
                </div>
                <Multilevel
                  activeMultiMenu={activeMultiMenu}
                  j={j}
                  subItem={subItem}
                />
              </div>
            ) : (
              <LockLink to={subItem.childlink} subItem={subItem}>
                {({ isActive }) => (
                  <div>
                    <div
                      className={`${
                        isActive
                          ? " text-indigo-500 dark:text-white "
                          : "text-gray-600 dark:text-gray-300"
                      } text-sm flex space-x-3 items-center transition-all duration-150`}
                    >
                      <span
                        className={`${
                          isActive
                            ? " bg-indigo-500 dark:bg-gray-300   "
                            : " bg-gray-600 dark:bg-white"
                        } h-2 w-2 rounded-full border inline-block flex-none`}
                      ></span>
                      <span className="flex-1">
                        {subItem.childtitle}{" "}
                        {subItem.badge && (
                          <span className="badge bg-yellow-500/10 text-yellow-500 py-1 ltr:ml-2 rtl:mr-2 rounded-full">
                            {subItem.badge}
                            {".."}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </LockLink>
            )}
          </li>
        ))}
      </ul>
    </Collapse>
  );
};

export default Submenu;
