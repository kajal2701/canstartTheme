import React from "react";
import Icon from "@/components/ui/Icon";

const QuoteButton = ({ 
  icon, 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  className = "",
  ...props 
}) => {
  const baseClasses = "flex items-center gap-2 font-semibold transition-all shadow-sm";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
    outline: "border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    outlineOrange: "border border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40",
    gradient: "bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-sm font-bold tracking-wide rounded-xl"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <Icon icon={icon} className="text-base" />}
      {children}
    </button>
  );
};

export default QuoteButton;
