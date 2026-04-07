import React from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const SuppliesDropOff = ({ data, onChange }) => {
  const items = data?.items || [];
  const travelTime = data?.travelTime || { hours: 0, minutes: 0 };

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    updateField("items", [
      ...items,
      { id: Date.now(), name: "", qtyReturned: "", notes: "" },
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    updateField("items", updated);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    updateField("items", updated);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:package" className="text-orange-500 text-xl" />
          Supplies Update & Drop-off
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Record any supplies being returned to inventory and travel time for this installation.
        </p>
      </div>

      {/* ── Return Items Table ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:arrow-u-up-left" className="text-orange-500" />
            <span>Items Returned to Inventory</span>
          </div>
        }
        headerslot={
          <Button
            text="Add Item"
            icon="ph:plus"
            className="btn-outline-primary btn-sm"
            onClick={addItem}
          />
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <Icon icon="ph:package" className="text-3xl mb-2" />
            <p className="text-sm">No items added. Click "Add Item" if supplies are being returned.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700 px-3">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Qty Returned</div>
              <div className="col-span-5">Notes</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-700/30 rounded-lg px-3 py-2"
              >
                <div className="col-span-4">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Item</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    placeholder="Item name"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={item.qtyReturned}
                    onChange={(e) => updateItem(idx, "qtyReturned", e.target.value)}
                    placeholder="0"
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-5">
                  <label className="sm:hidden text-[10px] text-gray-400 mb-0.5 block">Notes</label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItem(idx, "notes", e.target.value)}
                    placeholder="Notes..."
                    className="w-full text-sm px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="w-7 h-7 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <Icon icon="ph:trash" className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Travel Time ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:car" className="text-sky-500" />
            <span>Travel Time</span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="24"
              value={travelTime.hours}
              onChange={(e) =>
                updateField("travelTime", { ...travelTime, hours: parseInt(e.target.value) || 0 })
              }
              className="w-20 text-sm text-center px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-sm text-gray-500">hrs</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="59"
              value={travelTime.minutes}
              onChange={(e) =>
                updateField("travelTime", { ...travelTime, minutes: parseInt(e.target.value) || 0 })
              }
              className="w-20 text-sm text-center px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-sm text-gray-500">min</span>
          </div>
        </div>
      </Card>

      {/* ── Notes ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:note-pencil" className="text-orange-500" />
            <span>Notes</span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <textarea
          value={data?.notes || ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Any notes about the drop-off or supplies..."
          rows={3}
          className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
      </Card>
    </div>
  );
};

export default SuppliesDropOff;
