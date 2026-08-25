import React from "react";
import CanstarLogo from "@/assets/images/logo/new-canstar-logo.jpg";

const NewTermsAndConditions = () => {
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
          This quote is valid for the next 10 days. After this period, the price may be subject to change.
        </p>
        <p className="text-gray-700 mb-8">
          The line items outlined above, along with the accompanying photographs and other representations of the lighting system's location, as detailed in the quote email, together with the Terms and Conditions listed below, form the complete agreement referred to collectively as the "Quote." Your payment to Canstar Light Ltd. (Canstar Light) of the deposit (the "Deposit") indicates your acceptance of the terms and conditions set forth in this Quote.

        </p>

        {/* Terms and Conditions */}
        <h2 className="text-[#c0392b] font-semibold text-lg mb-4">
          **Terms and Conditions:**
        </h2>

        {/* 1. Regulatory & Approval Compliance */}
        <p className="text-gray-700 mb-4">
          <strong>1. Regulatory &amp; Approval Compliance.</strong> You are responsible for ensuring compliance with all relevant Homeowners
          Association (HOA), strata, city, provincial, or other legislative requirements for installing these systems on your
          property. This includes securing any necessary approvals. Canstar Light will assist with seeking approvals but is not responsible
          for obtaining such approvals or ensuring compliance with any restrictions.
        </p>

        {/* 2. Cancellation & Material Orders */}
        <p className="text-gray-700 mb-4">
          <strong>2. Cancellation &amp; Material Orders.</strong> You may cancel this Quote within 24 hours of making the Deposit. In such a case,
          the Deposit will be refunded to you, and neither you nor Canstar Light will have any further obligations to each other. If 24
          hours have passed since you made the Deposit and you have not canceled the Quote, Canstar Light will proceed with
          ordering the custom materials necessary for the product/services specified in the Quote. At that point, the Deposit will
          become non-refundable.
        </p>

        {/* 3. Worksite Access & Performance */}
        <p className="text-gray-700 mb-2">
          <strong>3. Worksite Access &amp; Performance.</strong> You agree to provide Canstar Light with access to the worksite during normal and
          reasonable hours and to allow sufficient time for Canstar Light, or its agents and contractors, to complete the installation.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
          <li>
            <strong>Early Termination:</strong> If you terminate the installation of the product/services before completion, you remain liable for full
            payment of the Quote.
          </li>
          <li>
            <strong>Force Majeure:</strong> Canstar Light will not be held liable for any delays or failure in installation due to causes beyond its
            reasonable control, including, but not limited to, acts of God, acts of civil or military authority, acts of public enemies,
            war, epidemic, pandemic, or any similar cause.
          </li>
          <li>
            <strong>Below-Grade Identification:</strong> You are responsible for properly identifying any below-grade items of interest on the
            worksite, including, but not limited to, drip lines, gas lines, irrigation lines, dog fences, cable lines, etc. Canstar Light
            will not be responsible for any damage to items that are not disclosed or identified.
          </li>
          <li>
            <strong>Electrical Supply:</strong> Existing exterior electrical outlets, transformers, and systems must be in proper working condition
            and have adequate capacity to support the new installation.
          </li>
        </ul>

        {/* 4. Scope of Standard Installation */}
        <p className="text-gray-700 mb-2">
          <strong>4. Scope of Standard Installation.</strong> Unless otherwise stated in writing in this Quote, the Quote includes Canstar Light's
          standard installation of the products described. This standard installation includes, but is not limited to, the following for
          Permanent Holiday Lighting:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
          <li>Mounting the track at corners and other intersections with gaps, depending on the bending of the track.</li>
          <li>
            At transitions between rooflines or other areas where no lighting will be installed, enclosing the wiring in protective,
            flexible tubing or color-matched &quot;loom track&quot; (where applicable) and securing it to walls, soffits, flashing, downspouts,
            etc.
          </li>
          <li>Color-matching the track to the soffit or trim as closely as possible, or using a complementary color as agreed upon.</li>
          <li>Following Canstar Light's standard installation methods for typical residential and commercial applications.</li>
        </ul>

        {/* 5. Interior Power Supplies & Garage Door Interference */}
        <p className="text-gray-700 mb-2">
          <strong>5. Interior Power Supplies &amp; Garage Door Interference.</strong> If the power supply for exterior LED lighting is installed inside
          a garage, radio signal interference with the garage door opener may occur. While this occurrence is rare, it is an inherent
          risk of interior power installations. Canstar Light's product warranty does not cover:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
          <li>Signal interference or reduced range of garage door openers;</li>
          <li>Costs associated with troubleshooting, repairing, or replacing garage door opening systems; or</li>
          <li>Any secondary modifications required to resolve signal conflicts.</li>
        </ul>
        <p className="text-gray-700 mb-4">
          The property owner assumes full responsibility for any adjustments needed to mitigate potential signal interference.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Service Access Requirements:</strong> Warranty coverage for units with interior garage power supplies is contingent upon
          property access. Canstar Light is not liable for delayed warranty service or rescheduled service calls if the property owner
          or an authorized representative fails to provide timely access to the garage on the scheduled service date.
        </p>

        {/* 6. Payment Terms, Liability & Legal Fees */}
        <p className="text-gray-700 mb-4">
          <strong>6. Payment Terms, Liability &amp; Legal Fees.</strong> Full payment will be due within 24 hours of completion of the standard
          installation of the quoted product/services. You agree to pay the full amount as specified. Failure to pay or complete
          arrangement for the product/services may result in Canstar Light exercising its legal remedies.
        </p>
        <p className="text-gray-700 mb-4">
          You agree to release Canstar Light from any liability for damages to you, your agents, or guests occurring in connection
          with the installation of the product/service, unless Canstar Light is found to be grossly negligent.
        </p>
        <p className="text-gray-700 mb-8">
          If any party breaches or defaults on its obligations under this agreement, and it becomes necessary for a party to employ
          an attorney to enforce or defend its rights or remedies, the non-prevailing party shall pay the prevailing party's reasonable
          attorney's fees and court costs, if any, regardless of whether a lawsuit is filed. A plaintiff is considered the prevailing party
          if they succeed on the merits of their claims, while a defendant is considered the prevailing party if they defeat the claims
          or succeed on any affirmative claims against the plaintiff. A defendant must file affirmative claims against the plaintiff to be
          considered the prevailing party for the purpose of this provision.
        </p>

        {/* Warranty Section */}
        <h2 className="text-[#c0392b] font-semibold text-lg mb-2">
          Canstar Light Ltd. Warranty Information
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>Scope of Warranty:</strong> Canstar Light Ltd. promises that all custom lighting systems set up by our certified team will operate
          according to your approved project specifications and remain free of structural and functional defects. Should any
          component fall short of these benchmarks, we will repair or replace the affected items under the provisions outlined
          below.
        </p>

        {/* Warranty Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300 text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-bold">COMPONENT</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-bold">WARRANTY DURATION</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-bold">COVERAGE DETAILS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">LED Light Protection</td>
                <td className="border border-gray-300 px-4 py-3"><strong>Limited Lifetime</strong> (20 Years / 50,000 Hours)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <strong>Limited Lifetime</strong> warranty on LED Lights/Diodes based on manufacturer's testing (~7 hrs/day = estimated 20-year lifespan).
                  Valid for 20 years or 50,000 hours of use, whichever comes first.
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Mounting Tracks</td>
                <td className="border border-gray-300 px-4 py-3"><strong>12 Years</strong></td>
                <td className="border border-gray-300 px-4 py-3"><strong>12 years</strong> from the date of installation.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Power Supply &amp; Controller</td>
                <td className="border border-gray-300 px-4 py-3"><strong>10 Years</strong></td>
                <td className="border border-gray-300 px-4 py-3"><strong>10 years</strong> from the date of installation.</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Labor</td>
                <td className="border border-gray-300 px-4 py-3"><strong>4 Years</strong></td>
                <td className="border border-gray-300 px-4 py-3">
                  Full <strong>4-year</strong> warranty covering all on-site technician service, diagnostics, repair work, and necessary access equipment.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Qualification Guidelines */}
        <p className="text-gray-700 mb-4">
          <strong>Qualification Guidelines:</strong> Warranty applies strictly to setups performed directly by certified/approved Canstar Light Ltd.
          installers. Any alterations, repairs, or additions executed by third parties or unapproved individuals immediately nullify/
          void the warranty.
        </p>

        {/* Warranty Transfer to New Property Owners */}
        <p className="text-gray-700 mb-2">
          <strong>Warranty Transfer to New Property Owners:</strong> Only Installed Parts warranty is transferable once to a new homeowner.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
          <li>
            <strong>Process:</strong> The new property owner must file a transfer request with Canstar Light Ltd. within 90 days of closing.
          </li>
          <li>
            <strong>Term Limits:</strong> If approved, the new homeowner receives the remaining balance of the initial hardware term, capped at
            a maximum of one year, provided that at least one year remained at the time of transfer. If less than one year remains
            on the original term, the remaining balance carries over as is.
          </li>
        </ul>

        {/* Warranty Claim */}
        <p className="text-gray-700 mb-2">
          <strong>Warranty Claim:</strong> To request service under this coverage:
        </p>
        <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-1 ml-4">
          <li>Contact Canstar Light Ltd. in writing within 15 days of noticing an operational fault.</li>
          <li>Submit visual documentation (photographs or video clips) clearly showing the issue.</li>
          <li>Grant our technical team reasonable property access to inspect the system and review original service records.</li>
        </ol>

        {/* Replacement Part Protection */}
        <p className="text-gray-700 mb-4">
          <strong>Replacement Part Protection:</strong> Serviced or replacement hardware remains protected for the balance of the initial
          coverage period, up to a hard limit of 10 years from the original setup date.
        </p>

        {/* Exclusions & Voids */}
        <p className="text-gray-700 mb-2">
          <strong>Exclusions &amp; Voids:</strong> Coverage will be forfeited if failure stems from:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2 ml-4">
          <li>
            <strong>External Forces:</strong> Accidental impacts, nearby construction/renovation activities, act of God events (lightning, extreme
            storms, fires, etc.), pest intrusions, or environmental degradation (mold, industrial pollutants, etc.).
          </li>
          <li>
            <strong>Operational &amp; Network Interruptions:</strong> Loss of smart control function resulting from home network/Wi-Fi edits, Wi-Fi
            device &amp; coverage issues, router updates, changed passwords, or internet provider changes.
          </li>
          <li>
            <strong>Misuse &amp; Tampering:</strong> Vandalism, deliberate abuse, intentional overload, or unapproved system modifications.
          </li>
        </ul>

        {/* Liability Limits */}
        <p className="text-gray-700 mb-4">
          <strong>Liability Limits:</strong> Canstar Light Ltd.'s financial obligation is strictly capped at the purchase price of the defective
          hardware. We accept no responsibility for indirect losses, operational downtime, incidental costs, or lost business
          revenue. Any unverified third-party repair attempts render this entire agreement void.
        </p>

        <p className="text-gray-700 italic mb-2">
          This document outlines specific service rights. Additional statutory rights may apply depending on your regional
          jurisdiction.
        </p>
      </div>
    </div>
  );
};

export default NewTermsAndConditions;
