import { Star, Phone, Mail, MapPin, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote } from "../../services/quoteService";
import Modal from "@/components/ui/Modal";
import { formatDateLong } from "../../utils/formatters";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { decodeId } from "../../utils/mappers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getImgSrc = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const reviewsData = [
  {
    reviewer_name: "Frank Romano",
    rating: "5 Stars",
    review_text:
      "Extraordinary company who delivered a superb product that transformed our house into a beautiful color show at night. We are beyond pleased with our outdoor lighting and highly recommend CANstar to anyone looking for a company true to their word.",
  },
  {
    reviewer_name: "Bhanu Mehta",
    rating: "5 Stars",
    review_text:
      "I normally don't leave reviews but we highly recommend Can Star Lights. Their recommendations and installation work were exceptional. Everything has been great with the lights. Don't think otherwise, just do it!",
  },
  {
    reviewer_name: "Wade Brintnell",
    rating: "5 Stars",
    review_text:
      "Absolutely thrilled with our lighting! Canstar did a fantastic job and their App is simply amazing. Highly recommend their work!",
  },
  {
    reviewer_name: "Ellwood Daycare",
    rating: "5 Stars",
    review_text:
      "Canstar lights edmonton and the team, according to me, is the ultimate 'A' team. Hands down the best in the business in Edmonton. Kudos!",
  },
  {
    reviewer_name: "Cherilyn Vreim",
    rating: "5 Stars",
    review_text:
      "Amazing service. After 2 years, they are still willing to help out to make our house magical. Very smart people!",
  },
  {
    reviewer_name: "Catherine Battiste",
    rating: "5 Stars",
    review_text:
      "Great product and awesome service! We love our lights! Had an issue and got a response very quickly. Definitely recommend going with this company!",
  },
];

export default function QuoteView() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);

  // ✅ CHANGE 1: Terms checkbox state driven by payment status
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
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

        // ✅ CHANGE 2: Auto-check terms if payment exists with status 0 or 1
        if (data?.payment_details) {
          const ps = data.payment_details.status;
          if (ps === 0 || ps === "0" || ps === 1 || ps === "1") {
            setTermsChecked(true);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // ✅ CHANGE 3: Determine if Confirm and Pay button should be hidden
  const isPayButtonHidden = () => {
    if (!quote?.payment_details) return false;
    const ps = quote.payment_details.status;
    return ps === 0 || ps === "0" || ps === 1 || ps === "1";
  };

  // ✅ CHANGE 4: Determine if terms checkbox should be disabled
  const isTermsDisabled = () => {
    if (!quote?.payment_details) return false;
    const ps = quote.payment_details.status;
    return ps === 0 || ps === "0" || ps === 1 || ps === "1";
  };

  // ✅ CHANGE 5: Deposit payment row label + color (matches PHP logic)
  const getDepositLabel = () => {
    if (!quote?.payment_details) return null;
    const ps = quote.payment_details.status;
    const type =
      quote.payment_details.payment_type === 1
        ? "Full Payment"
        : "Deposit Payment";

    if (ps === 0 || ps === "0") {
      return {
        label: `${type} — Awaiting Confirmation`,
        color: "text-orange-500",
      };
    } else if (ps === 1 || ps === "1") {
      return { label: `${type} — Paid`, color: "text-green-500" };
    } else {
      return { label: "Deposit Amount", color: "text-gray-600" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff6f6] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading invoice...</p>
      </div>
    );
  }

  if (error || !quote) {
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
  }

  const handleDownloadInvoice = async () => {
    try {
      const element = document.querySelector(".invoice-layout");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      let heightLeft = (canvas.height * imgWidth) / canvas.width;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - (canvas.height * imgWidth) / canvas.width;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, pageHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Quote-${quote.quote_no}.pdf`);
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Failed to download");
    }
  };

  const buildItems = () => {
    let items = [];
    let counter = 0;

    if (quote.annotation_image && Array.isArray(quote.annotation_image)) {
      quote.annotation_image.forEach((item) => {
        // ✅ CHANGE 6: Use drawnLines images only (matches PHP)
        const drawnImages = item.images || [];
        // ✅ CHANGE 7: Updated description wording to match PHP exactly
        items.push({
          no: ++counter,
          description: `Canstar Puck Lights with a customized data line system, paired with a <b>${item.color}</b> aluminum track package, designed for the <b>${item.identify_image_name}</b> of the house/property.`,
          total: parseFloat(item.total_amount),
          images: drawnImages,
          required: item.required, // ✅ CHANGE 8: pass required for checkbox
        });
      });
    }

    if (quote.products && Array.isArray(quote.products)) {
      quote.products.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product_description || item.product,
          total: parseFloat(item.amount),
          images: [],
          required: item.required,
        });
      });
    }

    if (quote.custom_product_data && Array.isArray(quote.custom_product_data)) {
      quote.custom_product_data.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product,
          total: parseFloat(item.amount),
          images: [],
          required: item.required,
        });
      });
    }

    if (quote.extra_work_data && Array.isArray(quote.extra_work_data)) {
      quote.extra_work_data.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product,
          total: parseFloat(item.amount),
          images: [],
          required: null, // extra work has no checkbox in PHP
        });
      });
    }

    return items;
  };

  const items = buildItems();
  const depositInfo = getDepositLabel();

  return (
    <div className="min-h-screen bg-[#fff6f6] py-4 md:py-8 px-3 md:px-4 lg:px-8 flex flex-col items-center font-sans">
      <div className="bg-white w-full max-w-[1120px] shadow-2xl rounded-lg md:rounded-2xl overflow-hidden relative pb-12 md:pb-16 invoice-layout">
        {/* ✅ CHANGE 9: Header shows "QUOTE" and quote_no instead of "INVOICE" and payment_id */}
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
                QUOTE
              </h2>
              <div className="flex justify-between text-sm md:text-base">
                <span>Quote Number</span>
                <span className="font-semibold">#{quote.quote_no}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span>Quote Date</span>
                <span>
                  {formatDateLong(
                    quote.created_at?.split("T")[0] ||
                      new Date().toISOString().split("T")[0],
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-10 lg:px-14 pt-6 md:pt-8 relative z-0">
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            <div className="space-y-1 flex-1">
              {/* ✅ CHANGE 10: "Quote From" instead of "Invoice From" */}
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
                Quote From
              </h3>
              <p className="font-bold text-gray-900 text-base md:text-lg">
                CANSTAR LIGHT LTD
              </p>
              <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed">
                3227 18 St NW, Edmonton, AB T6T 0H2
              </p>
              <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
                info@canstarlight.ca
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                (780) 716-4210
              </p>
              <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
                GST/HST: 742932601 RT001
              </p>
            </div>
            <div className="space-y-1 flex-1 md:text-right">
              {/* ✅ CHANGE 11: "Quote To" instead of "Invoice To" */}
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
                Quote To
              </h3>
              <p className="font-bold text-gray-900 text-base md:text-lg">
                {quote.fname} {quote.lname}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {quote.email}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {quote.phone}
              </p>
              <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed mt-1 md:mt-2 md:ml-auto">
                {quote.address}, {quote.city}, {quote.state} - {quote.post_code}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 md:mt-14 px-4 md:px-10 lg:px-14">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-base text-left">
              <thead>
                <tr className="bg-[#ee5d59] text-white">
                  {/* ✅ CHANGE 12: Added empty checkbox column header to match PHP */}
                  <th className="py-3 md:py-4 px-2 md:px-4 w-8"></th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-xs md:text-base">
                    NO.
                  </th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-xs md:text-base">
                    ITEM DESCRIPTION
                  </th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-center text-xs md:text-base">
                    IMAGE
                  </th>
                  <th className="py-3 md:py-4 px-2 md:px-4 font-medium text-right text-xs md:text-base">
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
                    {/* ✅ CHANGE 13: Show checkbox for Optional items (matches PHP) */}
                    <td className="py-3 md:py-5 px-2 md:px-4 border-b border-gray-100 align-top">
                      {item.required === "Optional" && (
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-[#ee5d59]"
                          onChange={(e) => setTermsChecked(e.target.checked)}
                        />
                      )}
                    </td>
                    <td className="py-3 md:py-5 px-2 md:px-4 font-medium text-gray-900 border-b border-gray-100 align-top text-xs md:text-base">
                      {item.no}
                    </td>
                    <td
                      className="py-3 md:py-5 px-2 md:px-4 text-gray-600 border-b border-gray-100 align-top leading-relaxed text-xs md:text-base"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <td className="py-3 md:py-5 px-2 md:px-4 border-b border-gray-100 align-top text-center">
                      {item.images && item.images.length > 0 ? (
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
                        <span className="text-gray-400 text-xs md:text-base">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-3 md:py-5 px-2 md:px-4 text-right font-medium text-gray-900 border-b border-gray-100 align-top text-xs md:text-base">
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
              <span>GST ({parseInt(quote.gst_percentage)}%):</span>
              <span>{formatCurrency(quote.gst)}</span>
            </div>

            <div className="flex justify-between text-[#ee5d59] font-bold text-lg md:text-2xl pt-1 md:pt-2">
              <span>Total:</span>
              <span>{formatCurrency(quote.main_total)}</span>
            </div>

            {/* ✅ CHANGE 14: Deposit row with dynamic label + color matching PHP */}
            {quote.payment_details?.part_payment_amount && depositInfo && (
              <div
                className={`flex justify-between font-medium pt-1 md:pt-2 text-xs md:text-base ${depositInfo.color}`}
              >
                <span>{depositInfo.label}:</span>
                <span>
                  {formatCurrency(quote.payment_details.part_payment_amount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ CHANGE 15: Notes only shown if customer_visible === 'yes' */}
        {quote.notes && quote.customer_visible === "yes" && (
          <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
            <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-2">
              Notes :
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {quote.notes}
            </p>
          </div>
        )}

        {/* Reviews */}
        <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
          <div className="border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 relative bg-white shadow-sm">
            <div className="absolute -top-3 md:-top-3.5 left-4 md:left-6 bg-white px-2 md:px-3">
              <span className="text-[#ee5d59] font-bold text-xs md:text-base tracking-wide">
                Customer Reviews
              </span>
            </div>
            <div className="relative">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 md:w-5 h-4 md:h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm md:text-base italic leading-relaxed mb-4 min-h-[80px]">
                "{reviewsData[reviewIdx]?.review_text}"
              </p>
              <span className="text-gray-900 font-medium text-xs md:text-base">
                {reviewsData[reviewIdx]?.reviewer_name}
              </span>
              <div className="flex justify-center gap-2 mt-4">
                {reviewsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? "bg-[#ee5d59] w-6" : "bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Payment */}
        <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-12 flex flex-col lg:flex-row gap-6 md:gap-10">
          <div className="w-full lg:w-[70%]">
            <h3 className="text-[#ee5d59] font-semibold mb-2 md:mb-3 text-lg md:text-xl">
              Terms & Conditions
            </h3>
            <p className="text-gray-600 text-xs md:text-base leading-relaxed mb-3 md:mb-4">
              Our estimate includes the supply and installation of the
              color-matched/best-match track along with the master control
              system. To secure your booking, a deposit of 25% of the quoted
              amount or the full amount is required. This deposit will
              prioritize your project in our completion queue. Payments can be
              made via e-transfer to info@canstarlight.ca, by check payable to
              CANSTAR LIGHT LTD, or in cash. (Please note that if paying by
              credit card, an additional 3% will be charged per transaction for
              processing fees.) The product comes with a 5-year warranty, and
              labor is covered for 4 years from the date of installation.
            </p>
            {/* ✅ CHANGE 16: Terms checkbox disabled + pre-checked based on payment status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsChecked}
                disabled={isTermsDisabled()}
                onChange={(e) =>
                  !isTermsDisabled() && setTermsChecked(e.target.checked)
                }
                className="w-4 h-4 accent-[#ee5d59]"
              />
              <label
                htmlFor="terms"
                className="text-xs md:text-base font-medium text-gray-700"
              >
                I agree to the Terms & Conditions
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 md:p-5 rounded-lg md:rounded-xl w-full lg:w-[30%]">
            <h3 className="text-[#ee5d59] font-semibold mb-2 md:mb-3 text-lg md:text-xl">
              Payment Method
            </h3>
            <div className="space-y-2 text-xs md:text-base text-gray-700">
              <p>
                <span className="font-medium">Interact transfer:</span>{" "}
                info@canstarlight.ca
              </p>
              <p>
                <span className="font-medium">Cheque Payable:</span> Canstar
                Light LTD
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 md:mt-14 bg-[#f8f9fa] py-4 md:py-6 px-4 md:px-10 lg:px-14 flex flex-col md:flex-row justify-start items-start md:items-center gap-3 md:gap-4 text-xs md:text-base relative border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <Phone className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59]" />
            <span>(780) 716-4210</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <Mail className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59]" />
            <span>info@canstarlight.ca</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <MapPin className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59] shrink-0" />
            <span className="truncate">
              3227 18 St NW, Edmonton, AB T6T 0H2
            </span>
          </div>
          <div className="hidden md:block absolute bottom-0 right-0 bg-[#ee5d59] w-40 md:w-80 h-6 md:h-8 rounded-tl-[60px] opacity-90"></div>
        </div>
      </div>

      {/* ✅ CHANGE 17: Confirm and Pay hidden based on payment status (matches PHP) */}
      <div className="w-full max-w-[1120px] mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 no-print px-3 md:px-4">
        {!isPayButtonHidden() && (
          <Button
            size="lg"
            disabled={!termsChecked}
            className="bg-[#ee5d59] hover:bg-[#ee5d59]/90 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg"
          >
            Confirm And Pay
          </Button>
        )}
        <Button
          size="lg"
          variant="outline"
          className="bg-[#2563eb] border-transparent hover:bg-blue-700 text-white font-semibold px-6 py-2 md:py-3 rounded-full shadow-lg gap-2"
          onClick={handleDownloadInvoice}
        >
          <Download className="w-4 md:w-5 h-4 md:h-5" />
          Download Quote
        </Button>
      </div>

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
