import { Sparkles, Star, Phone, Mail, MapPin, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/checkbox";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getQuote } from "../../services/quoteService";

// Dummy Invoice Data
const dummyInvoice = {
  invoiceNumber: "250369",
  date: "March 9, 2026",
  from: {
    name: "CANSTAR LIGHT LTD",
    address: "3227 18 St NW, Edmonton, AB T6T 0H2",
    email: "info@canstarlight.ca",
    phone: "(780) 716-4210",
    gst: "742932601 RT001",
  },
  to: {
    name: "ZEENAT KHALIL",
    email: "zeenatkhalil89@gmail.com",
    phone: "7806673102",
    address: "9209 223A St NW, Edmonton, Alberta – T5T 7P3",
  },
  items: [
    {
      no: 1,
      description:
        "Canstar puck lights with customised data line system, Charcoal aluminium channel track package for the Front Bottom of the house",
      total: 1536.0,
      images: [{}, {}, {}, {}],
    },
    {
      no: 2,
      description:
        "Canstar puck lights with customised data line system, Charcoal aluminium channel track package for the Front Top of the house",
      total: 1848.0,
      images: [{}, {}, {}],
    },
    {
      no: 3,
      description:
        "Canstar puck lights with customised data line system, Charcoal aluminium channel track package for the Back of the house",
      total: 1680.0,
      images: [{}, {}],
    },
    {
      no: 4,
      description:
        "Canstar Four-Zone Smart Controller System with 12V Outdoor-Rated Power Box Unit",
      total: 280.0,
      images: [],
    },
    {
      no: 5,
      description:
        "Canstar Four-Zone Smart Controller System with 12V Outdoor-Rated Power Box Unit",
      total: 280.0,
      images: [],
    },
  ],
  subtotal: 5624.0,
  discount: 674.88,
  gst: 247.46,
  total: 5196.58,
  depositPaid: 1300.0,
  pendingPayment: 3896.58,
};

export default function InvoicePage() {
  const invoice = dummyInvoice;
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getQuote(id);
        console.log(data, "data");
        setQuote(data);
      } catch (e) {
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#fff6f6] py-4 md:py-8 px-3 md:px-4 lg:px-8 flex flex-col items-center font-sans">
      <div className="bg-white w-full max-w-[1120px] shadow-2xl print-shadow-none rounded-lg md:rounded-2xl overflow-hidden relative pb-12 md:pb-16">
        {/* Top Header with Logo and Invoice Section */}
        <div className="flex h-[150px]">
          {/* Left Logo Section */}
          <div className="flex items-center p-6 bg-white flex-1">
            <img
              src={CanstarLogo}
              alt="Canstar Logo"
              className="h-[120px] object-contain"
            />
          </div>
          {/* Right Invoice Section */}
          <div
            className="text-white p-8 flex flex-col  flex-wrap-reverse "
            style={{
              background: "#ee5d59",
              width: "50%",
              borderBottomLeftRadius: "200px",
            }}
          >
            <div className=" w-[250px] mr-[30px]">
              <h2 className="text-3xl font-bold mb-4 text-white ">INVOICE</h2>
              <div className="flex justify-between text-l mb-2">
                <span>Invoice Number</span>
                <span className="font-semibold">
                  #INV{invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between text-l">
                <span>Invoice Date</span>
                <span>{invoice.date}</span>
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
                {invoice.from.name}
              </p>
              <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed">
                {invoice.from.address}
              </p>
              <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
                {invoice.from.email}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {invoice.from.phone}
              </p>
              <p className="text-gray-600 text-sm md:text-base mt-1 md:mt-2">
                GST/HST: {invoice.from.gst}
              </p>
            </div>

            {/* Invoice To */}
            <div className="space-y-1 flex-1 md:text-right">
              <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-3">
                Invoice To
              </h3>
              <p className="font-bold text-gray-900 text-base md:text-lg">
                {invoice.to.name}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {invoice.to.email}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {invoice.to.phone}
              </p>
              <p className="text-gray-600 text-sm md:text-base max-w-[250px] leading-relaxed mt-1 md:mt-2 md:ml-auto">
                {invoice.to.address}
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
                {invoice.items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
                  >
                    <td className="py-3 md:py-5 px-2 md:px-4 font-medium text-gray-900 border-b border-gray-100 align-top text-xs md:text-base">
                      {item.no}
                    </td>
                    <td className="py-3 md:py-5 px-2 md:px-4 text-gray-600 border-b border-gray-100 align-top leading-relaxed text-xs md:text-base">
                      {item.description}
                    </td>
                    <td className="py-3 md:py-5 px-2 md:px-4 border-b border-gray-100 align-top text-center">
                      {item.images && item.images.length > 0 ? (
                        <div className="flex -space-x-3 justify-center">
                          {item.images.map((_, i) => (
                            <div
                              key={i}
                              className="w-6 md:w-8 h-6 md:h-8 rounded-full border-2 border-white bg-gray-200 shadow-sm flex-shrink-0"
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
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-green-500 font-medium text-xs md:text-base">
              <span>Discount (12%):</span>
              <span>{formatCurrency(invoice.discount)}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium pb-2 md:pb-3 border-b border-gray-200 text-xs md:text-base">
              <span>GST (5%):</span>
              <span>{formatCurrency(invoice.gst)}</span>
            </div>
            <div className="flex justify-between text-[#ee5d59] font-bold text-lg md:text-2xl pt-1 md:pt-2">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between text-green-500 font-medium pt-1 md:pt-2 text-xs md:text-base">
              <span>Deposit Payment paid:</span>
              <span>{formatCurrency(invoice.depositPaid)}</span>
            </div>
            <div className="flex justify-between text-[#ee5d59] font-bold pt-1 md:pt-2 text-xs md:text-base">
              <span>Pending Payment:</span>
              <span>{formatCurrency(invoice.pendingPayment)}</span>
            </div>
          </div>
        </div>

        {/* Notes  */}
        <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
          <div>
            <h3 className="text-[#ee5d59] font-semibold text-lg md:text-xl mb-2">
              Notes :
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Thank you for choosing Canstar Permanent Smart Lights. All
              installations come with a 5-year warranty on parts and a 1-year
              warranty on labor.
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-4 md:px-10 lg:px-14 mt-10 md:mt-16">
          <div className="border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 relative bg-white shadow-sm">
            <div className="absolute -top-3 md:-top-3.5 left-4 md:left-6 bg-white px-2 md:px-3">
              <span className="text-[#ee5d59] font-bold text-xs md:text-base tracking-wide">
                Customer Reviews
              </span>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 md:w-5 h-4 md:h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm md:text-base italic leading-relaxed">
              "Great product and awesome service! We love our lights! Had an
              issue and got a response very quickly. Definitely recommend going
              with this company!"
            </p>
            <div className="mt-3 md:mt-4">
              <span className="text-gray-900 font-medium text-xs md:text-base">
                Catherine Battiste
              </span>
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
                defaultChecked
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
        >
          <Download className="w-4 md:w-5 h-4 md:h-5" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
