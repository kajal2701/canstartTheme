import React from 'react';
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

// Static — defined once, not recreated on every render.
const CATEGORY_CONFIG = {
  TRACK: {
    icon: "ph:arrow-line-down",
    colorClass: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    describe: (d) => `${d?.color} ${d?.size} Track`,
  },
  LIGHT: {
    icon: "ph:lightbulb",
    colorClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    describe: (d) => `${d?.type} Light`,
  },
  CONTROLLER: {
    icon: "ph:cpu",
    colorClass: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    describe: (d) => `${d?.type} Controller`,
  },
};

const DEFAULT_CONFIG = {
  icon: "ph:package",
  colorClass: "text-slate-600 bg-slate-100 dark:bg-slate-800/50",
  describe: () => "Item",
};

const HeldItemCard = React.memo(({ item }) => {
  const config = CATEGORY_CONFIG[item.inventory_category] || DEFAULT_CONFIG;
  const desc = config.describe(item.details);
  const supplier = item.details?.supplier;

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.colorClass}`}>
        <Icon icon={config.icon} className="text-xl" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{desc}</p>
        {supplier && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Supplier: <span className="font-medium text-slate-600 dark:text-slate-400">{supplier}</span>
          </p>
        )}
        <p className="text-sm font-bold text-slate-800 dark:text-white">Qty: {item.held_quantity}</p>
      </div>
    </div>
  );
});
HeldItemCard.displayName = "HeldItemCard";

const HeldInventorySection = ({ quoteId, isFetchingHolds, heldItems }) => {
  if (!quoteId) return null;

  return (
    <Card
      title="Reserved Inventory"
      className="!shadow-sm border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10"
    >
      {isFetchingHolds ? (
        <p className="text-sm text-slate-500 py-2">Loading reservations...</p>
      ) : heldItems?.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
            The following items have been held in inventory for this job:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {heldItems.map((item, idx) => (
              <HeldItemCard key={item.hold_id ?? item.inventory_id ?? idx} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-2">No inventory is currently held for this job.</p>
      )}
    </Card>
  );
};

export default React.memo(HeldInventorySection);