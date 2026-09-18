import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Select from "@/components/ui/Select";
import { useForm, FormProvider } from "react-hook-form";
import { getHoldOptions, holdInventory } from "../../../services/inventoryService";

const InventoryHoldModal = ({ activeModal, onClose, quote, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState({ tracks: [], lights: [], controllers: [] });
  const [controllerHolds, setControllerHolds] = useState([]);

  const methods = useForm({
    defaultValues: {
      selectedTrack: "",
      selectedLight: "",
      selectedController: "",
    }
  });
  const { handleSubmit, register, formState: { errors }, setError, clearErrors, reset } = methods;

  // Requirements
  const [requiredFeet, setRequiredFeet] = useState(0);
  const [requiredLights, setRequiredLights] = useState(0);
  const [requiredControllers, setRequiredControllers] = useState(0);
  const [requiredTrackColor, setRequiredTrackColor] = useState("");

  useEffect(() => {
    if (activeModal && quote?.quote_id) {
      fetchOptions();
      calculateRequirements();
      reset({ selectedTrack: "", selectedLight: "" });
    }
  }, [activeModal, quote, reset]);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const data = await getHoldOptions(quote.quote_id);
      setOptions({
        tracks: data.tracks || [],
        lights: data.lights || [],
        controllers: data.controllers || [],
      });
    } catch (e) {
      toast.error("Failed to fetch inventory options.");
    } finally {
      setLoading(false);
    }
  };

  const calculateRequirements = () => {
    let totalFeet = 0;
    let trackColors = [];

    // Sum up track feet from annotations
    if (quote?.annotation_image) {
      quote.annotation_image.forEach((ann, index) => {
        totalFeet += Number(ann.total_numerical_box) || 0;
        // Only get the color from the first annotation image
        if (index === 0 && ann.color) {
          trackColors.push(ann.color);
        }
      });
    }

    // Calculate lights from total track feet (x 1.5)
    let lightsQty = Math.ceil(totalFeet * 1.5);
    let controllersQty = 0;

    // Sum up controllers from products
    if (quote?.products) {
      quote.products.forEach(p => {
        controllersQty += Number(p.qty) || 0;
      });
    }

    setRequiredFeet(totalFeet);
    setRequiredLights(lightsQty);
    setRequiredControllers(controllersQty);
    setRequiredTrackColor(trackColors[0] || "");
    setControllerHolds(controllersQty > 0 ? [{ inventory_id: "", hold_quantity: controllersQty }] : []);
  };

  const handleControllerChange = (index, field, value) => {
    const newHolds = [...controllerHolds];
    newHolds[index][field] = value;
    setControllerHolds(newHolds);
    if (errors.controllers) clearErrors("controllers");
  };

  const addController = () => {
    setControllerHolds([...controllerHolds, { inventory_id: "", hold_quantity: 1 }]);
    if (errors.controllers) clearErrors("controllers");
  };

  const removeController = (index) => {
    const newHolds = controllerHolds.filter((_, i) => i !== index);
    setControllerHolds(newHolds);
    if (errors.controllers) clearErrors("controllers");
  };

  const renderTrackOptions = () => {
    return options.tracks
      .filter(t => !requiredTrackColor || t.color.toLowerCase() === requiredTrackColor.toLowerCase())
      .map((t) => {
        const cleanSize = t.size?.replace(/\(\d+\s*holes\)/gi, '').trim() || '';
        const displaySize = cleanSize.length > 25 ? cleanSize.substring(0, 25) + '...' : cleanSize;
        const sup = t.supplier?.length > 15 ? t.supplier.substring(0, 15) + '...' : (t.supplier || 'N/A');
        return (
          <option key={t.track_id} value={t.track_id} disabled={t.available < requiredFeet}>
            {displaySize} - {t.available}ft - Sup: {sup} {t.available < requiredFeet ? '(Insuf)' : ''}
          </option>
        );
      });
  };

  const onSubmit = async (data) => {
    if (requiredControllers > 0) {
      const totalSelected = controllerHolds.reduce((sum, c) => sum + Number(c.hold_quantity || 0), 0);
      if (totalSelected !== requiredControllers) {
        setError("controllers", { type: "manual", message: `Total controller quantity must exactly equal ${requiredControllers}` });
        return;
      }
      const hasEmpty = controllerHolds.some(c => !c.inventory_id || Number(c.hold_quantity) <= 0);
      if (hasEmpty) {
        setError("controllers", { type: "manual", message: "Please select a valid controller and quantity for all rows." });
        return;
      }
    }

    const payload = {
      quote_id: quote.quote_id,
      tracks: requiredFeet > 0 ? [{ inventory_id: data.selectedTrack, hold_quantity: requiredFeet }] : [],
      lights: requiredLights > 0 ? [{ inventory_id: data.selectedLight, hold_quantity: requiredLights }] : [],
      controllers: requiredControllers > 0 ? controllerHolds : [],
    };

    setSubmitting(true);
    try {
      const res = await holdInventory(payload);
      if (res?.success) {
        toast.success("Inventory held successfully.");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Failed to hold inventory.");
      }
    } catch (e) {
      toast.error("Error occurred while holding inventory.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Hold Inventory for Quote"
      labelclassName="btn-outline-dark"
      activeModal={activeModal}
      onClose={onClose}
    >
      {loading ? (
        <div className="py-4 text-center text-slate-500">Loading options...</div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            Select the inventory items to reserve for this quote. Once held, these quantities will not be available for other quotes.
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Tracks */}
              {requiredFeet > 0 && (
                <Select
                  label={`Track (Required: ${requiredFeet} ft)`}
                  placeholder="-- Select Track --"
                  name="selectedTrack"
                  register={register}
                  options_rule={{ required: "Please select a track." }}
                  error={errors.selectedTrack}
                  className="max-w-full truncate"
                >
                  <option value="" disabled>-- Select Track --</option>
                  {renderTrackOptions()}
                </Select>
              )}

              {/* Lights */}
              {requiredLights > 0 && (
                <Select
                  label={`Lights (Required: ${requiredLights})`}
                  placeholder="-- Select Light --"
                  name="selectedLight"
                  register={register}
                  options_rule={{ required: "Please select a light." }}
                  error={errors.selectedLight}
                  className="max-w-full truncate"
                >
                  <option value="" disabled>-- Select Light --</option>
                  {options.lights.map((l) => (
                    <option key={l.light_id} value={l.light_id} disabled={l.available < requiredLights}>
                      {l.type} - Available: {l.available} {l.available < requiredLights ? '(Insufficient)' : ''}
                    </option>
                  ))}
                </Select>
              )}

              {/* Controllers */}
              {requiredControllers > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Controllers (Total Required: {requiredControllers})
                  </label>
                  {controllerHolds.map((cHold, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <select
                          className="form-control w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={cHold.inventory_id}
                          onChange={(e) => handleControllerChange(idx, "inventory_id", e.target.value)}
                          required
                        >
                          <option value="" disabled>-- Select Controller --</option>
                          {options.controllers.map((c) => (
                            <option key={c.controller_id} value={c.controller_id} disabled={c.available < cHold.hold_quantity}>
                              {c.type} - Available: {c.available} {c.available < cHold.hold_quantity ? '(Insufficient)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          className="form-control w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={cHold.hold_quantity}
                          onChange={(e) => handleControllerChange(idx, "hold_quantity", Number(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      {idx > 0 && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 p-2"
                          onClick={() => removeController(idx)}
                          title="Remove Controller"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={addController}
                      className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                    >
                      + Add Another Controller
                    </button>
                  </div>
                  {errors.controllers && (
                    <div className="mt-1 text-red-500 block text-xs">
                      {errors.controllers.message}
                    </div>
                  )}
                </div>
              )}

              {requiredFeet === 0 && requiredLights === 0 && requiredControllers === 0 && (
                <div className="py-4 text-center text-slate-500 text-sm">
                  No Track, Light, or Controller requirements detected for this quote.
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  text="Cancel"
                  className="btn-danger"
                  onClick={onClose}
                  disabled={submitting}
                  type="button"
                />
                <Button
                  text={submitting ? "Holding..." : "Hold Inventory"}
                  className="btn-primary"
                  type="submit"
                  disabled={submitting || (requiredFeet === 0 && requiredLights === 0 && requiredControllers === 0)}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </Modal>
  );
};

export default InventoryHoldModal;
