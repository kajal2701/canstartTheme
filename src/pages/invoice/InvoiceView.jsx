// src/pages/invoice/InvoicePage.jsx
import Button from "@/components/ui/Button";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote } from "../../services/quoteService";
import Modal from "@/components/ui/Modal";
import {
  BASE_URL,
  formatCurrency,
  formatDateLong,
  getImgSrc,
} from "../../utils/formatters";
import { decodeId } from "../../utils/mappers";
import { REVIEW_DATA } from "../../utils/constants";
import { downloadAsPDF } from "../../utils/pdfDownloader";

import {
  renderCompanyAddress,
  renderCustomerAddress,
  renderReviews,
  renderTermsAndPayment,
  renderContactFooter,
  buildQuoteItems,
} from "../../utils/helperFunctions";
import { Download } from "lucide-react";

export default function InvoicePage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [termsChecked, setTermsChecked] = useState(true); // invoice always pre-checked

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev === REVIEW_DATA.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const decodedId = decodeId(id);
        if (!decodedId) {
          setError("Invalid invoice ID");
          return;
        }
        const data = await getQuote(decodedId);
        setQuote(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      await downloadAsPDF({
        selector: ".invoice-layout",
        filename: `Invoice-${quote.payment_details?.payment_id || quote.quote_id}.pdf`,
      });
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fff6f6] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading invoice...</p>
      </div>
    );

  if (error || !quote)
    return (
      <div className="min-h-screen bg-[#fff6f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Invoice not found"}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );

  const items = buildQuoteItems(quote, { descriptionStyle: "php" });

  return (
    <div className="min-h-screen bg-[#fff6f6] py-4 md:py-8 px-3 md:px-4 lg:px-8 flex flex-col items-center font-sans">
      <div className="bg-white w-full max-w-[1120px] shadow-2xl rounded-lg md:rounded-2xl overflow-hidden relative pb-12 md:pb-16 invoice-layout">
        {/* Header */}
        <div className="flex flex-col md:flex-row h-auto md:h-[150px]">
          <div className="flex items-center justify-center md:justify-start p-4 md:p-6 bg-white flex-1">
            <img
              src={CanstarLogo}
              alt="Canstar Logo"
              className="h-[80px] md:h-[120px] object-contain"
            />
          </div>
          <div
            className="text-white flex flex-col flex-wrap-reverse w-full p-6 md:p-0 items-start md:w-[50%] md:justify-center"
            style={{
              background: "#ee5d59",
              borderBottomLeftRadius:
                window.innerWidth >= 768 ? "200px" : "0px",
            }}
          >
            <div className="w-full md:w-[250px] md:mr-[50px]">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                INVOICE
              </h2>
              <div className="flex justify-between text-sm md:text-base">
                <span>Invoice Number</span>
                <span className="font-semibold">
                  #INV250{quote.payment_details?.payment_id || quote.quote_id}
                </span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span>Invoice Date</span>
                <span>
                  {formatDateLong(
                    quote.invoice_date ||
                      new Date().toISOString().split("T")[0],
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="px-4 md:px-10 lg:px-14 pt-6 md:pt-8 relative z-0">
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            {renderCompanyAddress("Invoice From")}
            {renderCustomerAddress(quote, "Invoice To")}
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 md:mt-14 px-4 md:px-10 lg:px-14">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-base text-left">
              <thead>
                <tr className="bg-[#ee5d59] text-white">
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium">NO.</th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium">
                    ITEM DESCRIPTION
                  </th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-center">
                    IMAGE
                  </th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-right">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
                  >
                    <td className="py-3 md:py-5 px-2 md:px-4 font-medium text-gray-900 border-b border-gray-100 align-top">
                      {item.no}
                    </td>
                    <td
                      className="py-3 md:py-5 px-2 md:px-4 text-gray-600 border-b border-gray-100 align-top leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <td className="py-3 md:py-5 px-2 md:px-4 border-b border-gray-100 align-top text-center">
                      {item.images?.length > 0 ? (
                        <div className="flex flex-col gap-2 justify-center items-center">
                          {item.images.slice(0, 2).map((img, i) => (
                            <img
                              key={i}
                              src={
                                img.image_url
                                  ? `${BASE_URL}/${img.image_url}`
                                  : ""
                              }
                              alt="preview"
                              className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white bg-gray-200 shadow-md object-cover cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => {
                                setPreviewSrc(getImgSrc(img.image_url));
                                setPreviewOpen(true);
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 md:py-5 px-2 md:px-4 text-right font-medium text-gray-900 border-b border-gray-100 align-top">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end px-4 md:px-10 lg:px-14 mt-6 md:mt-8">
          <div className="w-full md:max-w-[320px] space-y-2 md:space-y-3">
            <div className="flex justify-between text-gray-600 font-medium text-xs md:text-base">
              <span>Subtotal:</span>
              <span>
                {formatCurrency(
                  parseFloat(quote.total_feet_price) +
                    parseFloat(quote.total_controller_price),
                )}
              </span>
            </div>
            {quote.total_extra_work && (
              <div className="flex justify-between text-gray-600 font-medium text-xs md:text-base">
                <span>Total Extra Work:</span>
                <span>{formatCurrency(quote.total_extra_work)}</span>
              </div>
            )}
            <div className="flex justify-between text-green-500 font-medium text-xs md:text-base">
              <span>Discount ({quote.discount_percentage}%):</span>
              <span>
                {formatCurrency(
                  quote.discount_amount ||
                    ((parseFloat(quote.total_feet_price) +
                      parseFloat(quote.total_controller_price)) *
                      parseFloat(quote.discount_percentage)) /
                      100,
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium pb-2 md:pb-3 border-b border-gray-200 text-xs md:text-base">
              <span>GST ({quote.gst_percentage}%):</span>
              <span>{formatCurrency(quote.gst)}</span>
            </div>
            <div className="flex justify-between text-[#ee5d59] font-bold text-lg md:text-2xl pt-1 md:pt-2">
              <span>Total:</span>
              <span>{formatCurrency(quote.main_total)}</span>
            </div>
            {quote.payment_details?.part_payment_amount && (
              <div className="flex justify-between text-green-500 font-medium pt-1 md:pt-2 text-xs md:text-base">
                <span>
                  {quote.payment_details.payment_type === 1
                    ? "Full payment"
                    : "Deposit Payment"}{" "}
                  paid:
                </span>
                <span>
                  {formatCurrency(quote.payment_details.part_payment_amount)}
                </span>
              </div>
            )}
            {quote.payment_details?.pending_payment_amount > 0 && (
              <div className="flex justify-between text-[#ee5d59] font-bold pt-1 md:pt-2 text-xs md:text-base">
                <span>Pending Payment:</span>
                <span>
                  {formatCurrency(quote.payment_details.pending_payment_amount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
            <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-2">
              Notes :
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {quote.notes}
            </p>
          </div>
        )}

        {/* ✅ Common functions used here */}
        {renderReviews(reviewIdx, setReviewIdx)}
        {renderTermsAndPayment(termsChecked, true, () => {})}
        {renderContactFooter()}
      </div>

      {/* Action Buttons */}
      {quote.payment_details?.pending_payment_amount > 0 && (
        <div className="w-full max-w-[1120px] mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 no-print px-3 md:px-4">
          <Button
            size="lg"
            className="bg-[#ee5d59] hover:bg-[#ee5d59]/90 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg"
          >
            Confirm And Pay
          </Button>
          <Button
            size="lg"
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold px-6 py-2 md:py-3 rounded-full shadow-lg gap-2"
            onClick={handleDownloadInvoice}
          >
            <Download className="w-4 md:w-5 h-4 md:h-5" />
            Download Invoice
          </Button>
        </div>
      )}

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
    </div>
  );
}
