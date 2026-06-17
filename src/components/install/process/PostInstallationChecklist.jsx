import React, { useMemo } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import StepHeader from "./StepHeader";
import { PREP_CHECKBOX_ITEMS } from "@/utils/constants";
import { calculateAutoQuantities, blockInvalidNumberKeys } from "@/utils/helperFunctions";


export const getTakenItemsList = (prepData) => {
  const items = [];
  const linearFeet = prepData?.linearFeet || 0;
  const calcValues = calculateAutoQuantities(linearFeet);

  // 1. Lights (always auto-calculated)
  items.push({ key: "lights", label: "Lights", icon: "ph:lightbulb", taken: calcValues.numberOfLights || 0 });

  // 2. Tracks — use stored trackQty from prep
  const trackQty = prepData?.trackQty || 0;
  if (trackQty > 0) {
    items.push({ key: "tracks", label: "Tracks", icon: "ph:arrow-line-down", taken: trackQty });
  }

  // 3. Screws — use stored qty from prep (now a number, not boolean)
  const screwsVal = prepData?.screws;
  if (screwsVal && screwsVal !== false) {
    const screwQty = typeof screwsVal === "number" ? screwsVal : (parseInt(screwsVal) || 0);
    if (screwQty > 0) {
      items.push({ key: "screws", label: "Screws", icon: "ph:wrench", taken: screwQty });
    }
  }

  // 4. Optional checkbox items from prep — only if selected
  for (const item of PREP_CHECKBOX_ITEMS) {
    if (!prepData?.[item.prepKey]) continue;
    const taken = item.qtyKey ? parseInt(prepData?.[item.qtyKey]) || 1 : 1;
    items.push({ ...item, taken });
  }

  // 5. Quote products from prep — only if picked
  const quoteProducts = prepData?.quoteProducts || [];
  quoteProducts.forEach((product) => {
    if (!product.picked) return;
    const productName = (product.product || "").trim();
    if (!productName) return;
    items.push({
      key: productName,
      label: productName,
      icon: "ph:package",
      taken: parseInt(product.qty) || 1,
    });
  });

  // 6. "Other" items from prep stage
  const otherItems = prepData?.otherItems || [];
  otherItems.forEach((other) => {
    const itemName = (other.name || "").trim();
    if (!itemName) return;
    items.push({
      key: itemName,
      label: itemName,
      icon: "ph:dots-three",
      taken: parseInt(other.qty) || 0,
    });
  });

  return items;
};

const PostInstallationChecklist = ({ data, onChange, prepData }) => {
  const checklist = data?.checklist || {};

  const takenItems = useMemo(() => getTakenItemsList(prepData), [prepData]);

  const updateItem = (key, field, value) => {
    const current = checklist[key] || { used: "", waste: "", notes: "" };
    const updated = { ...current, [field]: value };

    // Auto-calculate waste when "used" changes
    if (field === "used") {
      const item = takenItems.find((i) => i.key === key);
      if (item && item.taken > 0) {
        const usedNum = parseInt(value) || 0;
        updated.waste = Math.max(0, item.taken - usedNum);
      }
    }

    onChange({
      checklist: {
        ...checklist,
        [key]: updated,
      },
    });
  };

  // ── Dynamic "Add Item" support ──
  const addedItems = data?.addedItems || [];

  const handleAddItem = () => {
    onChange({
      addedItems: [...addedItems, { name: "", qty: "", used: "", notes: "" }],
    });
  };

  const updateAddedItem = (index, field, value) => {
    const items = [...addedItems];
    items[index] = { ...items[index], [field]: value };
    onChange({ addedItems: items });
  };

  const removeAddedItem = (index) => {
    const items = [...addedItems];
    items.splice(index, 1);
    onChange({ addedItems: items });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StepHeader
        icon="ph:check-square"
        iconColorClass="text-emerald-500"
        title="Post Installation Checklist"
        description="Record how many items were used. Waste is auto-calculated based on what was taken from the prep stage."
        colorClass="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800"
      />

      {/* ── Checklist Table ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 !p-0 overflow-hidden">
        {/* Header row */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
          <div className="col-span-4">Item</div>
          <div className="col-span-1 text-center">Taken</div>
          <div className="col-span-2">Used</div>
          <div className="col-span-2 text-center">Waste</div>
          <div className="col-span-3">Notes</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {takenItems.map((item) => {
            const row = checklist[item.key] || {};
            const usedNum = parseInt(row.used) || 0;
            const wasteNum = item.taken > 0 ? Math.max(0, item.taken - usedNum) : (parseInt(row.waste) || 0);

            return (
              <div
                key={item.key}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                {/* Item label */}
                <div className="sm:col-span-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon icon={item.icon} className="text-emerald-600 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                </div>

                {/* Taken (read-only from prep) */}
                <div className="sm:col-span-1 flex items-center justify-center">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block mr-1">Taken:</label>
                  {item.taken > 0 ? (
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
                      {item.taken}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>

                {/* Used (editable) */}
                <div className="sm:col-span-2">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Used</label>
                  <input
                    type="number"
                    min="0"
                    max={item.taken > 0 ? item.taken : undefined}
                    value={row.used || ""}
                    onChange={(e) => updateItem(item.key, "used", e.target.value)}
                    onKeyDown={blockInvalidNumberKeys}
                    onWheel={(e) => e.target.blur()}
                    placeholder="0"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Waste (auto-calculated if taken > 0, editable otherwise) */}
                <div className="sm:col-span-2 flex items-center justify-center">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block mr-1">Waste:</label>
                  {item.taken > 0 ? (
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-md ${wasteNum > 0
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                      : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                      }`}>
                      {row.used ? wasteNum : "—"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      value={row.waste || ""}
                      onChange={(e) => updateItem(item.key, "waste", e.target.value)}
                      onKeyDown={blockInvalidNumberKeys}
                      onWheel={(e) => e.target.blur()}
                      placeholder="0"
                      className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  )}
                </div>

                {/* Notes */}
                <div className="sm:col-span-3">
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

      {/* ── Add Item Section ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Icon icon="ph:dots-three" className="text-gray-600" />
            </div>
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Other Items</span>
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-medium transition-all"
          >
            <Icon icon="ph:plus" />
            Add
          </button>
        </div>

        {addedItems.length > 0 && (
          <div className="space-y-2">
            {addedItems.map((item, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex-1">
                  {index === 0 && (
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                  )}
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) => updateAddedItem(index, "name", e.target.value)}
                    placeholder="Item name"
                    className={`w-full text-sm px-3 py-1.5 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${item._touched && (!item.name || item.name.trim() === "")
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                      }`}
                    onBlur={() => updateAddedItem(index, "_touched", true)}
                  />
                </div>
                <div className="w-20">
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
                        updateAddedItem(index, "qty", "");
                      } else {
                        const num = Number(val);
                        if (num >= 0) updateAddedItem(index, "qty", val);
                      }
                    }}
                    onKeyDown={blockInvalidNumberKeys}
                    onWheel={(e) => e.target.blur()}
                    placeholder="Qty"
                    className={`w-full text-sm px-3 py-1.5 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${item._touched && (item.qty === "" || item.qty === undefined || Number(item.qty) <= 0)
                      ? "border-red-400 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                      }`}
                    onBlur={() => updateAddedItem(index, "_touched", true)}
                  />
                </div>
                <div className="w-20">
                  {index === 0 && (
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Used</label>
                  )}
                  <input
                    type="number"
                    min="0"
                    value={item.used ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateAddedItem(index, "used", "");
                      } else {
                        const num = Number(val);
                        if (num >= 0) updateAddedItem(index, "used", val);
                      }
                    }}
                    onKeyDown={blockInvalidNumberKeys}
                    onWheel={(e) => e.target.blur()}
                    placeholder="Used"
                    className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  {index === 0 && (
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notes</label>
                  )}
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) => updateAddedItem(index, "notes", e.target.value)}
                    placeholder="Notes..."
                    className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAddedItem(index)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 mb-[1px]"
                >
                  <Icon icon="ph:trash" className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PostInstallationChecklist;
