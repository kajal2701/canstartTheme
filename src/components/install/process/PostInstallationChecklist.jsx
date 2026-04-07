import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { JUMPER_SIZES, CONNECTOR_SIZES } from "@/mocks/installMocks";

const CHECKLIST_ITEMS = [
  { key: "lights",     label: "Lights",      icon: "ph:lightbulb",         hasSize: false },
  { key: "tracks",     label: "Tracks",      icon: "ph:arrow-line-down",   hasSize: false },
  { key: "boostWire",  label: "Boost Wire",  icon: "ph:lightning",         hasSize: false },
  { key: "sjoowWire",  label: "Sjoow Wire",  icon: "ph:plug",             hasSize: false },
  { key: "jumpers",    label: "Jumpers",     icon: "ph:link-simple",       hasSize: true, sizes: JUMPER_SIZES },
  { key: "connectors", label: "Connectors",  icon: "ph:plugs-connected",  hasSize: true, sizes: CONNECTOR_SIZES },
  { key: "other",      label: "Other",       icon: "ph:dots-three",        hasSize: false },
];

const PostInstallationChecklist = ({ data, onChange }) => {
  const checklist = data?.checklist || {};

  const updateItem = (key, field, value) => {
    onChange({
      ...data,
      checklist: {
        ...checklist,
        [key]: { ...checklist[key], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:check-square" className="text-emerald-500 text-xl" />
          Post Installation Checklist
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Record how many items were used and any waste generated during the installation.
        </p>
      </div>

      {/* ── Checklist Table ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 !p-0 overflow-hidden">
        {/* Header row */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
          <div className="col-span-3">Item</div>
          <div className="col-span-2">Used</div>
          <div className="col-span-2">Waste</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-3">Notes</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {CHECKLIST_ITEMS.map((item) => {
            const row = checklist[item.key] || {};
            return (
              <div
                key={item.key}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                {/* Item label */}
                <div className="col-span-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon icon={item.icon} className="text-emerald-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>

                {/* Used */}
                <div className="col-span-2">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Used</label>
                  <input
                    type="number"
                    min="0"
                    value={row.used || ""}
                    onChange={(e) => updateItem(item.key, "used", e.target.value)}
                    placeholder="0"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Waste */}
                <div className="col-span-2">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Waste</label>
                  <input
                    type="number"
                    min="0"
                    value={row.waste || ""}
                    onChange={(e) => updateItem(item.key, "waste", e.target.value)}
                    placeholder="0"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Size dropdown */}
                <div className="col-span-2">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Size</label>
                  {item.hasSize ? (
                    <select
                      value={row.size || ""}
                      onChange={(e) => updateItem(item.key, "size", e.target.value)}
                      className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select</option>
                      {item.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center h-full">—</span>
                  )}
                </div>

                {/* Notes */}
                <div className="col-span-3">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Notes</label>
                  <input
                    type="text"
                    value={row.notes || ""}
                    onChange={(e) => updateItem(item.key, "notes", e.target.value)}
                    placeholder="Notes..."
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PostInstallationChecklist;
