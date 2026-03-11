import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { RichDescription, SectionHeader } from "../../../utils/helperFunctions";
import QuoteButton from "./QuoteButton";
import { BUTTON_ICONS } from "./constants";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { getImgSrc } from "../../../utils/formatters";
import { addExtraWork } from "../../../services/quoteService";
import { toast } from "react-toastify";

// ─── Validation helper ────────────────────────────────────────────────────────
const validateExtraRows = (rows) => {
  const errors = {};
  rows.forEach((row, idx) => {
    const rowErrors = {};
    if (!row.description.trim())
      rowErrors.description = "Description is required.";
    if (!row.quantity || isNaN(row.quantity) || Number(row.quantity) <= 0)
      rowErrors.quantity = "Valid quantity is required.";
    if (!row.unitCost || isNaN(row.unitCost) || Number(row.unitCost) <= 0)
      rowErrors.unitCost = "Valid unit price is required.";
    if (Object.keys(rowErrors).length > 0) errors[idx] = rowErrors;
  });
  return errors;
};

// ─── Component ────────────────────────────────────────────────────────────────
const LineItemsTable = ({
  formattedItems = [],
  onExtraTotalChange,
  quoteId,
  gst,
  mainTotal,
  existingExtraWork = [],
  onSubmitSuccess,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [extraRows, setExtraRows] = useState([]);
  const [rowErrors, setRowErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Add Row (validates existing rows first) ───────────────────────────────
  useEffect(() => {
    if (existingExtraWork?.length > 0) {
      setExtraRows(
        existingExtraWork.map((item) => ({
          id: Date.now() + Math.random(),
          description: item.description ?? "",
          quantity: String(item.quantity ?? ""),
          unitCost: String(item.unit_price ?? ""),
          total: String(item.total ?? "0.00"),
        })),
      );
    }
  }, [existingExtraWork]);
  const addExtraRow = () => {
    if (extraRows.length > 0) {
      const errors = validateExtraRows(extraRows);
      if (Object.keys(errors).length > 0) {
        setRowErrors(errors);
        return;
      }
    }
    setRowErrors({});
    setExtraRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        quantity: "",
        unitCost: "",
        total: "0.00",
      },
    ]);
  };

  // ── Field change ──────────────────────────────────────────────────────────
  const handleExtraChange = (idx, field, value) => {
    setExtraRows((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const updatedRow = { ...row, [field]: value };
        const qty = parseFloat(updatedRow.quantity) || 0;
        const unit = parseFloat(updatedRow.unitCost) || 0;
        return { ...updatedRow, total: (qty * unit).toFixed(2) };
      }),
    );
    // Clear that field's error on change
    setRowErrors((prev) => {
      const updated = { ...prev };
      if (updated[idx]) {
        delete updated[idx][field];
        if (Object.keys(updated[idx]).length === 0) delete updated[idx];
      }
      return updated;
    });
  };

  // ── Remove Row ────────────────────────────────────────────────────────────
  const removeExtraRow = (idx) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== idx));
    setRowErrors((prev) => {
      const updated = { ...prev };
      delete updated[idx];
      const reindexed = {};
      Object.keys(updated).forEach((key) => {
        const k = parseInt(key);
        reindexed[k > idx ? k - 1 : k] = updated[key];
      });
      return reindexed;
    });
  };

  // ── Sync extra total to parent ────────────────────────────────────────────
  React.useEffect(() => {
    if (!onExtraTotalChange) return;
    const total = extraRows.reduce(
      (sum, r) => sum + (parseFloat(r.total) || 0),
      0,
    );
    onExtraTotalChange(total);
  }, [extraRows, onExtraTotalChange]);

  // ── Submit ────────────────────────────────────────────────────────────────
  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (extraRows.length === 0) {
      toast.error("Please add at least one extra work item before submitting.");
      return;
    }

    const errors = validateExtraRows(extraRows);
    if (Object.keys(errors).length > 0) {
      setRowErrors(errors);
      return;
    }

    const totalExtraWork = extraRows.reduce(
      (sum, r) => sum + (parseFloat(r.total) || 0),
      0,
    );

    const payload = {
      quote_id: quoteId,
      extra_work_data: extraRows.map((r) => ({
        description: r.description,
        quantity: Number(r.quantity),
        unit_price: Number(r.unitCost),
        total: Number(r.total),
      })),
      gst: gst ?? 0,
      total_extra_work: totalExtraWork,
      main_total: mainTotal ?? 0,
    };

    try {
      setIsSubmitting(true);
      const result = await addExtraWork(payload);
      if (result.success) {
        toast.success(result.message);
        setRowErrors({});
        onSubmitSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card>
      {formattedItems.length > 0 ? (
        <>
          <SectionHeader icon="ph:list-bullets" title="Line Items" />

          {/* Main table */}
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="py-3 px-5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-10">
                    #
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Description
                  </th>
                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                    Images
                  </th>
                  <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                    Qty
                  </th>
                  <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-24">
                    Unit Cost
                  </th>
                  <th className="py-3 px-5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-28">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {formattedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.id}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-slate-700 dark:text-slate-300 leading-6 max-w-sm pr-6">
                      <RichDescription text={item.description} />
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-2">
                        {item.images?.length > 0 ? (
                          item.images.map((img) => (
                            <button
                              key={img.image_id}
                              type="button"
                              className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110 transition-all"
                              title="View image"
                              onClick={() => {
                                setPreviewSrc(getImgSrc(img.image_url));
                                setPreviewOpen(true);
                              }}
                            >
                              <Icon
                                icon={BUTTON_ICONS.eye}
                                className="text-sm"
                              />
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right text-sm text-slate-600 dark:text-slate-400">
                      ${item.unitCost}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ${item.total.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extra rows */}
          {extraRows.map((row, idx) => (
            <div key={row.id} className="space-y-1 mt-4">
              <div className="grid grid-cols-12 gap-3 items-start">
                {/* Remove */}
                <div className="col-span-2 md:col-span-1 flex md:justify-start">
                  <Button
                    text="Remove"
                    className="btn-danger btn-sm h-[42px] rounded-r-none"
                    type="button"
                    onClick={() => removeExtraRow(idx)}
                  />
                </div>

                {/* Description */}
                <div className="col-span-10 md:col-span-8">
                  <Textarea
                    placeholder="Describe extra work..."
                    row={1}
                    value={row.description} // ← value not defaultValue
                    className="h-[42px] rounded-l-none"
                    onChange={(e) =>
                      handleExtraChange(idx, "description", e.target.value)
                    }
                    error={
                      rowErrors[idx]?.description
                        ? { message: rowErrors[idx].description }
                        : null
                    }
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-6 md:col-span-1">
                  <Textinput
                    type="text"
                    placeholder="Qty"
                    className="h-[42px]"
                    value={row.quantity} // ← value not defaultValue
                    onChange={(e) =>
                      handleExtraChange(
                        idx,
                        "quantity",
                        e.target.value.replace(/[^0-9]/g, ""),
                      )
                    }
                    error={
                      rowErrors[idx]?.quantity
                        ? { message: rowErrors[idx].quantity }
                        : null
                    }
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-6 md:col-span-1">
                  <Textinput
                    type="text"
                    placeholder="Unit Price"
                    className="h-[42px]"
                    value={row.unitCost} // ← value not defaultValue
                    onChange={(e) =>
                      handleExtraChange(
                        idx,
                        "unitCost",
                        e.target.value.replace(/[^0-9.]/g, ""),
                      )
                    }
                    error={
                      rowErrors[idx]?.unitCost
                        ? { message: rowErrors[idx].unitCost }
                        : null
                    }
                  />
                </div>

                {/* Total (readonly) */}
                <div className="col-span-6 md:col-span-1">
                  <Textinput
                    type="text"
                    placeholder="Total"
                    className="bg-gray-50 h-[42px]"
                    value={row.total} // ← value not defaultValue
                    disabled
                    readonly // ← add readonly
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
            <QuoteButton
              icon={BUTTON_ICONS.add}
              variant="outline"
              onClick={addExtraRow}
            >
              Add Extra Work
            </QuoteButton>
            <QuoteButton
              icon={BUTTON_ICONS.submit}
              variant="outlineOrange"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </QuoteButton>
          </div>

          {/* Image Preview Modal */}
          <Modal
            title="Image"
            activeModal={previewOpen}
            onClose={() => setPreviewOpen(false)}
            className="max-w-3xl"
          >
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
            )}
          </Modal>
        </>
      ) : (
        <div className="p-5 text-center text-slate-400 dark:text-slate-500">
          No line items
        </div>
      )}
    </Card>
  );
};

export default LineItemsTable;
