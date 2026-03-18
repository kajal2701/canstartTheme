import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { mapUserRole } from "@/utils/mappers";
import clsx from "clsx";
import UserAvatar from "@/assets/images/avatar/avatar.jpg";

const ProfileLabel = ({ sticky, user }) => {
  return (
    <div
      className={clsx(" rounded-full transition-all duration-300", {
        "h-9 w-9": sticky,
        "lg:h-12 lg:w-12 h-7 w-7": !sticky,
      })}
    >
      <img
        src={user?.avatar || UserAvatar}
        alt=""
        className="block w-full h-full object-cover rounded-full ring-1 ring-indigo-700 ring-offset-4 dark:ring-offset-gray-700"
      />
    </div>
  );
};

const Profile = ({ sticky }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const ProfileMenu = [
    {
      label: "My Profile",
      subLabel: "Account Settings",
      icon: "ph:user-circle-light",
      status: "green",
      action: () => {
        navigate("/profile");
      },
    },
   
  ];

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");
    dispatch(logout());
  };
  return (
    <Dropdown
      label={<ProfileLabel sticky={sticky} user={user} />}
      classMenuItems="w-[220px] top-[58px]  "
    >
      <div className="flex items-center px-4 py-3 border-b border-gray-10 mb-3">
        <div className="flex-none ltr:mr-[10px] rtl:ml-[10px]">
          <div className="h-[46px] w-[46px] rounded-full">
            <img
              src={user?.avatar || UserAvatar}
              alt=""
              className="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-1 text-gray-700 dark:text-white text-sm font-semibold  ">
          <span className=" truncate w-full block">
            {user?.fname && user?.lname 
              ? `${user.fname} ${user.lname}` 
              : user?.name || 'User'
            }
          </span>
          <span className="block font-light text-xs">
            {mapUserRole(user?.role)}
          </span>
        </div>
      </div>
      <div className=" space-y-3">
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                onClick={() => item.action()}
                className={`${
                  active
                    ? " text-indigo-500 "
                    : "text-gray-600 dark:text-gray-300"
                } block transition-all duration-150 group     `}
              >
                <div className={`block cursor-pointer px-4 `}>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse ">
                    <span
                      className={`flex-none h-9 w-9  inline-flex items-center justify-center group-hover:scale-110 transition-all duration-200  rounded-full text-2xl  text-white
                       ${item.status === "cyan" ? "bg-cyan-500 " : ""} 
                       ${item.status === "blue" ? "bg-indigo-500 " : ""} 
                      ${item.status === "red" ? "bg-red-500 " : ""} 
                      ${item.status === "green" ? "bg-green-500 " : ""}${
                        item.status === "yellow" ? "bg-yellow-500 " : ""
                      }
                      `}
                    >
                      <Icon icon={item.icon} />
                    </span>
                    <div className="block text-sm">
                      <div className="font-medium">{item.label}</div>
                      {item.subLabel && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
        <Menu.Item onClick={handleLogout}>
          <div
            className={`block cursor-pointer px-4 border-t border-gray-10 py-3 mt-1 text-indigo-500 `}
          >
            <Button
              icon="ph:upload-simple-light"
              rotate={1}
              text="Logout"
              className="btn-primary block w-full btn-sm "
            />
          </div>
        </Menu.Item>
      </div>
    </Dropdown>
  );
};

export default Profile;
