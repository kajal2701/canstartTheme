import React from "react";
import Icon from "@/components/ui/Icon";

const StepHeader = ({ icon, iconColorClass, title, description, colorClass }) => (
  <div className={`bg-gradient-to-r ${colorClass} rounded-xl p-5 border`}>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
      <Icon icon={icon} className={`${iconColorClass} text-xl`} />
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </div>
);

export default StepHeader;
