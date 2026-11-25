import { useEffect } from "react";
import { toast } from "react-toastify";
import { getImgSrc } from "../utils/formatters";

/**
 * Custom hook to prefill the AddQuote form with customer info and
 * declined/unchecked items from a previously negotiated quote.
 */
export const useUncheckedQuotePrefill = ({
  prefill,
  customers,
  setSelectedCustomer,
  setAnnotationSections,
  setCustomProducts,
  setAdminNotes,
  productsLoading,
  products,
  setProducts,
}) => {
  // ── 1. Prefill Customer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!prefill?.customer) return;

    const found = customers.find(
      (c) => String(c.cust_id) === String(prefill.customer.cust_id)
    );
    setSelectedCustomer(found || prefill.customer);
  }, [customers, prefill, setSelectedCustomer]);

  // ── 2. Prefill Annotations, Custom Products & Admin Notes ─────────────────
  useEffect(() => {
    if (!prefill) return;

    let data = prefill.uncheckedData;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.error("Failed to parse uncheckedData for prefill:", err);
        return;
      }
    }
    if (!data) return;

    // Helper to convert blob to base64 data URL
    const blobToDataUrl = (blob) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });

    // 2a. Annotation sections with images
    if (data.annotations && data.annotations.length > 0) {
      const loadAnnotations = async () => {
        const sections = await Promise.all(
          data.annotations.map(async (ann, sIdx) => {
            const rawImages = ann.images || [];
            const drawn = rawImages.filter((img) => img.type === "drawnLines");
            const edited = rawImages.filter((img) => img.type === "fullyEdited");
            // Pair drawnLines with fullyEdited by photo index (do not double count with rawImages)
            const maxLen = Math.max(drawn.length, edited.length, 1);

            const files = await Promise.all(
              Array.from({ length: maxLen }, async (_, i) => {
                const drawnImg = drawn[i];
                const editedImg = edited[i] || drawnImg;
                const targetImg = drawnImg || editedImg || rawImages[i];

                let fileObj = null;
                let drawnDataUrl = "";
                let editedDataUrl = "";
                let previewUrl = "";

                if (targetImg?.image_url) {
                  previewUrl = getImgSrc(targetImg.image_url);
                  try {
                    const res = await fetch(previewUrl);
                    const blob = await res.blob();
                    fileObj = new File([blob], `image_${sIdx}_${i}.jpg`, {
                      type: blob.type || "image/jpeg",
                    });
                    drawnDataUrl = await blobToDataUrl(blob);
                  } catch (err) {
                    console.error("Failed to fetch image for prefill:", err);
                  }
                }

                if (editedImg?.image_url && editedImg.image_url !== targetImg?.image_url) {
                  try {
                    const resEdit = await fetch(getImgSrc(editedImg.image_url));
                    const blobEdit = await resEdit.blob();
                    editedDataUrl = await blobToDataUrl(blobEdit);
                  } catch (err) {
                    console.error("Failed to fetch edited image for prefill:", err);
                  }
                }

                return {
                  file: fileObj,
                  preview: drawnDataUrl || previewUrl,
                  thumb: drawnDataUrl || previewUrl,
                  lineSaved: drawnDataUrl,
                  textSaved: editedDataUrl || drawnDataUrl,
                  textSum: i === 0 ? Number(ann.sft_count || 0) : 0,
                };
              })
            );

            return {
              id: Date.now() + sIdx,
              files,
              formData: {
                identifyImageName: ann.identify_image_name || "",
                color: ann.color || "",
                peaksCount: String(ann.no_peaks || "0"),
                jumpersCount: String(ann.no_jumper || "0"),
                sftCount: String(ann.sft_count || ""),
                sqftSize: String(ann.divide || ""),
                total: String(ann.total_numerical_box || ""),
                unitPrice: String(ann.unit_price || ""),
                amount: String(ann.total_amount || ""),
                action:
                  ann.required === "yes" || ann.required === "Mandatory"
                    ? "Mandatory"
                    : "Optional",
              },
            };
          })
        );
        setAnnotationSections(sections);
      };

      loadAnnotations();
    }

    // 2b. Custom products
    if (data.custom_products && data.custom_products.length > 0) {
      setCustomProducts(
        data.custom_products.map((c, i) => ({
          id: Date.now() + i,
          description: c.product || "",
          quantity: String(c.qty || "1"),
          unitPrice: String(c.unit_price || ""),
          amount: String(c.amount || ""),
          option:
            c.required === "no" || c.required === "Optional"
              ? "optional"
              : "mandatory",
        }))
      );
    }

    // 2c. Admin Notes & Toast notification
    if (prefill.sourceQuoteNo) {
      setAdminNotes(
        `Created from customer-declined items of Quote #${prefill.sourceQuoteNo}`
      );
      toast.info(
        `Prefilled with customer & declined items from Quote #${prefill.sourceQuoteNo}`
      );
    }
  }, [prefill, setAnnotationSections, setCustomProducts, setAdminNotes]);

  // ── 3. Prefill Standard Catalog Products ──────────────────────────────────
  useEffect(() => {
    if (!prefill || productsLoading || !products?.length) return;

    let data = prefill.uncheckedData;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.error("Failed to parse uncheckedData for product prefill:", err);
        return;
      }
    }
    if (!data?.products || data.products.length === 0) return;

    setProducts((prev) =>
      prev.map((p) => {
        const found = data.products.find(
          (u) =>
            String(u.product_id) === String(p.id) ||
            u.product === p.name ||
            u.product_description === p.name
        );

        if (found) {
          const qty = Number(found.qty || 1);
          const price = Number(p.price || 0);
          return {
            ...p,
            quantity: String(qty),
            amount: String(found.amount || (qty * price).toFixed(2)),
            option:
              found.required === "no" || found.required === "Optional"
                ? "optional"
                : "mandatory",
          };
        }
        return p;
      })
    );
  }, [productsLoading, prefill, products?.length, setProducts]);
};
