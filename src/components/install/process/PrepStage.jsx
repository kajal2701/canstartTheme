import { useState, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import StepHeader from "./StepHeader";
import { TRACK_TYPES } from "@/utils/constants";
import { calculateAutoQuantities, blockInvalidNumberKeys } from "@/utils/helperFunctions";

const PrepStage = ({ data, onChange }) => {
  const [showTrackPicker, setShowTrackPicker] = useState(false);

  const update = useCallback((field, value) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const otherItems = data?.otherItems || [];

  const addOtherItem = useCallback(() => {
    update("otherItems", [...otherItems, { name: "", qty: "" }]);
  }, [otherItems, update]);

  const updateOtherItem = useCallback((index, field, value) => {
    const items = [...otherItems];
    items[index] = { ...items[index], [field]: value };
    update("otherItems", items);
  }, [otherItems, update]);

  const removeOtherItem = useCallback((index) => {
    const items = [...otherItems];
    items.splice(index, 1);
    update("otherItems", items);
  }, [otherItems, update]);

  const linearFeet = data?.linearFeet || 0;
  const { numberOfLights, numberOfScrews, numberOfTracks } = calculateAutoQuantities(linearFeet);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StepHeader
        icon="ph:clipboard-text"
        iconColorClass="text-indigo-500"
        title="Prep Stage"
        description="Review the initial setup and required items. Core items are auto-calculated from the linear feet."
        colorClass="from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-800"
      />

      {/* ── Auto Calculated ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Linear Feet",
            value: `${linearFeet} ft`,
            icon: "ph:ruler",
            iconBg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600",
            subtitle: null,
          },
          {
            title: "Number of Lights",
            value: numberOfLights,
            icon: "ph:lightbulb",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
            iconColor: "text-emerald-600",
            subtitle: `= ${linearFeet} ft × 1.5`,
          },
        ].map((item, index) => (
          <Card key={index} className="!shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                <Icon icon={item.icon} className={`text-xl ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.title}</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                {item.subtitle && <p className="text-[10px] text-gray-400">{item.subtitle}</p>}
              </div>
            </div>
          </Card>
        ))}
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
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Icon icon="ph:arrow-line-down" className="text-blue-600" />
                </div>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Track Pieces</span>

                <span className="text-xs text-gray-500 ml-auto">
                  Qty: <span className="font-semibold">{numberOfTracks}</span>
                </span>

                {data?.trackType && (
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                    {data.trackType}
                  </span>
                )}
              </div>
              <Icon
                icon={showTrackPicker ? "ph:caret-up" : "ph:caret-down"}
                className="text-gray-400 ml-3"
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
                      onClick={() => { 
                        onChange({ ...data, trackType: type, trackQty: numberOfTracks }); 
                        setShowTrackPicker(false); 
                      }}
                      className={`text-sm px-3 py-2 rounded-lg border transition-all ${data?.trackType === type
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

          {/* Quote Products — all products from the quote as simple checkboxes */}
          {(data?.quoteProducts || []).length > 0 && (data.quoteProducts).map((product, idx) => (
            <div
              key={`qp_${idx}`}
              className={`rounded-lg border transition-all ${product.picked
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!product.picked}
                  onChange={(e) => {
                    const updated = [...(data.quoteProducts)];
                    updated[idx] = { ...updated[idx], picked: e.target.checked };
                    update("quoteProducts", updated);
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Icon icon="ph:package" className="text-purple-600" />
                </div>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{product.product}</span>
                {product.qty && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Qty: <span className="font-semibold">{product.qty}</span>
                  </span>
                )}
              </label>
            </div>
          ))}

          {/* Other checkbox items */}
          {[
            { key: "screws", label: "Screws", icon: "ph:wrench", color: "gray", qty: numberOfScrews },
            { key: "conduit", label: "Conduit", icon: "ph:pipe", color: "sky", optional: true },
            { key: "cableTie", label: "Cable Tie", icon: "ph:link", color: "teal", optional: true },
            { key: "connectorsBag", label: "Connectors Bag", icon: "ph:plugs-connected", color: "orange", optional: true },
          ].map((item) => (
            <div
              key={item.key}
              className={`rounded-lg border transition-all ${data?.[item.key]
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!data?.[item.key]}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (item.key === "screws") {
                      update(item.key, isChecked ? item.qty : false);
                    } else {
                      update(item.key, isChecked);
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className={`w-8 h-8 rounded-md bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                  <Icon icon={item.icon} className={`text-${item.color}-600`} />
                </div>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                {item.qty && (
                  <span className="text-xs text-gray-500 ml-auto">
                    Qty: <span className="font-semibold">{item.qty}</span>
                  </span>
                )}
                {item.detail && (
                  <span className="text-xs text-gray-500 ml-2">{item.detail}</span>
                )}
                {item.optional && (
                  <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                    Optional
                  </span>
                )}
              </label>
              {/* Quantity input for optional items when checked */}
              {item.optional && data?.[item.key] && (
                <div className="px-4 pb-3 pt-1 border-t border-green-100 dark:border-green-800/50">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Qty:</label>
                    <input
                      type="number"
                      min="0"
                      value={data?.[`${item.key}Qty`] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          update(`${item.key}Qty`, "");
                        } else {
                          const num = Number(val);
                          if (num >= 0) {
                            update(`${item.key}Qty`, val);
                          }
                        }
                      }}
                      onKeyDown={blockInvalidNumberKeys}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Enter quantity"
                      className="w-32 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Other */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Icon icon="ph:dots-three" className="text-gray-600" />
                </div>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Other</span>
              </label>
              <button
                type="button"
                onClick={addOtherItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-medium transition-all"
              >
                <Icon icon="ph:plus" />
                Add
              </button>
            </div>

            {(data?.otherItems || []).length > 0 && (
              <div className="space-y-2">
                {(data?.otherItems || []).map((item, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <div className="flex-1">
                      {index === 0 && (
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                      )}
                      <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => updateOtherItem(index, "name", e.target.value)}
                        placeholder="Item name"
                        className={`w-full text-sm px-3 py-1.5 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${item.name !== undefined && item.name.trim() === "" && item._touched
                          ? "border-red-400 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-600"
                          }`}
                        onBlur={() => updateOtherItem(index, "_touched", true)}
                      />
                    </div>
                    <div className="w-28">
                      {index === 0 && (
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Qty</label>
                      )}
                      <input
                        type="number"
                        min="0"
                        value={item.qty ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            updateOtherItem(index, "qty", "");
                          } else {
                            const num = Number(val);
                            if (num >= 0) {
                              updateOtherItem(index, "qty", val);
                            }
                          }
                        }}
                        onKeyDown={blockInvalidNumberKeys}
                        onWheel={(e) => e.target.blur()}
                        placeholder="Qty"
                        className={`w-full text-sm px-3 py-1.5 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${item.qty !== undefined && (item.qty === "" || Number(item.qty) <= 0) && item._touched
                          ? "border-red-400 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-600"
                          }`}
                        onBlur={() => {
                          const items = [...(data?.otherItems || [])];
                          items[index] = { ...items[index], _touched: true };
                          update("otherItems", items);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOtherItem(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 mb-[1px]"
                    >
                      <Icon icon="ph:trash" className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrepStage;
