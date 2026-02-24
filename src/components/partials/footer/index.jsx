import React from "react";

const Footer = ({ className = "custom-class" }) => {
  return (
    <footer className={className}>
      <div className="site-footer px-6 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 py-4">
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5">
          <div className="text-center ltr:md:text-start rtl:md:text-right text-sm">
            COPYRIGHT &copy; 2022 CanStar System, All rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
