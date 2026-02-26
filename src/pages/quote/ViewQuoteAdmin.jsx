import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import LoadingIcon from "@/components/LoadingIcon";
import { getQuote } from "../../services/quoteService";
import { toast } from "react-toastify";
import {
  RichDescription,
  SectionHeader,
  StatusBadge,
} from "../../utils/helperFunctions";

const ViewQuoteAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getQuote(id);

        if (mounted) {
          console.log(data, "data");
          setQuote(data);
        }
      } catch (e) {
        if (mounted) {
          const errorMsg = e.message || "Quote not found";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, [id]);

  const formattedItems = React.useMemo(() => {
    if (!quote) return [];

    return [
      ...(quote.annotation_image || []).map((item, index) => ({
        id: index + 1,
        description: `Canstar Puck Lights with a customized data line system, paired with a ${item.color} aluminum track package, designed for the ${item.identify_image_name} of the house/property.`,
        images: item.images || [],
        quantity: item.total_numerical_box,
        unitCost: Number(item.unit_price),
        total: Number(item.total_amount),
      })),

      ...(quote.products || []).map((product, index) => ({
        id: (quote.annotation_image?.length || 0) + index + 1,
        description: product.product_description,
        images: [],
        quantity: Number(product.qty),
        unitCost: Number(product.price),
        total: Number(product.amount),
      })),
    ];
  }, [quote]);
  
  // Show loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingIcon className="h-12 w-12 text-indigo-500" />
      </div>
    );
  }

  // Show error
  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon icon="ph:file-x" className="text-3xl text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Quote #{id} not found
        </p>
        <button
          onClick={() => navigate("/quote")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Icon icon="ph:arrow-left" /> Back to Quotes
        </button>
      </div>
    );
  }

  // Show content
  return (
    <div className="space-y-5">
      {/* ── Page Title Bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/quote")}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-sm"
          >
            <Icon icon="ph:arrow-left" className="text-lg" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-inter">
              {quote?.quoteNumber || quote?.quote_no}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Quote Details &amp; Summary
            </p>
          </div>
        </div>
        <StatusBadge status={quote?.status} />
      </div>
      {/* ── Header Card: From / Logo / To ── */}
      <Card bodyClass="p-0 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            {/* From */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
                From
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                CanStar
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                3227 18 St NW
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Edmonton
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                AB T6T 0H2
              </p>
            </div>

            {/* Logo — center */}
            <div className="flex flex-col items-center justify-center gap-3 order-first md:order-none">
              <div className="relative">
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 rounded-2xl bg-red-200 dark:bg-red-900/40 blur-2xl opacity-50 scale-110" />
                {/* Brand logo */}
                <img
                  src="/src/assets/images/logo/canstar-logo-white.png"
                  alt="Canstar Logo"
                  className="relative w-[13rem] h-[13rem] object-contain"
                />
              </div>
            </div>

            {/* To */}
            <div className="space-y-1 md:text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">
                To
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {quote.fname} {quote.lname}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {quote.address}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {quote.city}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {quote.state} - {quote.post_code}
              </p>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 md:justify-end">
                  <Icon icon="ph:envelope" className="text-blue-400 text-sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Email ID : {quote.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <Icon icon="ph:phone" className="text-blue-400 text-sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Phone No : {quote.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:justify-end pt-1">
                  <Icon
                    icon="ph:calendar-blank"
                    className="text-slate-400 text-sm"
                  />
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Quote Date : {quote.created_at}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Line Items Card ── */}
      <Card>
        <SectionHeader icon="ph:list-bullets" title="Line Items" />

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
                    <div className="flex flex-wrap gap-1.5">
                      {item.images.map((_, i) => (
                        <button
                          key={i}
                          className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110 transition-all"
                          title="View image"
                        >
                          <Icon icon="ph:eye" className="text-sm" />
                        </button>
                      ))}
                      {item.images.length === 0 && (
                        <span className="text-xs text-slate-300 dark:text-slate-600">
                          —
                        </span>
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

        {/* Add Extra Work / Submit */}
        <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <Icon icon="ph:plus-circle" className="text-base" />
            Add Extra Work
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-400 text-sm font-medium bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
            <Icon icon="ph:paper-plane-tilt" className="text-base" />
            Submit
          </button>
        </div>
      </Card>

      {/* ── Notes + Totals Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Notes */}
        <Card>
          <SectionHeader icon="ph:note-pencil" title="Notes" />
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Customer Notes
              </label>
              <div className="min-h-[64px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                {quote.notes || (
                  <span className="italic text-slate-300 dark:text-slate-600">
                    No notes added
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Admin Notes
              </label>
              <div className="min-h-[64px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                {quote.adminnotes || (
                  <span className="italic text-slate-300 dark:text-slate-600">
                    No notes added
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Totals */}
        <Card>
          <SectionHeader icon="ph:calculator" title="Summary" />
          <div className="space-y-2.5">
            {[
              {
                label: "Total Linear Feet",
                value: `$${quote.total_feet_price}`,
              },
              {
                label: "Total Controller",
                value: `$${quote.total_controller_price}`,
              },
              {
                label: `Discount (${quote.discount_percentage}%)`,
                value: `-$${(
                  ((Number(quote.total_feet_price || 0) +
                    Number(quote.total_controller_price || 0)) *
                    Number(quote.discount_percentage || 0)) /
                  100
                ).toFixed(2)}`,
                red: true,
              },
              // {
              //   label: `Total Extra Work`,
              //   value: `-$${quote.total_extra_work ?? 0.0}`,
              //   red: true,
              // },
              {
                label: `GST (${quote.gst_percentage}%)`,
                value: `$${quote.gst}`,
              },
            ].map(({ label, value, red }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 dark:border-slate-700/60"
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span
                  className={`text-sm font-semibold ${red ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {value}
                </span>
              </div>
            ))}

            {/* Main Total */}
            <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 shadow-base">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
                  Main Total
                </span>
                <span className="text-2xl font-bold text-white">
                  ${quote.main_total}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* ── Actions Card ── */}
      <Card>
        <SectionHeader icon="ph:gear-six" title="Actions" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
              <Icon icon="ph:paper-plane-right" className="text-base" />
              Resend Quote
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors shadow-sm">
              <Icon icon="ph:arrows-clockwise" className="text-base" />
              Updated Quote
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shadow-sm capitalize">
              <Icon icon="ph:check-circle" className="text-base" />
              Approved
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm">
              <Icon icon="ph:printer" className="text-base" />
              Print
            </button>
          </div>
        </div>

        <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

        {/* Payment Info */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                Payment Option
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Deposit Payment
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                Amount Due
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                ${quote.payment_details.part_payment_amount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                Payment Methods
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">
                {quote.payment_details.select_payment_methods}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingPayment(!editingPayment)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-sm flex-shrink-0 ${
              editingPayment
                ? "bg-slate-500 hover:bg-slate-600"
                : "bg-orange-400 hover:bg-orange-500"
            }`}
            title="Edit payment"
          >
            <Icon
              icon={editingPayment ? "ph:x" : "ph:pencil-simple"}
              className="text-base"
            />
          </button>
        </div>

        <div className="my-5 border-t border-slate-100 dark:border-slate-700" />

        {/* Send Final Invoice */}
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white text-sm font-bold tracking-wide transition-all shadow-base hover:shadow-card hover:-translate-y-0.5 active:translate-y-0">
          <Icon icon="ph:invoice" className="text-base" />
          Send Final Invoice
        </button>
      </Card>
    </div>
  );
};

export default ViewQuoteAdmin;
