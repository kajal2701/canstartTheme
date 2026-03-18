import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Avatar from "@/components/ui/Avatar";
import { useSelector } from "react-redux";
import { mapUserRole } from "@/utils/mappers";
// import images
import ProfileImage from "@/assets/images/avatar/avatar.jpg";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.fname || '',
    lastName: user?.lname || '',
    email: user?.email || '',
    role: mapUserRole(user?.role) || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const tabs = [
    { icon: "ph:user-circle", label: "Account" },
    { icon: "ph:lock-key", label: "Change Password" },

  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-3 col-span-12">
            <Card
              title={
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className=" shrink-0">
                    <Avatar
                      src={user?.avatar || ProfileImage}
                      className="h-14 w-14"
                      imgClass=""
                      alt="Profile"
                    />
                  </div>
                  <div className="flex-1 text-gray-700 dark:text-white text-sm font-semibold  ">
                    <span className=" truncate w-full block">
                      {user?.fname && user?.lname
                        ? `${user.fname} ${user.lname}`
                        : user?.name || 'User'}
                    </span>
                    <span className="block font-light text-xs">
                      {mapUserRole(user?.role)}
                    </span>
                  </div>
                </div>
              }
            >
              <ul className=" space-y-2">
                {tabs.map((item) => (
                  <li
                    key={item.label}
                    className={`
                      ${item.label === selectedTab.label
                        ? "bg-primary text-white"
                        : ""
                      }
                        flex space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-primary hover:text-white capitalize  cursor-pointer`}
                    onClick={() => setSelectedTab(item)}
                  >
                    <div className="flex-none text-xl ">
                      <Icon icon={item.icon} />
                    </div>
                    <div className="flex-1 text-sm">{item.label}</div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-9 col-span-12 space-y-5">
            {selectedTab && selectedTab.label === "Account" && (
              <div className="space-y-6">

                <Card title="Personal Details">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Textinput
                        label="First Name"
                        type="text"
                        placeholder="First Name"
                        id="first_name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                      <Textinput
                        label="Last Name"
                        type="text"
                        placeholder="Last Name"
                        id="last_name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                      <Textinput
                        label="Email"
                        type="email"
                        placeholder="info@example.com"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <Textinput
                        label="Role"
                        type="text"
                        placeholder="Role"
                        id="role"
                        value={formData.role}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                      <Button text="Save" className="btn-primary" />
                      <Button text="Cancel" className="btn-outline-primary" />
                    </div>
                  </div>
                </Card>
              </div>
            )}
            {selectedTab && selectedTab.label === "Change Password" && (
              <div className="space-y-6">


                <Card title="Change Password">
                  <div className="space-y-5">
                    <Textinput
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                      id="current_password"
                      hasicon
                    />
                    <Textinput
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      id="new_password"
                      hasicon
                    />
                    <Textinput
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      id="confirm_password"
                      hasicon
                    />
                  </div>
                  <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse mt-5">
                    <Button text="Save" className="btn-primary" />
                    <Button text="Cancel" className="btn-outline-primary" />
                  </div>
                </Card>


              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
