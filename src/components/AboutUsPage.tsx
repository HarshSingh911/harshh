import React from 'react';
import {
  ArrowLeft,
  Compass,
  ShieldCheck,
  Zap,
  Users,
  Target,
  Award,
  Globe2,
  Plane,
  Building2,
  Clock,
  ArrowRight,
  Quote,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Lock,
} from 'lucide-react';
import { AppPageView } from './Navbar';

export interface AboutUsPageProps {
  onBackToHome: () => void;
  onNavigatePage: (page: AppPageView) => void;
  onOpenSupport?: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onBackToHome,
  onNavigatePage,
  onOpenSupport,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Breadcrumb Bar - Static in its original position, does not scroll down with page */}
      <div className="bg-white border-b border-slate-200/80 relative z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Company</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-900">About Trip Yehh</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION WITH RICH CINEMATIC TRAVEL BACKGROUND IMAGE */}
      <section className="relative overflow-hidden text-white py-24 lg:py-32">
        {/* Cinematic Travel Background Image - Clear, vivid, and free of bluish veil */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=90"
            alt="Trip Yehh Global Travel"
            className="w-full h-full object-cover object-center brightness-100 contrast-[1.05]"
          />
          {/* Clean Neutral Scrim: Gives high contrast for text while keeping background image completely clear and visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Catchy, High-Energy Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight lg:leading-none drop-shadow-xl">
            Say <span className="text-amber-400 underline decoration-amber-400/40 decoration-wavy">Trip Yehh</span> to Effortless Journeys.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-md">
            Where cutting-edge travel technology meets zero booking friction. We synchronize flights, premium stays, ground transit, and curated experiences into a single, high-velocity digital ecosystem built for the modern traveler.
          </p>

          {/* High-Converting CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigatePage('search-results')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl shadow-black/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
            <a
              href="#founder-vision"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/30 text-sm font-medium backdrop-blur-md transition-colors cursor-pointer"
            >
              <span>Meet the Founder</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION ("WE ARE TRIP YEHH" BLOCK) */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Reimagining Travel for the Digital-First Generation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Story Paragraphs */}
            <div className="space-y-6 text-slate-600 text-base leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1 first-letter:float-left">
                Trip Yehh was born out of a clear realization: while the world is more connected than ever, booking travel remains plagued by legacy bloat, fragmented apps, hidden platform commissions, and clunky interfaces. We set out to build an agile, asset-light marketplace designed exclusively for modern nomads, corporate achievers, and spontaneous wanderers who demand speed, clarity, and instant fulfillment.
              </p>
              <p>
                By functioning as an intelligent digital intermediary, Trip Yehh bridges global inventory—from major commercial airlines and curated boutique hotels to cross-country rail and smart airport shuttles. We strip away the unnecessary bureaucracy of traditional tour operators, giving users direct access to real-time rates, dynamic route bundling, and transparent cancellations right from their fingertips.
              </p>

              <div className="pt-2">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">Asset-Light, Value-Heavy Architecture</h3>
                    <p className="text-xs text-slate-600 leading-normal">
                      Instead of owning physical fleets or properties, we channel 100% of our energy into engineering world-class search velocity, transparent pricing algorithms, and dependable 24/7 traveler care.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Feature Card Stack */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 rounded-3xl transform rotate-2 scale-98 pointer-events-none" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-slate-700/60 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">TripYehh.Engine.v2.4</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                    Unified Flow
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Plane className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-semibold text-slate-200">Global Airline Feeds</div>
                        <div className="text-slate-400 text-[11px]">Direct GDS &amp; LCC aggregation</div>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">&lt;350ms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-slate-200">Verified Stays &amp; Villas</div>
                        <div className="text-slate-400 text-[11px]">Dynamic rate comparison</div>
                      </div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">Best Price</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-semibold text-slate-200">Ground Transit Sync</div>
                        <div className="text-slate-400 text-[11px]">Trains, Cabs &amp; Express Buses</div>
                      </div>
                    </div>
                    <span className="font-mono text-blue-400 font-bold">1-Click</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400">
                    Empowering Indian &amp; Global Travelers with Digital Independence.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES GRID (4 PILLARS) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
              Our Operating DNA
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 4 Core Values Guiding Every Booking
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              We hold ourselves to uncompromising standards so you can pack your bags with total serenity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Customer Focus */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  Pillar 01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Customer Focus
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every line of code and customer touchpoint is engineered backward from the traveler&apos;s peace of mind.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-blue-600">
                <span>Traveler-Centric</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            {/* Pillar 2: Smart Innovation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Pillar 02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  Smart Innovation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Harnessing real-time predictive analytics and asset-light integrations to eliminate legacy booking friction.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600">
                <span>AI &amp; Speed Driven</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              </div>
            </div>

            {/* Pillar 3: Transparency */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Pillar 03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  Radical Transparency
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero hidden surcharges, clear fare breakdowns, and unambiguous cancellation timelines from query to confirmation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-emerald-600">
                <span>No Hidden Fees</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>

            {/* Pillar 4: Commitment to Excellence */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Pillar 04
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                  Excellence Always
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Uncompromising platform reliability backed by high-velocity customer support when itineraries demand real agility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-amber-600">
                <span>24/7 Priority SLA</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP & FOUNDER'S VISION */}
      <section id="founder-vision" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">
              Leadership &amp; Direction
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Behind the Vision at Trip Yehh
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineering the next generation of asset-light consumer travel technology.
            </p>
          </div>

          {/* Split-Screen Executive Profile Card with Clear Architecture Background */}
          <div className="relative text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-700/60 overflow-hidden group">
            {/* Background Image: Modern Architectural Twilight City Skyline - Crystal Clear */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85"
                alt="Trip Yehh Leadership Architecture"
                className="w-full h-full object-cover object-center brightness-95 contrast-[1.05]"
              />
              {/* Clean Neutral Contrast Vignette - No Bluish Tint */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/75" />
            </div>

            {/* Background Aesthetic Watermark */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-white/5 pointer-events-none z-0">
              <Compass className="w-96 h-96" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Founder Persona & Identity Badge */}
              <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-200 p-1 shadow-2xl shadow-black/40">
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden border border-white/10">
                      {/* Stylized Founder Avatar Representation */}
                      <div className="w-full h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center text-center p-3 relative">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-200 drop-shadow-sm">
                          HKS
                        </span>
                        <span className="text-[10px] text-amber-300 font-semibold mt-1 tracking-wide uppercase">
                          Founder &amp; CEO
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-slate-950 flex items-center gap-1 shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Leader</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                    Harsh Kumar Singh
                  </h3>
                  <p className="text-sm font-semibold text-amber-400 mt-0.5">
                    Founder &amp; Chief Executive Officer
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Trip Yehh Travel Technologies
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                  <span className="text-xs font-medium text-slate-200 bg-black/40 px-3 py-1 rounded-lg border border-white/15 backdrop-blur-xs">
                    🇮🇳 Tech Entrepreneur
                  </span>
                  <span className="text-xs font-medium text-slate-200 bg-black/40 px-3 py-1 rounded-lg border border-white/15 backdrop-blur-xs">
                    Marketplace Architecture
                  </span>
                </div>
              </div>

              {/* Right Column: Bio & Direct Inspiring Quote */}
              <div className="lg:col-span-8 space-y-6">
                {/* Quote Box with Neutral Glassmorphism */}
                <div className="relative p-6 sm:p-7 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md shadow-inner">
                  <Quote className="w-8 h-8 text-amber-400/80 mb-3" />
                  <blockquote className="text-base sm:text-lg font-medium text-white leading-relaxed italic">
                    &ldquo;Travel shouldn&apos;t feel like an administrative chore—it should ignite excitement the instant you decide to go. At Trip Yehh, we are dismantling legacy booking friction and building an intelligent ecosystem where planes, trains, hotels, and cabs communicate in real time for you.&rdquo;
                  </blockquote>
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-amber-300">— Harsh Kumar Singh</span>
                    <span className="text-slate-400 font-medium">Founder&apos;s Commitment</span>
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="text-sm text-slate-200 space-y-3 leading-relaxed">
                  <p>
                    As the sole founder and CEO of Trip Yehh, Harsh Kumar Singh brings an unyielding passion for consumer travel tech and systems engineering. Recognizing that Indian and global travelers frequently bounce between disparate websites to complete a single itinerary, he engineered Trip Yehh as an integrated, asset-light marketplace platform.
                  </p>
                  <p>
                    Under his leadership, Trip Yehh prioritizes user sovereignty, algorithmic price transparency, and lightning-quick booking checkouts. His operating philosophy balances aggressive technical innovation with deep corporate accountability, ensuring every customer enjoys enterprise-grade reliability with the agile delight of modern software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTPRINT & TRUST ANCHORS (FUTURE SCALABILITY MARKERS) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-2">
              Scalability &amp; Reliability Markers
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Architected for High Scale and Rock-Solid Trust
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Continuous benchmarks engineered to deliver seamless travel fulfillment across millions of touchpoints.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Metric 1 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2">
                Target Active Travelers
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Fast-expanding Pan-India and global wanderer network
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                &lt;450ms
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2">
                Search-to-Results Latency
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                High-throughput GDS &amp; multi-provider query pipeline
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono tracking-tight">
                750+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2">
                Airlines &amp; Travel Operators
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Integrated via certified global distribution connections
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/50 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                &lt;15 Mins
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-2">
                Resolution SLA Target
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dedicated escalation protocols for active bookings
              </p>
            </div>
          </div>

          {/* Security & Compliance Badges Banner */}
          <div className="mt-14 pt-10 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Bank-Grade 256-Bit SSL</span>
                <span>All transactions encrypted end-to-end via PCI-DSS compliant gateways.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <Globe2 className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Universal Provider Aggregation</span>
                <span>Direct booking coordination with verified airlines, hotels, and rail networks.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Traveller Protection Guarantee</span>
                <span>Real-time booking verification and immediate digital receipts.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CONVERSION CALL TO ACTION WITH VIVID DESTINATION BACKGROUND */}
      <section className="relative py-20 overflow-hidden text-white text-center">
        {/* Scenic Background Image - Clear and Visible */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Trip Yehh World Destinations"
            className="w-full h-full object-cover object-center brightness-100"
          />
          {/* Neutral scrim without blue tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-md">
            Ready to Experience the Trip Yehh Difference?
          </h2>
          <p className="text-white/90 text-base max-w-2xl mx-auto drop-shadow-sm">
            Book your next flight, hotel, or complete holiday package in minutes without the clutter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigatePage('home')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl hover:shadow-black/30 transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Searching Trips
            </button>
            {onOpenSupport && (
              <button
                type="button"
                onClick={onOpenSupport}
                className="px-7 py-3.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-medium text-sm border border-white/30 backdrop-blur-md transition-colors cursor-pointer"
              >
                Contact Support Desk
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
