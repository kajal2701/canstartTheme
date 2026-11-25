import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { RichDescription, getTypeLabel } from "../../../utils/helperFunctions";
import { getImgSrc, formatCurrency } from "../../../utils/formatters";
import { UNCHECKED_ITEMS_TABLE_COLUMNS as TABLE_COLUMNS } from "./constants";

// ── Memoized Table Row ────────────────────────────────────────────────────────
const ItemRow = React.memo(({ item, onImageClick }) => (
  <tr className="hover:bg-amber-50/20 dark:hover:bg-slate-800/30 transition-colors">
    <td className="py-3 px-3 text-slate-400 font-medium">{item.no}</td>
    <td className="py-3 px-3 text-slate-700 dark:text-slate-200">
      <div className="font-medium">
        <RichDescription text={item.description} />
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
          {item.category}
        </span>
        {item.area !== "-" && <span>Area: {item.area}</span>}
        {item.color !== "-" && <span>Color: {item.color}</span>}
      </div>
    </td>
    <td className="py-3 px-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
      {item.type}
    </td>
    <td className="py-3 px-3 text-center">
      {item.images?.length > 0 ? (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {item.images.map((img, i) => (
            <img
              key={i}
              src={getImgSrc(img.image_url)}
              alt="Item preview"
              loading="lazy"
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onImageClick(getImgSrc(img.image_url))}
            />
          ))}
        </div>
      ) : (
        <span className="text-slate-300 dark:text-slate-600">-</span>
      )}
    </td>
    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300 font-medium">
      {item.quantity}
    </td>
    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
      {formatCurrency(item.unitCost)}
    </td>
    <td className="py-3 px-3 text-right font-semibold text-slate-800 dark:text-slate-100">
      {formatCurrency(item.total)}
    </td>
  </tr>
));
ItemRow.displayName = "ItemRow";

// ── Main Component ────────────────────────────────────────────────────────────
const UncheckedItemsSection = ({ quote }) => {
  const navigate = useNavigate();
  const [previewSrc, setPreviewSrc] = useState(null);

  // Single-pass parsing of items and cumulative total
  const { items, total } = useMemo(() => {
    if (!quote?.unchecked_items_data) return { items: [], total: 0 };

    let data = quote.unchecked_items_data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.error("Failed to parse unchecked_items_data:", err);
        return { items: [], total: 0 };
      }
    }
    if (!data) return { items: [], total: 0 };

    const list = [];
    let sum = 0;
    let counter = 0;

    // 1. Unchecked Annotations
    (data.annotations || []).forEach((ann, idx) => {
      const amount = Number(ann.total_amount) || 0;
      sum += amount;
      const raw = ann.images || [];
      const drawn = raw.filter((img) => img.type === "drawnLines");
      const displayImages =
        drawn.length > 0
          ? drawn
          : raw.filter((img) => img.type === "fullyEdited");

      list.push({
        id: `ann-${idx}`,
        no: ++counter,
        category: "Puck Lights (Track)",
        description: `Canstar Puck Lights with a customized data line system, paired with a **${ann.color || "Standard"}** aluminum track package, designed for the **${ann.identify_image_name || "House Area"}** of the house/property.`,
        area: ann.identify_image_name || "-",
        color: ann.color || "-",
        quantity: ann.total_numerical_box || ann.sft_count || 1,
        unitCost: Number(ann.unit_price) || 0,
        total: amount,
        type: getTypeLabel(ann.required),
        images: displayImages.length > 0 ? displayImages : raw,
      });
    });

    // 2. Unchecked Products
    (data.products || []).forEach((prod, idx) => {
      const amount = Number(prod.amount) || 0;
      sum += amount;
      list.push({
        id: `prod-${idx}`,
        no: ++counter,
        category: "Product",
        description: prod.product_description || prod.product || "Product Item",
        area: "-",
        color: "-",
        quantity: Number(prod.qty) || 1,
        unitCost: Number(prod.price) || 0,
        total: amount,
        type: getTypeLabel(prod.required),
        images: [],
      });
    });

    // 3. Unchecked Custom Products
    (data.custom_products || []).forEach((cust, idx) => {
      const amount = Number(cust.amount) || 0;
      sum += amount;
      list.push({
        id: `cust-${idx}`,
        no: ++counter,
        category: "Custom Product",
        description: cust.product || "Custom Product Item",
        area: "-",
        color: "-",
        quantity: Number(cust.qty) || 1,
        unitCost: Number(cust.unit_price) || 0,
        total: amount,
        type: getTypeLabel(cust.required),
        images: [],
      });
    });

    return { items: list, total: sum };
  }, [quote?.unchecked_items_data]);

  // Navigate to /quote/add with prefill payload
  const handleCreateNewQuote = useCallback(() => {
    if (!quote || items.length === 0) return;

    navigate("/quote/add", {
      state: {
        prefillFromUnchecked: {
          customer: {
            cust_id: quote.customer_id || quote.user_id,
            fname: quote.fname || "",
            lname: quote.lname || "",
            email: quote.email || "",
            phone: quote.phone || "",
            address: quote.address || "",
            city: quote.city || "",
            state: quote.state || "",
            country: quote.country || "",
            post_code: quote.post_code || "",
            gst: parseFloat(quote.gst_percentage) || 5,
          },
          uncheckedData: quote.unchecked_items_data,
          sourceQuoteNo: quote.quote_no || quote.quoteNumber,
        },
      },
    });
  }, [navigate, quote, items.length]);

  const handleOpenPreview = useCallback((src) => {
    setPreviewSrc(src);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewSrc(null);
  }, []);

  // Early return if no declined items exist
  if (items.length === 0) return null;

  return (
    <>
      <Card>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Icon icon="ph:clock-counter-clockwise" className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Customer Unchecked Items
                </h3>

              </div>

            </div>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-sm flex-shrink-0"
            onClick={handleCreateNewQuote}
          >
            <Icon icon="ph:plus-circle" className="text-base" />
            Create Quote
          </Button>
        </div>

        {/* Table of Declined Items */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                {TABLE_COLUMNS.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.align || "text-left"} ${col.width || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {items.map((item) => (
                <ItemRow key={item.id} item={item} onImageClick={handleOpenPreview} />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-semibold bg-slate-50/50 dark:bg-slate-800/50">
                <td colSpan="6" className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
                  Total:
                </td>
                <td className="py-3 px-3 text-right text-amber-600 dark:text-amber-400 font-bold">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Image Zoom Preview Modal */}
      <Modal
        title="Image Preview"
        activeModal={Boolean(previewSrc)}
        onClose={handleClosePreview}
        className="max-w-3xl"
      >
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-auto rounded-lg object-contain max-h-[75vh] mx-auto"
          />
        )}
      </Modal>
    </>
  );
};

export default React.memo(UncheckedItemsSection);
