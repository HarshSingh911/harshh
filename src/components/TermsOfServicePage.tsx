import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Shield,
  HelpCircle,
  ExternalLink,
  Scale,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Plane,
  CreditCard,
  RotateCcw,
  Sparkles,
  Users,
  Eye,
  Info,
} from 'lucide-react';
import { TripYeahLogo } from './TripYeahLogo';
import { AppPageView } from './Navbar';

export interface TermsOfServicePageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: AppPageView) => void;
  onOpenSupport?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({
  onBackToHome,
  onNavigatePage,
  onOpenSupport,
  onOpenPrivacyPolicy,
}) => {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
          TOP BREADCRUMB & UTILITY HEADER
      ========================================================================= */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Return to TripYehh Home"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Home</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <TripYeahLogo isDarkHeader={false} className="h-6 w-auto" />
              <span className="text-xs text-slate-400 font-medium hidden md:inline">/</span>
              <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                Legal &amp; Compliance Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigatePage('privacy-policy')}
              className="text-slate-600 hover:text-blue-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigatePage('support')}
              className="text-slate-600 hover:text-blue-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Customer Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO BANNER: CORPORATE TRAVEL THEME
      ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Background Ambient Glow & Architectural Texture */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-3.5">
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-semibold backdrop-blur-xs">
              <Scale className="w-3.5 h-3.5 text-sky-400" />
              <span>Standard User Terms &amp; Conditions of Travel Facilitation</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Terms of Service
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Please review these terms before using TripYehh.
            </p>

            {/* Document Metadata Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Last Updated: October 19, 2026</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Entity: [TripYehh Technologies Private Limited]</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Jurisdiction: [New Delhi / Haryana, India]</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN LAYOUT: COMPLETE DETAILED TERMS OF SERVICE CONTENT
      ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <main className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 md:p-12 shadow-sm space-y-12">
            
            {/* Legal Notice Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Binding Legal Agreement</span>
              </div>
              <p className="leading-relaxed">
                These Terms of Service (“<strong>Terms</strong>”) constitute a legally binding contract between you (“<strong>User</strong>”, “<strong>Traveller</strong>” or “<strong>you</strong>”) and <strong>[TripYehh Technologies Private Limited]</strong> (“<strong>TripYehh</strong>”, “<strong>we</strong>”, “<strong>our</strong>” or “<strong>us</strong>”), governing your access to and use of the TripYehh website, mobile-responsive web platform, customer support concierge, and travel booking facilitation services.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium font-mono text-[11px]">
                  [Note for Legal Review: Verify Registered Corporate Entity &amp; CIN prior to final execution]
                </span>
              </div>
            </div>

            {/* SECTION 1 */}
            <section id="sec-1" className="scroll-mt-24 space-y-3.5 pt-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  01
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  1. Applicability and Agreement
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>1.1 Scope of Terms:</strong> These Terms govern all interactions with TripYehh, including browsing destination guides, utilizing artificial intelligence travel planners, querying fare availability, submitting booking requests, processing payments, and managing confirmed reservations for domestic and international travel services.
                </p>
                <p>
                  <strong>1.2 Deemed Acceptance:</strong> By accessing, browsing, creating an account, or completing a transaction on TripYehh, you acknowledge that you have read, understood, and agreed to be bound by these Terms, together with our{' '}
                  <button
                    type="button"
                    onClick={() => onNavigatePage('privacy-policy')}
                    className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    Privacy Policy
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  , and any additional service-specific terms published at the time of reservation.
                </p>
                <p>
                  <strong>1.3 Conflict of Terms:</strong> In the event of any specific inconsistency between these general Terms and the specific tariff rules, fare conditions, or contract of carriage imposed by an airline, hotel, Indian Railways (IRCTC), bus operator, or other third-party provider, the specific third-party provider’s fare and carriage rules shall prevail with respect to that particular service.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 2 */}
            <section id="sec-2" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  02
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  2. Eligibility to Use
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>2.1 Legal Capacity:</strong> To use TripYehh and execute enforceable travel contracts, you must be at least 18 years of age and possess the legal capacity to enter into binding agreements under the Indian Contract Act, 1872 or the applicable laws of your jurisdiction.
                </p>
                <p>
                  <strong>2.2 Minors:</strong> Persons under 18 years of age (“<strong>Minors</strong>”) may only utilize TripYehh under the active supervision and with the explicit consent of a parent or legal guardian. Any reservation containing a minor traveller must have an accompanying adult traveller where required by the applicable airline, hotel, or transport operator guidelines.
                </p>
                <p>
                  <strong>2.3 Truthful Representations:</strong> You warrant that all information supplied by you on TripYehh—including legal passenger names matching official government photo identification, dates of birth, passport credentials, contact phone numbers, and billing details—is accurate, current, and complete.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 3 */}
            <section id="sec-3" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  03
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  3. Account Registration and Security
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>3.1 Account Creation:</strong> While certain search and exploratory features may be browsed without logging in, booking travel, tracking refunds, downloading boarding vouchers, and earning TripPoints rewards requires account registration via verified mobile phone number (OTP) or email authentication.
                </p>
                <p>
                  <strong>3.2 Credential Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your login credentials, OTPs, and password. You agree not to disclose your security credentials to any third party. Any booking, payment authorization, or date modification executed through your logged-in account shall be deemed authorized by you.
                </p>
                <p>
                  <strong>3.3 Reporting Breach:</strong> If you suspect or discover unauthorized access to your account or any breach of security, you must immediately notify TripYehh Customer Support at{' '}
                  <span className="font-mono text-blue-600 font-semibold">[support@tripyeah.com]</span>. TripYehh shall not be liable for losses caused by unauthorized use of your account prior to receiving written notice.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 4 */}
            <section id="sec-4" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  04
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  4. Permitted Website Use
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>4.1 Permitted Purpose:</strong> You are granted a limited, personal, non-exclusive, non-transferable license to access TripYehh solely to evaluate legitimate travel options, make genuine reservations, review itineraries, and communicate with our customer support teams.
                </p>
                <p>
                  <strong>4.2 Prohibited Activities:</strong> In accessing or using TripYehh, you agree that you shall NOT:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li>Use automated software, bots, scrapers, spiders, or crawlers to extract inventory, fares, hotel rates, or travel content without our prior written consent;</li>
                  <li>Perform stress tests, denial of service (DoS) attacks, or inject malicious code, trojans, or corrupt data intended to disrupt website availability;</li>
                  <li>Make speculative, false, or fraudulent reservations in anticipation of demand or for unauthorized resale;</li>
                  <li>Frame, mirror, or reverse engineer any part of the TripYehh interface, proprietary booking engines, or backend APIs;</li>
                  <li>Bypass or circumvent authentication tokens, CAPTCHA mechanisms, or security boundaries.</li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 5 */}
            <section id="sec-5" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  05
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  5. Travel Search and Booking Services
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>5.1 Operational Service Categories:</strong> TripYehh currently provides real-time search, comparison, and booking facilitation for the following travel verticals based on live inventory availability:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Domestic &amp; International Flights:</strong> Scheduled carrier flights with live fare classes, baggage allowances, and seat maps;</li>
                  <li><strong>Hotels, Resorts &amp; Homestays:</strong> Verified accommodations with room categories, cancellation terms, and meal plans;</li>
                  <li><strong>Indian Railways (IRCTC-Integrated Trains):</strong> PNR generation, berth preferences, and real-time charting status;</li>
                  <li><strong>Intercity Buses &amp; Airport Cabs:</strong> Scheduled coach lines, seat selection, and verified chauffeur airport transfers;</li>
                  <li><strong>Curated Holiday Packages:</strong> Bundled itineraries combining accommodations, local activities, and transfers;</li>
                  <li><strong>International Travel Planner (“Go Global”):</strong> Destination guides, daily smart itineraries, visa checklists, and budget estimators.</li>
                </ul>
                <p>
                  <strong>5.2 Representations Regarding Unlaunched Modules:</strong> Certain services, including ocean cruises, chartered flights, and third-party travel insurance underwriting, may be displayed as conceptual previews or planned modules. TripYehh does not warrant immediate live execution for any module explicitly designated as coming soon or in beta testing.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 6 */}
            <section id="sec-6" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  06
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  6. Role of TripYehh and Third-Party Providers
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>6.1 Facilitator &amp; Intermediary Role:</strong> Unless explicitly stated otherwise, TripYehh acts solely as an online travel marketplace, facilitator, and booking intermediary under Section 79 of the Information Technology Act, 2000. TripYehh does not own, manage, or operate aircraft, railway rakes, hotels, buses, or vehicle fleets.
                </p>
                <p>
                  <strong>6.2 Direct Service Contract:</strong> When you complete a booking through TripYehh, the contract for actual travel service delivery (such as safe flight carriage, room cleanliness, hotel hospitality, train departure, or bus transport) is created directly between you and the respective Third-Party Service Provider (e.g., IndiGo, Air India, Indian Railways / IRCTC, Taj Hotels, Marriot, ZingBus, etc.).
                </p>
                <p>
                  <strong>6.3 Provider Terms:</strong> You agree to abide by the terms and conditions of carriage, occupancy, and check-in established by any Third-Party Service Provider with whom you elect to contract, including payment of all amounts when due and compliance with the provider’s rules regarding fares, baggage, and safety.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 7 */}
            <section id="sec-7" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  07
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  7. Prices, Fees, Taxes and Payments
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>7.1 Transparent Price Breakdown:</strong> The total price displayed to you prior to final payment authorization includes the provider’s base fare, applicable fuel surcharges, statutory government taxes (including GST where applicable), and TripYehh’s convenience or platform facilitation fee. No hidden fees are added after payment confirmation.
                </p>
                <p>
                  <strong>7.2 Supported Currencies:</strong> Fares are denominated in Indian Rupees (INR) by default, but may be converted into major international currencies (USD, EUR, GBP, AED, SGD) using current reference exchange rates. The final charge processed on your credit card or payment method will be clearly disclosed at checkout.
                </p>
                <p>
                  <strong>7.3 Verified Payment Methods:</strong> TripYehh accepts payments only through authenticated PCI-DSS certified payment gateways supporting Instant UPI (Google Pay, PhonePe, Paytm, BHIM), major Credit and Debit Cards (Visa, Mastercard, RuPay, American Express), authorized Net Banking across 50+ Indian commercial banks, and accumulated TripPoints reward balances. We never request cash payments or offline bank transfers.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 8 */}
            <section id="sec-8" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  08
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  8. Booking Confirmation and Changes
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>8.1 Issuance of Confirmation:</strong> A booking request is deemed confirmed only when TripYehh issues a verified Booking Confirmation displaying an official Airline PNR, Hotel Reservation Number, or Railway 10-digit PNR, accompanied by a digital receipt sent to your registered email and accessible under “My Trips”.
                </p>
                <p>
                  <strong>8.2 Inventory Latency &amp; Failures:</strong> In rare circumstances where a provider’s inventory sells out or changes price between your search and the bank’s payment gateway response, TripYehh will not confirm the booking. In such events, our system will either prompt you with an updated fare alternative or automatically initiate a 100% full refund to your source payment account.
                </p>
                <p>
                  <strong>8.3 Name Rectification:</strong> Passenger names must match the government-issued photo ID exactly. Airlines and railways impose strict penalties or refuse boarding for misspelled names. Any name change request is subject entirely to the carrier’s name correction policy and administrative fees.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 9 */}
            <section id="sec-9" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  09
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  9. Cancellation, Refunds and Rescheduling
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>9.1 Cancellation Policies:</strong> Every airline fare, hotel room, and train ticket is subject to specific cancellation rules set by the underlying provider. Non-refundable promotional fares do not yield refunds upon passenger cancellation, except for refundable statutory airport taxes where mandated by the Directorate General of Civil Aviation (DGCA).
                </p>
                <p>
                  <strong>9.2 Refund Processing Flow:</strong> Upon receiving a cancellation request via “My Trips”, TripYehh immediately submits the cancellation to the airline, hotel, or railway. Once the refund amount is cleared by the carrier, TripYehh credits the net eligible refund (deducting carrier penalties and disclosed platform facilitation fees) back to your original payment method.
                </p>
                <p>
                  <strong>9.3 Realistic Settlement Timelines:</strong> Refund timelines depend on bank settlement protocols and provider audits:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>UPI / Instant Wallets:</strong> Typically credited within 24 to 48 banking hours of carrier approval;</li>
                  <li><strong>Credit / Debit Cards &amp; Net Banking:</strong> Typically reflected in 3 to 7 business days, subject to your issuing bank’s billing cycle;</li>
                  <li><strong>Train TDR (Ticket Deposit Receipt):</strong> Processed per Indian Railways rules, which may require 30 to 90 days for railway audit clearance.</li>
                </ul>
                <p className="text-xs text-slate-500 italic">
                  *TripYehh does not hold your funds and makes no false guarantee of instantaneous clearing if the third-party carrier has delayed disbursement.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 10 */}
            <section id="sec-10" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  10
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  10. Flights, Hotels and Transport-Specific Terms
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>10.1 Air Travel Terms:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Airport Check-in:</strong> Passengers must report at airport counters at least 2 hours before scheduled domestic departure and 3 to 4 hours before international departure;</li>
                  <li><strong>Mandatory Web Check-in:</strong> Many carriers mandate online check-in prior to arrival at the terminal. Boarding passes must be presented in digital or print format;</li>
                  <li><strong>Baggage Allowances:</strong> Checked and cabin baggage dimensions and weight limits vary by airline and fare class. Excess baggage fees are levied directly by the carrier at the terminal.</li>
                </ul>
                <p>
                  <strong>10.2 Hotel &amp; Homestay Terms:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Check-in Times:</strong> Standard hotel check-in time across India is typically 02:00 PM and check-out is 11:00 AM. Early check-in is subject to property availability and may incur surcharges;</li>
                  <li><strong>Identification:</strong> Primary guests must be at least 18 years old and carry valid government-issued photo ID (Aadhaar, Passport, Driving License, Voter Card). Indian hotels do not accept PAN cards as valid address proof;</li>
                  <li><strong>Couple Policies:</strong> Certain hotels enforce local resident or marital proof restrictions per their property policy. Please review specific hotel rules prior to reservation.</li>
                </ul>
                <p>
                  <strong>10.3 Trains, Buses &amp; Cabs:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Indian Railways:</strong> IRCTC service charges, Tatkal rules, waitlist charting cancellations, and coach berths are governed strictly by Ministry of Railways guidelines;</li>
                  <li><strong>Buses &amp; Cabs:</strong> Boarding points, pickup delays due to traffic, and luggage dimensions are subject to operator conditions. Passengers must be at the pickup location 15 minutes before scheduled departure.</li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 11 */}
            <section id="sec-11" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  11
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  11. International Travel, Visas and Documents
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>11.1 Sole Traveller Responsibility:</strong> For all international journeys, it is the sole and exclusive responsibility of the traveller to ensure possession of:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>A valid passport with at least six (6) months validity remaining beyond the intended date of return and sufficient blank visa pages;</li>
                  <li>Valid transit, tourist, or business visas, electronic visas (eVisa), or official Visa on Arrival confirmations;</li>
                  <li>Mandatory health, vaccination (e.g. Yellow Fever), customs QR codes, or travel medical insurance certificates mandated by destination countries.</li>
                </ul>
                <p>
                  <strong>11.2 Informational Nature of Planning Tools:</strong> TripYehh’s “Go Global” international itinerary planner, visa checklists, and budget calculators provide general informational assistance compiled from public embassy guidelines. <strong>TripYehh does not issue visas and cannot guarantee visa grant, transit clearance, or airport entry permission</strong>, which remain under the sovereign discretion of respective immigration and border authorities.
                </p>
                <p>
                  <strong>11.3 Denied Boarding:</strong> If an airline or border authority denies boarding or deportation occurs due to deficient documentation, invalid visas, or expired passports, TripYehh shall bear no financial liability, and standard airline no-show cancellation penalties will apply.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 12 */}
            <section id="sec-12" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  12
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  12. Offers, Discounts and Promotions
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>12.1 Promotional Terms:</strong> Promotional coupon codes (e.g., <code>FLYFIRST</code>, <code>STAYDELUXE</code>), special cardholder discounts, and seasonal offers are subject to specific eligibility parameters, minimum spend requirements, validity windows, and quota caps displayed on the Offer Details modal.
                </p>
                <p>
                  <strong>12.2 Single Offer Discipline:</strong> Unless expressly stated otherwise, only one promo code or promotional concession may be applied per reservation. Coupons cannot be stacked, encashed, transferred to other accounts, or applied retroactively to completed bookings.
                </p>
                <p>
                  <strong>12.3 Abuse &amp; Revocation:</strong> TripYehh reserves the right to cancel bookings or reverse discounts if an offer has been obtained through technical glitch, fraudulent account creation, credit card abuse, or violation of published promo guidelines.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 13 */}
            <section id="sec-13" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  13
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  13. User Content and Influencer Features
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>13.1 Planned Creator Club:</strong> TripYehh has introduced conceptual previews of an upcoming “Influencers &amp; Creators Club” feature designed to celebrate authentic traveller itineraries, travel photography, and destination vlogs.
                </p>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>Notice of Future Terms:</strong> Detailed creator agreements, affiliate revenue sharing terms, and creator verification guidelines will be published separately upon the formal commercial launch of this module.
                </div>
                <p>
                  <strong>13.2 License to User Submissions:</strong> Where users submit hotel reviews, ratings, travel feedback, or photos to TripYehh, you grant TripYehh a non-exclusive, royalty-free, perpetual, worldwide license to display, adapt, and publish such content for promotional, analytical, and operational purposes across our platforms.
                </p>
                <p>
                  <strong>13.3 Content Standards:</strong> You warrant that all reviews and uploaded content represent genuine personal travel experiences and do not contain defamatory, vulgar, sexually explicit, abusive, or copyright-infringing material. TripYehh reserves full moderation rights to remove any content violating community standards.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 14 */}
            <section id="sec-14" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  14
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  14. Intellectual Property
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>14.1 Proprietary Assets:</strong> All trademarks, service marks, trade names, wordmarks (including “TripYehh”, “TripYeah”, and the stylized luggage logo), user interface graphics, layout designs, software code, database structures, and editorial destination copy are the exclusive intellectual property of <strong>[TripYehh Technologies Private Limited]</strong> or its licensors.
                </p>
                <p>
                  <strong>14.2 Restrictions:</strong> You shall not copy, modify, distribute, publish, license, or create derivative works from any material obtained from TripYehh without our prior written authorization. Third-party trademarks (such as airline and hotel brand logos) remain the property of their respective owners and are displayed purely for identification purposes.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 15 */}
            <section id="sec-15" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  15
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  15. Prohibited Conduct, Fraud and Security
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>15.1 Fraud Zero Tolerance:</strong> TripYehh enforces zero tolerance toward financial fraud, credit card skimming, identity theft, unauthorized chargeback threats, and fake booking reservations.
                </p>
                <p>
                  <strong>15.2 Anti-Impersonation:</strong> You shall not impersonate any person, airline representative, or TripYehh concierge executive, nor solicit sensitive OTPs or banking credentials from other users.
                </p>
                <p>
                  <strong>15.3 Legal Consequences:</strong> Any fraudulent activity will lead to immediate cancellation of all associated travel reservations without refund, forfeiture of TripPoints balances, account termination, and referral to cybercrime authorities and law enforcement agencies.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 16 */}
            <section id="sec-16" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  16
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  16. Service Availability and Technical Issues
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>16.1 System Uptime:</strong> TripYehh strives to provide reliable 24x7 service availability. However, operations may be temporarily interrupted for scheduled maintenance, hardware upgrades, telecommunications network outages, or unexpected third-party global distribution system (GDS) synchronization delays.
                </p>
                <p>
                  <strong>16.2 Force Majeure:</strong> TripYehh and its travel partners shall not be held liable for any failure or delay in flight operation, room availability, or booking processing caused by events beyond reasonable control, including natural disasters (acts of God), severe cyclones, volcanic ash clouds, dense fog delays, wars, riots, government border closures, health pandemics, or civil strikes.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 17 */}
            <section id="sec-17" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  17
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  17. Limitation of Liability
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>17.1 Statutory Protections Preserved:</strong> Nothing in these Terms shall limit or exclude any statutory consumer rights that cannot be lawfully limited or excluded under the Consumer Protection Act, 2019 or other applicable consumer welfare legislation in India.
                </p>
                <p>
                  <strong>17.2 Intermediary Limitation:</strong> Since TripYehh acts as a facilitator and does not control airline flight operations, train schedules, hotel room maintenance, or chauffeur conduct, TripYehh shall not be liable for personal injury, property loss, flight rescheduling delays, or emotional distress arising from acts, omissions, or breaches committed by third-party service providers.
                </p>
                <p>
                  <strong>17.3 Cap on Direct Liability:</strong> Subject to applicable law, the maximum aggregate liability of TripYehh for any direct, proven damages arising under or in connection with any specific booking facilitated through the website shall be strictly capped at the total convenience/platform fee earned by TripYehh on that specific booking, or the total amount received from you for that transaction.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 18 */}
            <section id="sec-18" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  18
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  18. Indemnification
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  You agree to defend, indemnify, and hold harmless TripYehh, its directors, officers, employees, and authorized agents from and against any third-party claims, liabilities, damages, losses, and reasonable legal expenses arising out of:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Your material breach of these Terms or applicable laws;</li>
                  <li>Your fraudulent, deceptive, or unlawful use of the website or payment facilities;</li>
                  <li>Inaccurate passenger or visa information provided during the checkout process;</li>
                  <li>Any violation by you of the rights of any third party, including copyright infringement in user reviews.</li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 19 */}
            <section id="sec-19" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  19
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  19. Suspension and Termination
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>19.1 Ground for Suspension:</strong> TripYehh may suspend or terminate your account access or cancel pending reservations if we have reasonable grounds to believe that you have engaged in payment fraud, abusive conduct toward support staff, automated web scraping, or material violation of these Terms.
                </p>
                <p>
                  <strong>19.2 Fair Notice &amp; Recourse:</strong> Where legally permissible and practically viable, TripYehh will provide written notice of suspension explaining the basis. Any legitimate, fully paid confirmed bookings not connected to the fraudulent activity will be handled fairly in accordance with carrier rules.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 20 */}
            <section id="sec-20" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  20
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  20. Third-Party Links and Services
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  TripYehh may contain links or redirects to external websites operated by airlines, hotel chains, government visa portals, travel insurance underwriters, and payment gateways. Such links are provided solely for your convenience. TripYehh does not control external websites and is not responsible for their privacy standards, server uptime, or contractual terms.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 21 */}
            <section id="sec-21" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  21
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  21. Privacy and Personal Information
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>21.1 Dedicated Privacy Policy:</strong> Our collection, processing, storage, and sharing of personal data (including passenger names, contact numbers, government ID documents, and payment tokens) is governed comprehensively by our dedicated{' '}
                  <button
                    type="button"
                    onClick={() => onNavigatePage('privacy-policy')}
                    className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    TripYehh Privacy Policy
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  .
                </p>
                <p>
                  <strong>21.2 Distinction of Purposes:</strong> While these Terms of Service govern the contractual obligations of travel search, reservation execution, and payment handling, our Privacy Policy outlines data protection rights, cookie consent, and compliance under India’s Digital Personal Data Protection Act, 2023 (DPDPA).
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 22 */}
            <section id="sec-22" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  22
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  22. Complaints and Customer Support
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 pl-0 sm:pl-9.5">
                <p>
                  We are committed to resolving booking issues, refund inquiries, and travel grievances swiftly and transparently.
                </p>

                {/* Verified Support Channels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                      Customer Support Concierge
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      TripYehh 24x7 Help Desk
                    </p>
                    <p className="text-xs text-slate-600">
                      Toll-Free Helpline: <span className="font-mono font-semibold text-slate-900">[1800-120-7433]</span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Email: <span className="font-mono text-blue-600">[support@tripyeah.com]</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                      Grievance Officer (IT Rules, 2021)
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      [Designated Grievance Officer]
                    </p>
                    <p className="text-xs text-slate-600">
                      Email: <span className="font-mono text-blue-600">[grievance-officer@tripyeah.com]</span>
                    </p>
                    <p className="text-xs text-slate-600">
                      Response: Within 48 hours acknowledgement
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong>Registered Office Address:</strong> [Legal Department, TripYehh Technologies Private Limited, Registered Address Line 1, Cyber City, Gurugram, Haryana – 122002, India].
                  <span className="block mt-1 text-[11px] text-amber-700 font-medium">
                    [Placeholder Notice: Final registered address to be confirmed with corporate records prior to public filing]
                  </span>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 23 */}
            <section id="sec-23" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  23
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  23. Governing Law and Dispute Resolution
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>23.1 Applicable Law:</strong> These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the Republic of India, without giving effect to conflict of laws principles.
                </p>
                <p>
                  <strong>23.2 Pre-Dispute Informal Resolution:</strong> Before initiating any legal proceedings, the parties agree to make good-faith efforts to resolve any dispute through amicable discussions for a period of thirty (30) days from the date of written notice delivered to the Grievance Officer.
                </p>
                <p>
                  <strong>23.3 Jurisdiction Placeholder:</strong> Subject to the statutory dispute resolution rights guaranteed under the Consumer Protection Act, 2019, any legal suit, action, or proceeding arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts situated at{' '}
                  <span className="font-semibold text-slate-900">[New Delhi / Gurugram, India]</span>.
                  <span className="block text-xs text-amber-700 mt-1">
                    [Placeholder Notice: Retained for final legal review by corporate legal counsel]
                  </span>
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 24 */}
            <section id="sec-24" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  24
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  24. Changes to These Terms
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>24.1 Periodic Revisions:</strong> TripYehh reserves the right to amend, update, or replace these Terms from time to time to reflect changes in regulatory requirements, technical advancements, carrier policies, or new feature additions.
                </p>
                <p>
                  <strong>24.2 Notice of Material Modifications:</strong> The “Last Updated” date at the top of this document will always indicate the effective date of the latest version. For material changes that significantly affect your rights or booking obligations, we will provide prominent notice on our website homepage or via registered email communication.
                </p>
                <p>
                  <strong>24.3 Continued Acceptance:</strong> Your continued access to or use of TripYehh following the posting of updated Terms constitutes your binding agreement to such revisions.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* SECTION 25 */}
            <section id="sec-25" className="scroll-mt-24 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  25
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  25. General Provisions
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pl-0 sm:pl-9.5">
                <p>
                  <strong>25.1 Severability:</strong> If any provision of these Terms is determined by a court of competent jurisdiction to be invalid, illegal, or unenforceable, such provision shall be enforced to the maximum extent permissible, and the remaining provisions shall continue in full legal force and effect.
                </p>
                <p>
                  <strong>25.2 Entire Agreement:</strong> These Terms, together with the Privacy Policy, the specific fare and booking voucher terms, and any applicable promotional terms, constitute the entire agreement between you and TripYehh with respect to your use of the platform.
                </p>
                <p>
                  <strong>25.3 Waiver:</strong> No failure or delay by TripYehh in exercising any right, power, or remedy under these Terms shall operate as a waiver thereof, nor shall any single or partial exercise preclude any further exercise of any right.
                </p>
                <p>
                  <strong>25.4 Electronic Records:</strong> This document is an electronic record published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021, and does not require any physical or digital signatures.
                </p>
              </div>
            </section>

            {/* Bottom Quick Links to Privacy, Support, and Home */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigatePage('privacy-policy')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onNavigatePage('support')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Customer Support
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  TripYehh Home
                </button>
              </div>

              <button
                type="button"
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Back to Top</span>
              </button>
            </div>
          </main>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center justify-center border border-white/20 active:scale-95"
          title="Scroll Back to Top"
          aria-label="Scroll Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
