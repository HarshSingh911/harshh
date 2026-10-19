import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { TripYeahLogo } from './TripYeahLogo';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onOpenSupport?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onBackToHome,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Top Breadcrumb & Action Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <TripYeahLogo className="scale-75 origin-left" />
              <span className="text-xs text-slate-400 font-medium hidden md:inline">/</span>
              <span className="text-xs font-semibold text-slate-700 hidden md:inline">
                Legal &amp; Privacy Center
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Header with Modern Corporate Background Image */}
      <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-white">
        {/* Corporate Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
            alt="Corporate Business Architecture"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-900/85 to-blue-950/80 backdrop-blur-[1px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            TripYeah Privacy Policy
          </h1>
        </div>
      </section>

      {/* Main Content Layout (Clean, Single Column Document) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <main className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-12 shadow-sm space-y-10">
          {/* 1. Introduction */}
          <section id="sec-1" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">1. Introduction</h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYeah (“TripYehh”, “we”, “our” or “us”) respects your privacy and is committed
                to handling your personal information responsibly.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, share and protect
                information when you visit our website, use our services, create an account, search
                for travel options, interact with maps or use other features made available by
                TripYehh.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <p>
                  TripYehh is operated by{' '}
                  <strong className="text-slate-900 font-semibold">
                    TripYeah Technologies Private Limited
                  </strong>{' '}
                  (Registered in India / Haryana). Our contact details are provided at the end of
                  this Policy.
                </p>
              </div>
              <p>
                By using TripYehh, you acknowledge that you have read this Policy. Where consent is
                legally required, we will request it separately.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 2. Information We May Collect */}
          <section id="sec-2" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              2. Information We May Collect
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Depending on the features you use, TripYehh may collect the following categories of
              information:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  A. Account information
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>Name, email address and phone number, if provided.</li>
                  <li>
                    Login credentials or authentication information handled by our authentication
                    provider.
                  </li>
                  <li>Profile details and account preferences you choose to provide.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  B. Travel search and booking information
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>
                    Origin, destination, travel dates, passenger or guest details and other search
                    preferences.
                  </li>
                  <li>
                    Booking references, itinerary details and transaction status, where applicable.
                  </li>
                  <li>
                    Information needed to help with booking support, changes or cancellations.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  C. Payment-related information
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>
                    Payment status, transaction reference, amount and limited payment-related details
                    supplied by our payment or booking partners.
                  </li>
                  <li>
                    Payment card, bank or other sensitive payment information may be handled directly
                    by the relevant payment provider. We will describe our actual payment
                    arrangements accurately and will not claim that TripYehh never handles such data
                    unless verified.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  D. Location information
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>Location or destination information you enter into the search form.</li>
                  <li>
                    If enabled and permitted by your device or browser, approximate or precise
                    location information for map-related or nearby-place features.
                  </li>
                  <li>
                    You can manage device/browser location permissions through your device or browser
                    settings. Some features may not work without location access.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  E. Technical and usage information
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>
                    Device, browser, IP address, language, timestamps, pages viewed, interactions and
                    diagnostic logs, to the extent collected by our systems or service providers.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  F. Content you submit
                </h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  <li>
                    Messages, feedback, support requests, reviews, photographs, videos or profile
                    information that you choose to submit, where the relevant feature is available.
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic mt-2">
              We collect only the information reasonably needed for the relevant purpose, subject to
              applicable law and the actual features you use.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 3. How We Use Information */}
          <section id="sec-3" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              3. How We Use Information
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-2.5">
              <p>TripYehh may use personal information to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Create, authenticate and manage user accounts.</li>
                <li>Provide travel search, itinerary, booking and related services.</li>
                <li>
                  Send booking confirmations, important service notifications and account-related
                  messages.
                </li>
                <li>Process or coordinate transactions through relevant partners.</li>
                <li>Display maps, destinations and location-related results.</li>
                <li>Respond to support requests, troubleshoot errors and improve usability.</li>
                <li>Detect fraud, abuse, security incidents and unauthorised activity.</li>
                <li>Meet applicable legal, accounting and regulatory obligations.</li>
                <li>
                  Send promotional communications where permitted and provide a way to opt out
                  where required.
                </li>
              </ul>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 mt-2">
                We will not use personal information for a materially different purpose without the
                notice or consent required by applicable law.
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 4. Travel Bookings and Third-Party Partners */}
          <section id="sec-4" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              4. Travel Bookings and Third-Party Partners
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYehh may work with travel providers, booking platforms, payment providers, map
                services and other service partners to provide relevant features.
              </p>
              <p>
                When you select a travel option or proceed with a booking, the relevant partner may
                receive information needed to fulfil your request. The partner may process that
                information under its own privacy policy and terms.
              </p>
              <p>
                Before completing a booking or payment, review the relevant provider's terms,
                cancellation conditions and privacy information. Availability, pricing, refunds and
                booking fulfilment may be controlled by the relevant provider.
              </p>
              <p>
                TripYehh will identify relevant partners and explain their roles where required by law
                and where applicable to the service.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 5. Payments */}
          <section id="sec-5" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">5. Payments</h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                Payments may be processed by third-party payment or booking partners. Depending on the
                integration, TripYehh may receive transaction references, payment status, amounts,
                receipts or other limited transaction details.
              </p>
              <p>
                The payment partner's own terms and privacy policy may apply to information collected
                directly by that partner. TripYehh's actual role in payment processing will depend on
                the specific integration.
              </p>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 font-medium flex items-start gap-3">
                <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Security Reminder:</strong> Do not share passwords, OTPs, card PINs or other
                  confidential payment credentials with anyone claiming to represent TripYehh.
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 6. Maps and Location Services */}
          <section id="sec-6" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              6. Maps and Location Services
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYehh may use Google Maps Platform or other mapping services to display maps,
                destinations, directions or location-based results.
              </p>
              <p>
                If a feature requests access to your device location, your browser or device may ask
                for permission. You can deny or revoke that permission in your device or browser
                settings. You may still be able to use features that rely only on destinations you
                enter manually.
              </p>
              <p>
                Mapping providers may process technical, search or location-related information
                according to their own terms and privacy policies. The precise data exchanged depends
                on the APIs and configuration enabled in TripYehh.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 7. Influencer and Creator Features */}
          <section id="sec-7" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              7. Influencer and Creator Features
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYehh may introduce an Influencer or Creator section in the future. If and when
                these features become available, users may be able to create profiles and share
                travel-related photographs, videos or other content.
              </p>
              <p>
                Before launch, TripYeh will publish or update the applicable terms and privacy
                disclosures covering public profiles, uploaded content, visibility settings,
                interactions, reporting and moderation.
              </p>
              <p className="text-xs text-slate-500 italic">
                Until those features are launched, this section describes planned functionality and
                does not promise that creator uploads or related features are currently available.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 8. Cookies, Analytics and Similar Technologies */}
          <section id="sec-8" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              8. Cookies, Analytics and Similar Technologies
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYeah and its service providers may use cookies, local storage, analytics tools or
                similar technologies where these are actually implemented.
              </p>
              <p>
                These technologies may support login sessions, remember preferences, maintain
                security, measure performance and understand usage. Where required, TripYeah will
                provide appropriate notices and obtain consent before using non-essential
                technologies.
              </p>
              <p>
                You can manage cookies through your browser settings. Blocking certain cookies may
                affect some website functions.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 9. How We Share Information */}
          <section id="sec-9" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              9. How We Share Information
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>We may share relevant information with:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>
                  Travel, accommodation, transport and booking partners when needed to fulfil your
                  request.
                </li>
                <li>Payment providers to facilitate or verify transactions.</li>
                <li>
                  Hosting, database, authentication, security, analytics and technical service
                  providers that support TripYeah.
                </li>
                <li>Mapping providers when map or location features are used.</li>
                <li>
                  Professional advisers, regulators, law-enforcement authorities or other parties
                  where legally required or permitted.
                </li>
                <li>
                  A successor or acquiring entity in connection with a lawful merger, restructuring
                  or business transfer, subject to applicable requirements.
                </li>
              </ul>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                We do not state that information is never shared with third parties; sharing may be
                necessary to deliver requested services. We will not sell personal information except
                to the extent such activity is lawful, accurately disclosed and expressly part of our
                actual practices.
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 10. Data Storage, Security and Retention */}
          <section id="sec-10" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              10. Data Storage, Security and Retention
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYeah uses appropriate technical and organisational measures designed to protect
                personal information against unauthorised access, loss, misuse or alteration.
              </p>
              <p>
                No internet service can guarantee absolute security. Access should be limited to
                authorised personnel and service providers who need the information for legitimate
                purposes.
              </p>
              <p>
                We retain personal information only for as long as reasonably necessary for the
                purposes described in this Policy, including providing services, resolving disputes,
                maintaining required records and complying with applicable law. Retention periods may
                vary by data type and legal obligations.
              </p>
              <p className="text-xs text-slate-500 italic">
                Actual security controls, storage locations and retention periods depend on
                TripYeah's implemented systems and must be verified before publication.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 11. Your Privacy Rights and Choices */}
          <section id="sec-11" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              11. Your Privacy Rights and Choices
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>Subject to applicable law, you may have rights to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>Request access to personal information associated with you.</li>
                <li>Request correction or updating of inaccurate information.</li>
                <li>Request deletion or erasure where applicable.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Raise a grievance or privacy-related complaint.</li>
                <li>Exercise other rights available under applicable data protection law.</li>
              </ul>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900">
                To submit a privacy request, contact{' '}
                <a
                  href="mailto:privacy@tripyeah.com"
                  className="font-bold text-blue-700 underline"
                >
                  privacy@tripyeah.com
                </a>
                . We may need to verify your identity before responding.
              </div>
              <p>
                We will respond within the time limits applicable under relevant law. Some information
                may need to be retained where legally required or necessary to establish, exercise or
                defend legal claims.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 12. Account Closure and Deletion Requests */}
          <section id="sec-12" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              12. Account Closure and Deletion Requests
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                If TripYeah provides account deletion controls, you may use the available account
                settings. Otherwise, contact us at{' '}
                <a
                  href="mailto:privacy@tripyeah.com"
                  className="font-bold text-blue-700 underline"
                >
                  privacy@tripyeah.com
                </a>{' '}
                to request account closure or deletion.
              </p>
              <p>
                We will explain the scope of deletion, any information that must be retained by law,
                and any steps required to complete the request.
              </p>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <strong>Notice:</strong> Account closure may not automatically cancel a booking with a
                third-party travel provider. Contact the relevant provider separately where necessary.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 13. Children's Privacy */}
          <section id="sec-13" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              13. Children's Privacy
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYeah is not intended to collect children's personal information in violation of
                applicable law. Where a service is directed to children or involves their personal
                information, TripYeah will apply the notices, permissions, consent and safeguards
                required by the laws that apply to that service.
              </p>
              <p>
                If you believe a child has provided personal information inappropriately, contact us
                at{' '}
                <a
                  href="mailto:privacy@tripyeah.com"
                  className="font-bold text-blue-700 underline"
                >
                  privacy@tripyeah.com
                </a>
                .
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 14. International Data Transfers */}
          <section id="sec-14" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              14. International Data Transfers
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                Some of our service providers or travel partners may process information in countries
                other than your own. Where applicable, TripYeah will use the safeguards and comply
                with transfer restrictions required by relevant law.
              </p>
              <p className="text-xs text-slate-500 italic">
                The countries involved and the safeguards used depend on the service providers and
                integrations actually selected by TripYeah.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 15. Third-Party Websites and Services */}
          <section id="sec-15" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              15. Third-Party Websites and Services
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                TripYeah may link to external travel providers, payment services, social platforms or
                other websites. Those services operate independently and may have their own privacy
                policies, terms and security practices.
              </p>
              <p>
                TripYeah is not responsible for the privacy practices of third-party websites that it
                does not operate. Review their policies before submitting personal information.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 16. Changes to This Privacy Policy */}
          <section id="sec-16" className="scroll-mt-24 space-y-3.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              16. Changes to This Privacy Policy
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                We may update this Policy when our services, technology, partners or legal
                obligations change. We will update the “Last Updated” date and provide additional
                notice where required by law.
              </p>
              <p>Material changes will be communicated through appropriate channels where required.</p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 17. Contact and Grievance Redressal */}
          <section id="sec-17" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              17. Contact and Grievance Redressal
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              For privacy questions, data requests or complaints, contact:
            </p>

            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-3 text-xs sm:text-sm text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Legal Entity:</span>
                <span className="sm:col-span-2 font-bold text-slate-900">
                  TripYeah Technologies Private Limited
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Registered Address:</span>
                <span className="sm:col-span-2 text-slate-800">
                  Plot No. 18, Sector 44, Institutional Area, Gurugram, Haryana 122002, India
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Privacy / Grievance Email:</span>
                <span className="sm:col-span-2">
                  <a
                    href="mailto:privacy@tripyeah.com"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    privacy@tripyeah.com
                  </a>{' '}
                  / support@tripyeah.com
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 border-b border-slate-200/60">
                <span className="font-semibold text-slate-500">Grievance Officer:</span>
                <span className="sm:col-span-2 font-medium text-slate-900">
                  Chief Privacy Officer &amp; Legal Counsel, TripYeah
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
                <span className="font-semibold text-slate-500">Response Process:</span>
                <span className="sm:col-span-2 text-slate-700">
                  Please include sufficient details for us to understand and verify your request. We
                  will respond in accordance with applicable law within standard statutory periods (15–30 days).
                </span>
              </div>
            </div>

            {/* Legal Notice Footer */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
              <p>
                <strong>Important:</strong> This Policy is periodically reviewed against TripYehh's
                actual technical integrations, partner contracts and applicable data protection laws.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
