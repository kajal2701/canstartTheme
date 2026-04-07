import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { TRACK_TYPES } from "@/mocks/installMocks";

const PrepStage = ({ data, onChange, job }) => {
  const [showTrackPicker, setShowTrackPicker] = useState(false);

  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const linearFeet = data?.linearFeet || 0;
  const numberOfLights = Math.ceil(linearFeet * 1.5);

  return (
    <div className="space-y-6">
      {/* ── Header Info ── */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <Icon icon="ph:clipboard-text" className="text-indigo-500 text-xl" />
          Prep Checklist
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on the installation quote, verify and check off all items the installer is picking up.
        </p>
      </div>

      {/* ── Auto Calculated ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Icon icon="ph:ruler" className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Linear Feet</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{linearFeet} ft</p>
            </div>
          </div>
        </Card>

        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Icon icon="ph:lightbulb" className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Number of Lights</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{numberOfLights}</p>
              <p className="text-[10px] text-gray-400">= {linearFeet} ft × 1.5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Checklist ── */}
      <Card title="Pick-up Checklist" className="!shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="space-y-3">
          {/* Track Pieces */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTrackPicker(!showTrackPicker)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Icon icon="ph:arrow-line-down" className="text-blue-600" />
                </div>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Track Pieces</span>
                {data?.trackType && (
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                    {data.trackType}
                  </span>
                )}
              </div>
              <Icon
                icon={showTrackPicker ? "ph:caret-up" : "ph:caret-down"}
                className="text-gray-400"
              />
            </button>
            {showTrackPicker && (
              <div className="px-4 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-2">Select which track type the installer is picking up:</p>
                <div className="grid grid-cols-2 gap-2">
                  {TRACK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { update("trackType", type); setShowTrackPicker(false); }}
                      className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                        data?.trackType === type
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkbox items */}
          {[
            { key: "controllerBox",  label: "Controller Box",          icon: "ph:cpu",            color: "purple" },
            { key: "boostBox",       label: "Boost Box",               icon: "ph:lightning",      color: "yellow" },
            { key: "screws",         label: "Screws",                  icon: "ph:wrench",         color: "gray" },
            { key: "conduit",        label: "Conduit",                 icon: "ph:pipe",           color: "sky" },
            { key: "cableTie",       label: "Cable Tie",    icon: "ph:link",           color: "teal", optional: true },
            { key: "connectorsBag",  label: "Connectors Bag", icon: "ph:plugs-connected", color: "orange", optional: true },
          ].map((item) => (
            <label
              key={item.key}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                data?.[item.key]
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <input
                type="checkbox"
                checked={!!data?.[item.key]}
                onChange={(e) => update(item.key, e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className={`w-8 h-8 rounded-md bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                <Icon icon={item.icon} className={`text-${item.color}-600`} />
              </div>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              {item.optional && (
                <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                  Optional
                </span>
              )}
            </label>
          ))}

          {/* Other */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3">
            <label className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Icon icon="ph:dots-three" className="text-gray-600" />
              </div>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Other</span>
            </label>
            <textarea
              value={data?.other || ""}
              onChange={(e) => update("other", e.target.value)}
              placeholder="Any additional items..."
              rows={2}
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrepStage;
