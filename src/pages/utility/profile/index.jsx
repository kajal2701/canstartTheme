import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Avatar from "@/components/ui/Avatar";
import Select from "react-select";
import Switch from "@/components/ui/Switch";
// import images
import { motion, AnimatePresence } from "framer-motion";
import ProfileImage from "@/assets/images/avatar/avatar.jpg";
const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleResetFile = () => {
    setSelectedFile(null);
  };
  const tabs = [
    { icon: "ph:user-circle", label: "Account" },
    { icon: "ph:bell-ringing", label: "Notifications" },
    { icon: "ph:credit-card", label: "Bills" },
    { icon: "ph:lock-key", label: "Security" },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  console.log(tabs[0]);
  const locations = [
    { value: "united_kingdom", label: "United Kingdom" },
    { value: "united_states", label: "United States" },
    { value: "india", label: "India" },
    { value: "japan", label: "Japan" },
    { value: "italy", label: "Italy" },
  ];
  const currencies = [
    { value: "inr", label: "India (INR)" },
    { value: "usd", label: "United States (USD)" },
    { value: "gbp", label: "United Kingdom (GBP)" },
    { value: "eur", label: "Euro (EUR)" },
    { value: "jpy", label: "Japan (JPY)" },
  ];
  const timezones = [
    { value: "UTC+0", label: "UTC" },
    { value: "UTC+2", label: "UTC+2:00 Athens, Bucharest" },
    { value: "UTC+5:30", label: "UTC+5:30 India Standard Time" },
    { value: "UTC-5", label: "UTC-5:00 Eastern Time" },
  ];
  const selectStyles = {
    option: (provided) => ({ ...provided, fontSize: "14px" }),
    control: (provided) => ({ ...provided, minHeight: 42 }),
  };
  const [notifEmail, setNotifEmail] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [orderConfirm, setOrderConfirm] = useState(true);
  const [orderStatus, setOrderStatus] = useState(true);
  const [orderDelivered, setOrderDelivered] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [tz, setTz] = useState(timezones[1]);
  const [ignoreTracking, setIgnoreTracking] = useState(false);
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
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : ProfileImage
                      }
                      className="h-14 w-14"
                      imgClass=""
                      alt={selectedFile?.name}
                    />
                  </div>
                  <div className="text-gray-700 dark:text-white text-sm font-semibold  ">
                    <span className=" truncate w-full block">Faruk Ahamed</span>
                    <span className="block font-light text-xs   capitalize">
                      super admin
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
                      ${
                        item.label === selectedTab.label
                          ? "bg-indigo-500 text-white"
                          : ""
                      }
                        flex space-x-3 rtl:space-x-reverse px-3 py-2 rounded-md hover:bg-indigo-500/10 hover:text-indigo-500 capitalize  cursor-pointer`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Change Profile">
                    <div className="space-y-4">
                      <Fileinput
                        selectedFile={selectedFile}
                        onChange={handleFileChange}
                        preview
                      >
                        <div className="flex space-x-3 rtl:space-x-reverse">
                          <Button
                            div
                            icon="ph:upload"
                            text="Upload"
                            iconClass="text-xl"
                            className="btn-primary light btn-sm"
                          />
                          <Button
                            div
                            text="Reset"
                            className="btn-outline-danger btn-sm"
                            onClick={handleResetFile}
                          />
                        </div>
                      </Fileinput>
                      <div className="text-xs text-gray-500">
                        Allowed JPG, GIF or PNG. Max size of 800K
                      </div>
                    </div>
                  </Card>
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
                  </Card>
                </div>
                <Card title="Personal Details">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <Textinput
                        label="Your Name"
                        type="text"
                        placeholder="Your Name"
                        id="your_name"
                      />
                      <Textinput
                        label="Store Name"
                        type="text"
                        placeholder="Store Name"
                        id="store_name"
                      />
                      <div>
                        <label className="form-label">Location</label>
                        <Select
                          className="react-select"
                          classNamePrefix="select"
                          placeholder="-- Select Location --"
                          options={locations}
                          styles={selectStyles}
                        />
                      </div>
                      <div>
                        <label className="form-label">Currency</label>
                        <Select
                          className="react-select"
                          classNamePrefix="select"
                          placeholder="-- Select Currency --"
                          options={currencies}
                          styles={selectStyles}
                        />
                      </div>
                      <Textinput
                        label="Email"
                        type="email"
                        placeholder="info@example.com"
                        id="pd_email"
                      />
                      <Textinput
                        label="Phone"
                        type="text"
                        placeholder="+91 123456 65478"
                        id="pd_phone"
                      />
                      <div className="xl:col-span-3 md:col-span-2 col-span-1">
                        <Textinput
                          label="Address"
                          type="text"
                          placeholder="814 Howard Street, 120065, India"
                          id="pd_address"
                        />
                      </div>
                    </div>
                    <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                      <Button text="Save" className="btn-primary light" />
                      <Button text="Cancel" className="btn-outline-danger" />
                    </div>
                  </div>
                </Card>
              </div>
            )}
            {selectedTab && selectedTab.label !== "Account" && (
              <>
                {selectedTab.label === "Notifications" && (
                  <div className="space-y-6">
                    <Card title="Notification Preferences">
                      <div className="space-y-5">
                        <Textinput
                          label="Email Address"
                          type="email"
                          placeholder="email@example.com"
                          id="notif_email"
                          onChange={(e) => setNotifEmail(e.target.value)}
                        />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                              <Icon
                                icon="ph:newspaper-clipping"
                                className="text-xl"
                              />
                              <div>
                                <div className="font-semibold text-sm">
                                  Our newsletter
                                </div>
                                <div className="text-xs text-gray-500">
                                  Stay informed about important changes
                                </div>
                              </div>
                            </div>
                            <Switch
                              value={newsletter}
                              onChange={() => setNewsletter(!newsletter)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                              <Icon
                                icon="ph:check-circle"
                                className="text-xl"
                              />
                              <div>
                                <div className="font-semibold text-sm">
                                  Order Confirmation
                                </div>
                                <div className="text-xs text-gray-500">
                                  When an order is confirmed or a product is
                                  updated
                                </div>
                              </div>
                            </div>
                            <Switch
                              value={orderConfirm}
                              onChange={() => setOrderConfirm(!orderConfirm)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                              <Icon
                                icon="ph:arrows-left-right"
                                className="text-xl"
                              />
                              <div>
                                <div className="font-semibold text-sm">
                                  Order Status Changed
                                </div>
                                <div className="text-xs text-gray-500">
                                  You will be notified when the customer makes
                                  changes to the order
                                </div>
                              </div>
                            </div>
                            <Switch
                              value={orderStatus}
                              onChange={() => setOrderStatus(!orderStatus)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                              <Icon icon="ph:truck" className="text-xl" />
                              <div>
                                <div className="font-semibold text-sm">
                                  Order Delivered
                                </div>
                                <div className="text-xs text-gray-500">
                                  You will be notified when the order is
                                  delivered
                                </div>
                              </div>
                            </div>
                            <Switch
                              value={orderDelivered}
                              onChange={() =>
                                setOrderDelivered(!orderDelivered)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                              <Icon icon="ph:envelope" className="text-xl" />
                              <div>
                                <div className="font-semibold text-sm">
                                  Email Notification
                                </div>
                                <div className="text-xs text-gray-500">
                                  Send notifications to guests via email
                                </div>
                              </div>
                            </div>
                            <Switch
                              value={emailNotif}
                              onChange={() => setEmailNotif(!emailNotif)}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card title="Date & Time">
                      <div className="space-y-3">
                        <label className="form-label">Time zone</label>
                        <Select
                          className="react-select"
                          classNamePrefix="select"
                          placeholder="Select time zone"
                          options={timezones}
                          styles={selectStyles}
                          value={tz}
                          onChange={(v) => setTz(v)}
                        />
                      </div>
                    </Card>
                    <Card title="Ignore Tracking">
                      <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                        <div>
                          <div className="font-semibold text-sm">
                            Ignore Browser Tracking
                          </div>
                          <div className="text-xs text-gray-500">
                            Browser cookies
                          </div>
                        </div>
                        <Switch
                          value={ignoreTracking}
                          onChange={() => setIgnoreTracking(!ignoreTracking)}
                        />
                      </div>
                    </Card>
                    <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                      <Button text="Save" className="btn-primary light" />
                      <Button text="Cancel" className="btn-outline-danger" />
                    </div>
                  </div>
                )}
                {selectedTab.label === "Bills" && (
                  <div className="space-y-6">
                    <Card title="Billing Information">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Textinput
                          label="Business Name"
                          placeholder="Violeta Analytics"
                          id="bill_business"
                        />
                        <Textinput
                          label="Business Sector"
                          placeholder="Arts, Media & Entertainment"
                          id="bill_sector"
                        />
                        <Textinput
                          label="Business Address"
                          placeholder="Kurunala"
                          id="bill_address"
                        />
                        <Textinput
                          label="Country"
                          placeholder="Romania"
                          id="bill_country"
                        />
                        <Textinput
                          label="First Name"
                          placeholder="First Name"
                          id="bill_fname"
                        />
                        <Textinput
                          label="Last Name"
                          placeholder="Last Name"
                          id="bill_lname"
                        />
                      </div>
                    </Card>
                    <Card title="Current Plan : Executive">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Thanks for being a premium member and supporting our
                          development.
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Icon icon="ph:medal" className="text-green-500" />
                          <span className="text-green-600 font-semibold">
                            750,000 Monthly Visits
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 space-x-3 rtl:space-x-reverse">
                        <Button
                          text="Change Plan"
                          className="btn-primary light btn-sm"
                        />
                        <Button
                          text="Reset Plan"
                          className="btn-outline-danger btn-sm"
                        />
                      </div>
                    </Card>
                    <Card title="Payment Method">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Icon icon="ph:credit-card" className="text-xl" />
                            <div>
                              <div className="text-sm font-semibold">Visa</div>
                              <div className="text-xs text-gray-500">
                                •••• 1902
                              </div>
                            </div>
                          </div>
                          <div className="space-x-3 rtl:space-x-reverse">
                            <Button
                              text="Cancel Subscription"
                              className="btn-outline-danger btn-sm"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          If you update your payment method, it will take effect
                          after the next billing cycle.
                        </div>
                      </div>
                    </Card>
                    <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                      <Button text="Save" className="btn-primary light" />
                      <Button text="Cancel" className="btn-outline-danger" />
                    </div>
                  </div>
                )}
                {selectedTab.label === "Security" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card title="Two-factor Authentication">
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Corrupti sapiente sunt earum officiis
                            laboriosam ut.
                          </div>
                          <Button
                            text="Enable"
                            className="btn-primary light btn-sm"
                          />
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-sm">
                                  Authentication App
                                </div>
                                <div className="text-xs text-gray-500">
                                  Google auth app
                                </div>
                              </div>
                              <Button
                                text="Setup"
                                className="btn-outline-primary btn-sm"
                              />
                            </div>
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-sm">
                                  Another e-mail
                                </div>
                                <div className="text-xs text-gray-500">
                                  E-mail to send verification link
                                </div>
                              </div>
                              <Button
                                text="Setup"
                                className="btn-outline-primary btn-sm"
                              />
                            </div>
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-sm">
                                  SMS Recovery
                                </div>
                                <div className="text-xs text-gray-500">
                                  Your phone number for recovery
                                </div>
                              </div>
                              <Button
                                text="Setup"
                                className="btn-outline-primary btn-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card title="Devices">
                        <div className="space-y-4">
                          <div className="text-sm text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Corrupti sapiente sunt earum officiis
                            laboriosam ut.
                          </div>
                          <Button
                            text="Sign out from all devices"
                            className="btn-outline-danger btn-sm"
                          />
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <Icon
                                  icon="ph:device-mobile"
                                  className="text-xl"
                                />
                                <div>
                                  <div className="text-sm font-semibold">
                                    iPhone 14
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    London UK, Oct 23 at 1:15 AM
                                  </div>
                                </div>
                              </div>
                              <Icon
                                icon="ph:dots-three-vertical"
                                className="text-xl"
                              />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <Icon
                                  icon="ph:device-laptop"
                                  className="text-xl"
                                />
                                <div>
                                  <div className="text-sm font-semibold">
                                    Macbook Air
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Gujarat India, Oct 24 at 3:15 AM
                                  </div>
                                </div>
                              </div>
                              <Icon
                                icon="ph:dots-three-vertical"
                                className="text-xl"
                              />
                            </div>
                          </div>
                          <Button
                            text="Need Help ?"
                            className="btn-outline-primary btn-sm"
                          />
                          <Button
                            text="Need Help?"
                            className="btn-outline-primary btn-sm hidden"
                          />
                        </div>
                      </Card>
                    </div>
                    <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                      <Button text="Save" className="btn-primary light" />
                      <Button text="Cancel" className="btn-outline-danger" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
