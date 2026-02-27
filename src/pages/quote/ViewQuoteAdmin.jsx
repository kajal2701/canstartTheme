import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import LoadingIcon from "@/components/LoadingIcon";
import { getQuote } from "../../services/quoteService";
import { toast } from "react-toastify";
import { StatusBadge } from "../../utils/helperFunctions";
import CompanyInfo from "../../components/quote/quoteView/CompanyInfo";
import LineItemsTable from "../../components/quote/quoteView/LineItemsTable";
import NotesSection from "../../components/quote/quoteView/NotesSection";
import SummarySection from "../../components/quote/quoteView/SummarySection";
import ActionsCard from "../../components/quote/quoteView/ActionsCard";

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

  const formattedItems = useMemo(() => {
    if (!quote) return [];

    const annotationItems = (quote.annotation_image || []).map((item, index) => ({
      id: index + 1,
      description: `Canstar Puck Lights with a customized data line system, paired with a ${item.color} aluminum track package, designed for the ${item.identify_image_name} of the house/property.`,
      images: item.images || [],
      quantity: item.total_numerical_box,
      unitCost: Number(item.unit_price),
      total: Number(item.total_amount),
    }));

    const productItems = (quote.products || []).map((product, index) => ({
      id: (quote.annotation_image?.length || 0) + index + 1,
      description: product.product_description,
      images: [],
      quantity: Number(product.qty),
      unitCost: Number(product.price),
      total: Number(product.amount),
    }));

    return [...annotationItems, ...productItems];
  }, [quote?.annotation_image, quote?.products]);
  
  const handleNavigateBack = useCallback(() => {
    navigate("/quote");
  }, [navigate]);

  const handleEditPayment = useCallback(() => {
    setEditingPayment(prev => !prev);
  }, []);

  const summaryCalculations = useMemo(() => {
    const totalFeetPrice = Number(quote?.total_feet_price || 0);
    const totalControllerPrice = Number(quote?.total_controller_price || 0);
    const discountPercentage = Number(quote?.discount_percentage || 0);
    
    const subtotal = totalFeetPrice + totalControllerPrice;
    const discountAmount = (subtotal * discountPercentage) / 100;
    
    return {
      subtotal,
      discountAmount,
      discountAmountFormatted: `-$${discountAmount.toFixed(2)}`
    };
  }, [quote?.total_feet_price, quote?.total_controller_price, quote?.discount_percentage]);

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
          onClick={handleNavigateBack}
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
            onClick={handleNavigateBack}
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
        <CompanyInfo quote={quote} />
      </Card>

      {/* ── Line Items Card ── */}
      <LineItemsTable formattedItems={formattedItems} />

      {/* ── Notes + Totals Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <NotesSection quote={quote} />
        <SummarySection quote={quote} summaryCalculations={summaryCalculations} />
      </div>
      {/* ── Actions Card ── */}
      <ActionsCard 
        quote={quote} 
        editingPayment={editingPayment} 
        onEditPayment={handleEditPayment} 
      />
    </div>
  );
};

export default React.memo(ViewQuoteAdmin);
