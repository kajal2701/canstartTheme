import React from "react";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#fff6f6] py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        {/* Logo */}
        <div className="mb-10">
          <img
            src={CanstarLogo}
            alt="Canstar Logo"
            className="h-[80px] md:h-[120px] object-contain"
          />
        </div>

        {/* Validity Notice */}
        <p className="text-gray-700 mb-4">
          This quote is valid for the next 15 days. After this period, the
          values may be subject to change.
        </p>
        <p className="text-gray-700 mb-8">
          The line items outlined above, along with the accompanying photographs
          and other representations of the lighting system's location, as
          detailed in the quote email, together with the Terms and Conditions
          listed below, form the complete agreement referred to collectively as
          the "Quote." Your payment to Canstar Light Ltd. (Canstar Light) of the
          deposit (the "Deposit") indicates your acceptance of the terms and
          conditions set forth in this Quote.
        </p>

        {/* Terms and Conditions */}
        <h2 className="text-[#c0392b] font-semibold text-lg mb-4">
          **Terms and Conditions:**
        </h2>

        <p className="text-gray-700 mb-4">
          You are responsible for ensuring compliance with all relevant
          Homeowners Association (HOA), strata, city, provincial, or other
          legislative requirements for installing these systems on your
          property. This includes securing any necessary approvals. Canstar
          Light will assist with seeking approvals but is not responsible for
          obtaining such approvals or ensuring compliance with any restrictions.
          You may cancel this Quote within 24 hours of making the Deposit. In
          such a case, the Deposit will be refunded to you, and neither you nor
          Canstar Light will have any further obligations to each other. If 24
          hours have passed since you made the Deposit and you have not canceled
          the Quote, Canstar Light will proceed with ordering the custom
          materials necessary for the product/services specified in the Quote.
          At that point, the Deposit will become non-refundable.
        </p>

        <p className="text-gray-700 mb-4">
          You agree to provide Canstar Light with access to the worksite during
          normal and reasonable hours and to allow sufficient time for Canstar
          Light, or its agents and contractors, to complete the installation. If
          you terminate the installation of the product/services before
          completion, you remain liable for full payment of the Quote. Canstar
          Light will not be held liable for any delays or failure in
          installation due to causes beyond its reasonable control, including,
          but not limited to, acts of God, acts of civil or military authority,
          acts of public enemies, war, epidemic, pandemic, or any similar cause.
          You are responsible for properly identifying any below-grade items of
          interest on the worksite, including, but not limited to, drip lines,
          gas lines, irrigation lines, dog fences, cable lines, etc. Canstar
          Light will not be responsible for any damage to items that are not
          disclosed or identified. Existing exterior electrical outlets,
          transformers, and systems must be in proper working condition and have
          adequate capacity to support the new installation. Unless otherwise
          stated in writing in this Quote, the Quote includes Canstar Light's
          standard installation of the products described. This standard
          installation includes, but is not limited to, the following for
          Permanent Holiday Lighting:
        </p>

        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-2">
          <li>
            Mounting the track at corners and other intersections with gaps no
            greater than 3/4 inch (.75), depending on the bending of the track.
          </li>
          <li>
            At transitions between rooflines or other areas where no lighting
            will be installed, enclosing the wiring in protective, flexible
            tubing or color-matched "loom track" (where applicable) and securing
            it to walls, soffits, flashing, downspouts, etc.
          </li>
          <li>
            Color-matching the track to the soffit or trim as closely as
            possible, or using a complementary color as agreed upon.
          </li>
          <li>
            Following Canstar Light's standard installation methods for typical
            residential and commercial applications.
          </li>
        </ul>

        <p className="text-gray-700 mb-8">
          Full payment will be due upon completion of the standard installation
          of the quoted product/services. You agree to pay the full amount as
          specified. Failure to pay or complete arrangement for the
          product/services may result in Canstar Light exercising its legal
          remedies. You agree to release Canstar Light from any liability for
          damages to you, your agents, or guests occurring in connection with
          the installation of the product/service, unless Canstar Light is found
          to be grossly negligent. If any party breaches or defaults on its
          obligations under this agreement, and it becomes necessary for a party
          to employ an attorney to enforce or defend its rights or remedies, the
          non-prevailing party shall pay the prevailing party's reasonable
          attorney's fees and court costs, if any, regardless of whether a
          lawsuit is filed. A plaintiff is considered the prevailing party if
          they succeed on the merits of their claims, while a defendant is
          considered the prevailing party if they defeat the claims or succeed
          on any affirmative claims against the plaintiff. A defendant must file
          affirmative claims against the plaintiff to be considered the
          prevailing party for the purpose of this provision.
        </p>

        {/* Warranty Section */}
        <h2 className="text-[#c0392b] font-semibold text-lg mb-2">
          Canstar Light Ltd. Warranty Information
        </h2>
        <h3 className="font-bold text-gray-800 text-base mb-3">
          Service and Workmanship Warranty
        </h3>
        <p className="text-gray-700 mb-6">
          Canstar Light Ltd. provides a 5-year product warranty and 4-year
          warranty on all installation labor and warranty-related service work.
          This warranty covers the workmanship and service of the products we
          have installed. After the 4-year period expires, standard service fees
          will apply for labor, while materials will continue to be covered
          under their respective manufacturer warranties (see Product Warranties
          section below).
        </p>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          Service Warranty Coverage
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1 ml-2">
          <li>Initial installation labor</li>
          <li>Warranty-related service calls within the 4-year period</li>
          <li>Troubleshooting and diagnostics</li>
          <li>Standard equipment access and servicing</li>
        </ul>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          Service Warranty Exclusions
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1 ml-2">
          <li>
            Labor costs for special access installations requiring third-party
            contractors (e.g., crane operators, rappelling crews)
          </li>
          <li>Service calls after the 4-year warranty period</li>
          <li>Emergency or after-hours service calls</li>
        </ul>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          Limitation of Liability
        </h3>
        <p className="text-gray-700 mb-3">
          Canstar Light Ltd.'s liability under this warranty is limited to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-2">
          <li>1. The original purchase price of the product in question</li>
          <li>2. The cost of labor during the warranty period</li>
        </ul>
        <p className="text-gray-700 mb-3">We shall not be liable for:</p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1 ml-2">
          <li>Direct, incidental, or consequential damages</li>
          <li>Loss of use</li>
          <li>Loss of revenue</li>
          <li>Loss of profits</li>
          <li>Any damages beyond the original purchase price of the product</li>
        </ul>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          Warranty Exclusions
        </h3>
        <p className="text-gray-700 mb-3">
          This warranty becomes void if damage or malfunction occurs due to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-2">
          <li>Physical and Environmental Factors</li>
          <li>Accidental damage</li>
          <li>Construction or remodeling damage</li>
          <li>Environmental factors (air pollution, mold, mildew)</li>
          <li>Natural disasters (fire, lightning, hurricanes, earthquakes)</li>
          <li>Pest-related damage (e.g., rodents, insects)</li>
        </ul>

        <h3 className="font-bold text-gray-800 text-base mb-3">
          Technical and Usage Factors
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1 ml-2">
          <li>
            Controller or Wi-Fi connectivity issues due to
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li>Password changes</li>
              <li>Internet service provider changes</li>
              <li>Network configuration modifications</li>
            </ul>
          </li>
          <li>Misuse or abuse of products</li>
          <li>Vandalism</li>
          <li>Unauthorized modifications</li>
          <li>Improper maintenance</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
