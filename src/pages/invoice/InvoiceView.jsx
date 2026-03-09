import { Star, Phone, Mail, MapPin, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote } from "../../services/quoteService";
import Modal from "@/components/ui/Modal";
import { formatDateLong } from "../../utils/formatters";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// Safe image URL generator
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

export default function InvoicePage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
    }, 3000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getQuote(id);
        console.log(data, "quote data");
        setQuote(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      load();
    }
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff6f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading invoice...</p>
        </div>
      </div>
    );
  }

  const handleDownloadInvoice = async () => {
    try {
      const element = document.querySelector(".invoice-layout"); // Invoice container
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      let heightLeft = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
      heightLeft -= pageHeight;

      // Add remaining pages
      while (heightLeft > 0) {
        position = heightLeft - (canvas.height * imgWidth) / canvas.width;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, pageHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Invoice-${quote.payment_details?.payment_id || quote.quote_id}.pdf`,
      );
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice");
    }
  };

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

  // Build items array from annotation_image, products, custom_product_data, and extra_work_data
  const buildItems = () => {
    let items = [];
    let counter = 0;

    // Add annotation images
    if (quote.annotation_image && Array.isArray(quote.annotation_image)) {
      quote.annotation_image.forEach((item) => {
        items.push({
          no: ++counter,
          description: `Canstar puck lights with customised data line system, <b>${item.color}</b> aluminium channel track package for the <b>${item.identify_image_name}</b> of the house`,
          total: parseFloat(item.total_amount),
          images: item.images || [],
        });
      });
    }

    // Add products
    if (quote.products && Array.isArray(quote.products)) {
      quote.products.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product_description || item.product,
          total: parseFloat(item.amount),
          images: [],
        });
      });
    }

    // Add custom products
    if (quote.custom_product_data && Array.isArray(quote.custom_product_data)) {
      quote.custom_product_data.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product,
          total: parseFloat(item.amount),
          images: [],
        });
      });
    }

    // Add extra work
    if (quote.extra_work_data && Array.isArray(quote.extra_work_data)) {
      quote.extra_work_data.forEach((item) => {
        items.push({
          no: ++counter,
          description: item.product,
          total: parseFloat(item.amount),
          images: [],
        });
      });
    }

    return items;
  };

  const items = buildItems();

  return (
    <div className="min-h-screen bg-[#fff6f6] py-4 md:py-8 px-3 md:px-4 lg:px-8 flex flex-col items-center font-sans">
      <div className="bg-white w-full max-w-[1120px] shadow-2xl print-shadow-none rounded-lg md:rounded-2xl overflow-hidden relative pb-12 md:pb-16 invoice-layout">
        {/* Top Header with Logo and Invoice Section */}
        <div className="flex flex-col md:flex-row h-auto md:h-[150px]">
          {/* Left Logo Section */}
          <div className="flex items-center justify-center md:justify-start p-4 md:p-6 bg-white flex-1">
            <img
              src={CanstarLogo}
              alt="Canstar Logo"
              className="h-[80px] md:h-[120px] object-contain"
            />
          </div>
          {/* Right Invoice Section */}
          <div
            className="text-white  flex flex-col  flex-wrap-reverse w-full p-6 md:p-0 items-start md:w-[50%] md:justify-center"
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
              <div className="flex justify-between  text-sm md:text-base">
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

        <div className="px-4 md:px-10 lg:px-14 pt-6 md:pt-8 relative z-0">
          {/* Addresses Section */}
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            {/* Invoice From */}
            <div className="space-y-1 flex-1">
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
                Invoice From
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

            {/* Invoice To */}
            <div className="space-y-1 flex-1 md:text-right">
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
                Invoice To
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
                              className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-white bg-gray-200 shadow-md flex-shrink-0 object-cover cursor-pointer hover:shadow-lg transition-shadow"
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

        {/* Totals Section */}
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
                <span>Total Extra Work :</span>
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
            <div>
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-2">
                Notes :
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {quote.notes}
              </p>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
          <div className="border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 relative bg-white shadow-sm">
            <div className="absolute -top-3 md:-top-3.5 left-4 md:left-6 bg-white px-2 md:px-3">
              <span className="text-[#ee5d59] font-bold text-xs md:text-base tracking-wide">
                Customer Reviews
              </span>
            </div>

            {/* Reviews Carousel */}
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
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium text-xs md:text-base">
                  {reviewsData[reviewIdx]?.reviewer_name}
                </span>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {reviewsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === reviewIdx
                        ? "bg-[#ee5d59] w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer Details */}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                value={true}
                className="border-[#ee5d59] data-[state=checked]:bg-[#ee5d59]"
              />

              <label
                htmlFor="terms"
                className="text-xs md:text-base font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

        {/* Bottom Contact Bar */}
        <div className="mt-10 md:mt-14 bg-[#f8f9fa] py-4 md:py-6 px-4 md:px-10 lg:px-14 flex flex-col md:flex-row justify-start items-start md:items-center gap-3 md:gap-4 text-xs md:text-base relative border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <Phone className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59]" />
            <span className="text-xs md:text-base">(780) 716-4210</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <Mail className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59]" />
            <span className="text-xs md:text-base">info@canstarlight.ca</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 z-10">
            <MapPin className="w-4 md:w-5 h-4 md:h-5 text-[#ee5d59] shrink-0" />
            <span className="truncate text-xs md:text-base">
              3227 18 St NW, Edmonton
            </span>
          </div>

          {/* Bottom Right Red Curve */}
          <div className="hidden md:block absolute bottom-0 right-0 bg-[#ee5d59] w-40 md:w-80 h-6 md:h-8 rounded-tl-[60px] opacity-90"></div>
        </div>
      </div>

      {/* Floating Action Buttons below the document */}
      {quote.payment_details?.pending_payment_amount > 0 && (
        <div className="w-full max-w-[1120px] mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 no-print px-3 md:px-4">
          <Button
            size="lg"
            className="bg-[#ee5d59] hover:bg-[#ee5d59]/90 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-full shadow-lg shadow-[#ee5d59]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base w-full sm:w-auto"
          >
            Confirm And Pay
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-[#2563eb] border-transparent hover:bg-blue-700 text-white font-semibold px-6 md:px-6 py-2 md:py-3 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 gap-2 text-sm md:text-base w-full sm:w-auto"
            onClick={handleDownloadInvoice}
          >
            <Download className="w-4 md:w-5 h-4 md:h-5" />
            Download Invoice
          </Button>
        </div>
      )}

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
    </div>
  );
}
