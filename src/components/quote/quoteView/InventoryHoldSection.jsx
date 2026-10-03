import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import InventoryHoldModal from "./InventoryHoldModal";
import { getHeldInventory } from "../../../services/inventoryService";

const InventoryHoldSection = ({ quote, showHoldInventory, hasActionAccess }) => {
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [heldItems, setHeldItems] = useState(null);
  const [isFetchingHolds, setIsFetchingHolds] = useState(false);

  useEffect(() => {
    if (showHoldInventory && heldItems === null) {
      const fetchHolds = async () => {
        setIsFetchingHolds(true);
        try {
          const res = await getHeldInventory(quote?.quote_id);
          setHeldItems(res || []);
        } catch (e) {
          console.error("Failed to fetch held inventory", e);
        } finally {
          setIsFetchingHolds(false);
        }
      };
      fetchHolds();
    }
  }, [showHoldInventory, quote?.quote_id]);

  if (!showHoldInventory || !hasActionAccess) return null;

  return (
    <>
      <div className="my-5 border-t border-slate-100 dark:border-slate-700" />
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Inventory Reservation
        </h4>
        {isFetchingHolds ? (
          <p className="text-sm text-slate-500">Checking hold status...</p>
        ) : heldItems && heldItems.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-green-600 font-medium flex items-center gap-2">
              <Icon icon="ph:check-circle" /> Inventory is Held for this Quote
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
              {heldItems.map((item, idx) => {
                let desc = "";
                if (item.inventory_category === 'TRACK') desc = `${item.details?.color} ${item.details?.size} Track`;
                if (item.inventory_category === 'LIGHT') desc = `${item.details?.type} Light`;
                if (item.inventory_category === 'CONTROLLER') desc = `${item.details?.type} Controller`;
                const supplier = item.details?.supplier;
                return <li key={idx}>{item.held_quantity}x {desc}{supplier ? ` — Supplier: ${supplier}` : ''}</li>;
              })}
            </ul>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No inventory is currently held for this quote.
            </p>
            <Button
              text="Hold Inventory"
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
              onClick={() => setHoldModalOpen(true)}
            />
          </div>
        )}
      </div>

      {holdModalOpen && (
        <InventoryHoldModal
          activeModal={holdModalOpen}
          onClose={() => setHoldModalOpen(false)}
          quote={quote}
          onSuccess={() => {
            getHeldInventory(quote.quote_id).then(res => setHeldItems(res || []));
          }}
        />
      )}
    </>
  );
};

export default InventoryHoldSection;
