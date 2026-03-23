import React from "react";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "tracks",      label: "Tracks",      icon: "ph:line-segments",     color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "screws",      label: "Screws",       icon: "ph:screwdriver",       color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  { id: "controllers", label: "Controllers",  icon: "ph:cpu",               color: "bg-purple-50 text-purple-600 border-purple-200" },
  { id: "boost",       label: "Boost Box",    icon: "ph:cube",              color: "bg-green-50 text-green-600 border-green-200" },
  { id: "connectors",  label: "Connectors",   icon: "ph:plug",              color: "bg-pink-50 text-pink-600 border-pink-200" },
  { id: "lights",      label: "Lights",       icon: "ph:lightbulb",         color: "bg-orange-50 text-orange-600 border-orange-200" },
  { id: "cables",      label: "Cables",       icon: "ph:plugs-connected",             color: "bg-teal-50 text-teal-600 border-teal-200" },
  { id: "jumpers",     label: "Jumpers",      icon: "ph:arrows-horizontal", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  { id: "plugs",       label: "Plugs",        icon: "ph:plug-charging",     color: "bg-red-50 text-red-600 border-red-200" },
  { id: "powercord",   label: "Power Cord",   icon: "ph:power",             color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
];

const InventoryIndex = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>
      <p className="text-gray-500 mb-6 text-sm">Select a category to view and manage inventory items.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/inventory/${tab.id}`)}
            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${tab.color}`}
          >
            <Icon icon={tab.icon} className="text-3xl" />
            <p className="font-semibold text-sm">{tab.label}</p>
          </button>
        ))}
      </div>
    </>
  );
};

export default InventoryIndex;