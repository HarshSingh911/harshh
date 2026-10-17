import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Camera,
  Video,
  CheckCircle2,
  ArrowRight,
  Award,
  Plane,
  Building2,
  TrendingUp,
  ShieldCheck,
  Send,
  Share2,
  DollarSign,
  ChevronRight,
  X,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';

interface InfluencersPageProps {
  onBackToHome: () => void;
  currency: CurrencyCode;
  onNotify: (title: string, message: string, type?: 'success' | 'info') => void;
  onOpenExplore?: () => void;
}

// Curated high-res background slides tailored for travel influencers / creators
const INFLUENCER_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=2000&q=85',
    title: 'Scenic Travel Vlogging & Photography',
    location: 'Amalfi Coast, Italy',
    creator: '@thewanderlustduo',
  },
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=85',
    title: 'Luxury Private Villa Stays & Reels',
    location: 'Ubud, Bali',
    creator: '@aanya_solo',
  },
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85',
    title: 'Epic Roadtrips & 4K Travel Documentaries',
    location: 'Swiss Alps Expedition',
    creator: '@kabirtravels',
  },
  {
    url: 'https://images.unsplash.com/photo-1510414842594-a61752a33f10?auto=format&fit=crop&w=2000&q=85',
    title: 'Drone Cinematography & Island Hopping',
    location: 'South Ari Atoll, Maldives',
    creator: '@foodandtrails',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    title: 'Sunset Beach Escapes & Storytelling',
    location: 'Phuket, Thailand',
    creator: '@wanderlust_lens',
  },
];

export const InfluencersPage: React.FC<InfluencersPageProps> = ({
  onBackToHome,
  currency,
  onNotify,
}) => {
  // Hero Slideshow state
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Auto-advance hero background slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % INFLUENCER_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);
  const [generatedCreatorId, setGeneratedCreatorId] = useState<string>('');

  // Application Form State
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [primaryPlatform, setPrimaryPlatform] = useState<'instagram' | 'youtube' | 'both'>('instagram');
  const [instagramHandle, setInstagramHandle] = useState<string>('');
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState<string>('');
  const [followerCountTier, setFollowerCountTier] = useState<string>('25k - 100k');
  const [primaryNiche, setPrimaryNiche] = useState<string>('Luxury Resorts & Villas');
  const [upcomingDestinations, setUpcomingDestinations] = useState<string>('Bali, Goa, Thailand');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Earnings Calculator State
  const [calcPlatform, setCalcPlatform] = useState<'instagram' | 'youtube'>('instagram');
  const [followersCount, setFollowersCount] = useState<number>(65000);
  const [avgBookingsPerMonth, setAvgBookingsPerMonth] = useState<number>(25);
  const [calcNiche, setCalcNiche] = useState<string>('luxury');

  // FAQ open item
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active creator tab (Instagram vs YouTube spotlight)
  const [activeTab, setActiveTab] = useState<'instagram' | 'youtube'>('instagram');

  // Dynamic Calculator Results
  const calculatedEarnings = useMemo(() => {
    let baseRate = 800; // INR per booking
    if (calcNiche === 'luxury') baseRate = 1800;
    if (calcNiche === 'adventure') baseRate = 1100;
    if (calcNiche === 'budget') baseRate = 500;

    // Follower multiplier
    const followerMultiplier = followersCount > 250000 ? 1.5 : followersCount > 100000 ? 1.25 : 1.0;
    const monthlyCash = Math.round(avgBookingsPerMonth * baseRate * followerMultiplier);

    // Free nights calculation
    const freeNights = followersCount >= 500000 ? 8 : followersCount >= 100000 ? 5 : followersCount >= 25000 ? 3 : 1;

    // Flight vouchers calculation
    const flightVoucherInr = followersCount >= 500000 ? 90000 : followersCount >= 100000 ? 45000 : 15000;

    // Commission percentage
    const commissionPercent = followersCount >= 250000 ? 15 : followersCount >= 50000 ? 12 : 8;

    return {
      monthlyCash,
      freeNights,
      flightVoucherInr,
      commissionPercent,
    };
  }, [followersCount, avgBookingsPerMonth, calcNiche]);

  // Handle Application Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) {
      onNotify('Incomplete Details', 'Please enter your name and email address to apply.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `TY-CREATOR-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedCreatorId(newId);
      setApplicationSubmitted(true);
      onNotify(
        'Application Submitted Successfully!',
        `Welcome ${applicantName}! Your Creator Application ${newId} has been sent to our Influencer Relations desk. We will review your profile within 48 hours.`,
        'success'
      );
    }, 900);
  };

  const handleResetApplication = () => {
    setApplicationSubmitted(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setInstagramHandle('');
    setYoutubeChannelUrl('');
    setShowApplyModal(false);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-rose-500 selection:text-white">
      {/* =========================================================================
          1. HERO HEADER: SEAMLESS VIBRANT INFLUENCER BACKGROUND SLIDESHOW
      ========================================================================= */}
      <section className="relative overflow-hidden pt-6 sm:pt-8 pb-12 sm:pb-16 min-h-[520px] flex flex-col justify-between">
        {/* Dynamic Background Slideshow Behind "Get Paid..." - Seamless Edge-to-Edge */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {INFLUENCER_SLIDES.map((slide, idx) => (
            <div
              key={slide.url}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-110 contrast-105 saturate-115"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}

          {/* Gentle translucent gradient overlay: keeps 100% of the photo bright & clear without harsh lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 w-full">
          {/* Top Breadcrumb & Back */}
          <div className="flex items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/20 text-white/90 shadow-sm">
              <button
                type="button"
                onClick={onBackToHome}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-white/50" />
              <span className="text-rose-400 font-bold">TripYeah Creator Club</span>
            </nav>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-xl border border-white/20 bg-slate-950/60 hover:bg-slate-900 text-xs font-bold text-white shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Travel Hub</span>
            </button>
          </div>

          {/* Hero Main Content */}
          <div className="max-w-3xl space-y-5">
            {/* "Get Paid to Travel the World & Stay at Luxury Resorts." */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
              Get Paid to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300">
                Travel the World
              </span>{' '}
              &amp; Stay at Luxury Resorts.
            </h1>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-950/40 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply to Creator Club</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <a
                href="#calculator"
                className="px-5 py-3.5 rounded-2xl bg-slate-900/75 hover:bg-slate-900 border border-white/25 text-white font-bold text-sm sm:text-base shadow-md backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Calculate Your Earnings</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar (Clean Glass Cards with high photo visibility) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="bg-slate-950/55 border border-white/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-tabular">
                ₹4.8 Cr+
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Paid to Creators</div>
            </div>
            <div className="bg-slate-950/55 border border-white/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono-tabular">
                1,420+
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Travel Creators</div>
            </div>
            <div className="bg-slate-950/55 border border-white/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-tabular">
                850+
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Partner Luxury Resorts</div>
            </div>
            <div className="bg-slate-950/55 border border-white/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-tabular">
                48h
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Fast Application Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. DEDICATED PLATFORM PILLARS: INSTAGRAM & YOUTUBE
      ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">
            <Award className="w-3.5 h-3.5 text-rose-500" />
            <span>Tailored for Modern Content Creators</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for How You Create &amp; Storytell
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Whether your audience thrives on 30-second Instagram Reels or 20-minute 4K cinematic YouTube travel documentaries, our creator contracts are engineered for your format.
          </p>

          {/* Platform Toggle Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('instagram')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'instagram'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Instagram Creators (Reels &amp; Stories)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('youtube')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'youtube'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>YouTube Creators (Vlogs &amp; Documentaries)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Instagram Features */}
        {activeTab === 'instagram' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-rose-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Complimentary PR Stays</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Stay for free at 5-star partner resorts in Bali, Maldives, Goa &amp; Dubai. Post 1 cinematic Reel + 3 Story tags, and the villa tab is 100% covered.
              </p>
              <div className="pt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero out-of-pocket room expense</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-purple-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Custom Bio Discount Code</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get a custom vanity URL (<code className="text-purple-600 font-bold bg-purple-50 px-1 py-0.5 rounded">tripyeah.com/@YourHandle</code>) that gives your followers ₹1,500 OFF their trips, while paying you ₹800 - ₹2,000 per booking.
              </p>
              <div className="pt-2 text-xs font-semibold text-purple-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-time link tracking dashboard</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-cyan-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Instagram Collab Features</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Co-author Reels directly with <strong className="text-slate-900">@TripYeah</strong> official. Gain immediate access to 2.8 Million travel lovers, boosting follower growth.
              </p>
              <div className="pt-2 text-xs font-semibold text-cyan-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant viral distribution reach</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: YouTube Features */}
        {activeTab === 'youtube' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-red-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Full Flight Sponsorships</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We fund return flight tickets for your long-form destination vlogs and multi-episode travel series. Fly domestic or international with zero budget constraints.
              </p>
              <div className="pt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Economy &amp; Business class options</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-amber-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">60-Day Description Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Add your verified TripYeah deep-links to your video descriptions. If a viewer books hotels, flights or holidays within 60 days of clicking, you earn the commission.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Industry-leading 60-day attribution</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Shooting Permissions &amp; Clearances</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our global PR desk handles difficult monument permissions, airport filming passes and commercial drone clearances so you can focus entirely on filmmaking.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero legal hassle for creators</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. INTERACTIVE EARNINGS & PERKS CALCULATOR (LIGHT THEME)
      ========================================================================= */}
      <section id="calculator" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Transparent Creator Revenue</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Estimate Your Travel Perks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Slide your following count and estimated monthly bookings to see what you could earn as a verified TripYeah creator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Left Controls */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Platform Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Primary Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcPlatform('instagram')}
                    className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      calcPlatform === 'instagram'
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcPlatform('youtube')}
                    className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      calcPlatform === 'youtube'
                        ? 'bg-red-50 border-red-400 text-red-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>YouTube</span>
                  </button>
                </div>
              </div>

              {/* Followers Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">
                    {calcPlatform === 'instagram' ? 'Instagram Followers' : 'YouTube Subscribers'}
                  </span>
                  <span className="text-rose-600 font-mono-tabular font-bold text-sm">
                    {followersCount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10K</span>
                  <span>100K</span>
                  <span>250K</span>
                  <span>500K+</span>
                </div>
              </div>

              {/* Monthly Bookings Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">Estimated Monthly Bookings Generated</span>
                  <span className="text-emerald-600 font-mono-tabular font-bold text-sm">
                    {avgBookingsPerMonth} bookings
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={avgBookingsPerMonth}
                  onChange={(e) => setAvgBookingsPerMonth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5</span>
                  <span>25</span>
                  <span>50</span>
                  <span>100+</span>
                </div>
              </div>

              {/* Content Niche */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Travel Content Niche
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'luxury', label: 'Luxury & Resorts' },
                    { id: 'adventure', label: 'Trek & Adventure' },
                    { id: 'budget', label: 'Budget Backpacking' },
                  ].map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setCalcNiche(n.id)}
                      className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                        calcNiche === n.id
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Result Card (Luxury Contrast Card) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Estimated Monthly Cash Earning
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-tabular">
                  {formatPrice(calculatedEarnings.monthlyCash, currency)}
                  <span className="text-xs sm:text-sm font-normal text-slate-400"> /month</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Free Sponsored Resort Stays:</span>
                  </span>
                  <span className="font-bold text-white">
                    {calculatedEarnings.freeNights} Nights / Qtr
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-emerald-400" />
                    <span>Annual Flight Credit Voucher:</span>
                  </span>
                  <span className="font-bold text-white">
                    {formatPrice(calculatedEarnings.flightVoucherInr, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>Tier Commission Rate:</span>
                  </span>
                  <span className="font-bold text-amber-400 font-mono-tabular">
                    {calculatedEarnings.commissionPercent}% Flat
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Lock In This Creator Tier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CREATOR TIERS ROADMAP (CLEAN LIGHT DESIGN)
      ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Creator Progression Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From your very first viral Reel to international festival headliners, we grow with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                10K – 50K Audience
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 pt-2">Rising Explorer</h3>
              <p className="text-xs text-slate-500">For passionate emerging travel creators</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>8% booking affiliate commission</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 Free 2-Night Domestic Stay / year</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹10,000 flight discount vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>TripYeah Creator Media Kit &amp; assets</span>
              </li>
            </ul>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="bg-gradient-to-b from-rose-50/80 via-white to-amber-50/40 border-2 border-rose-400 rounded-3xl p-6 sm:p-7 space-y-5 relative shadow-md shadow-rose-100">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-300">
                50K – 250K Audience
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 pt-2">Pro Voyager</h3>
              <p className="text-xs text-slate-500">Consistent travel storytellers with strong engagement</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>12% booking affiliate commission</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary 4-Star Resort stays (Bali, Goa, Thailand)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹35,000 international flight sponsorship</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Instagram Collab post with @TripYeah</span>
              </li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                250K+ Audience
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 pt-2">Global Ambassador</h3>
              <p className="text-xs text-slate-500">Elite travel documentary &amp; lifestyle creators</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>15% top-tier commission + cash retainer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fully sponsored Europe, Maldives &amp; Japan expeditions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated talent manager &amp; legal clearances</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Launch co-branded curated holiday group tours</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED CREATORS SPOTLIGHT (LIGHT CARDS)
      ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Hall of Fame
              </div>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Creators Travelling With TripYeah
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Join Them in 2026</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: 'Rohan & Meera',
                handle: '@thewanderlustduo',
                platform: 'Instagram',
                followers: '380K Followers',
                trips: '14 Sponsored Stays in Bali & Vietnam',
                quote: 'TripYeah handled all villa check-ins and flight vouchers effortlessly. Best creator team we have partnered with!',
              },
              {
                name: 'Kabir Verma',
                handle: '@kabirtravels',
                platform: 'YouTube',
                followers: '620K Subscribers',
                trips: '8 Sponsored Travel Series in Europe',
                quote: 'Having permissions pre-cleared by TripYeah in Paris was an absolute game changer for my 4K vlog series.',
              },
              {
                name: 'Aanya Sharma',
                handle: '@aanya_solo',
                platform: 'Instagram',
                followers: '195K Followers',
                trips: '22 Boutique Stays in India & Sri Lanka',
                quote: 'My vanity discount link generates a reliable ₹80,000 extra income every single month without pushing sales.',
              },
              {
                name: 'Dev & Shreya',
                handle: '@foodandtrails',
                platform: 'YouTube & Insta',
                followers: '450K Community',
                trips: '18 Culinary Trails Sponsored in Asia',
                quote: 'TripYeah lets us focus 100% on storytelling while taking care of luxury flights and resort partnerships.',
              },
            ].map((creator, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {creator.platform}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{creator.followers}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-base">{creator.name}</h4>
                    <div className="text-xs text-slate-500 font-mono">{creator.handle}</div>
                  </div>
                  <div className="text-xs font-semibold text-emerald-700">
                    ✈️ {creator.trips}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed pt-1">
                    "{creator.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CREATOR FAQ ACCORDION (LIGHT CARDS)
      ========================================================================= */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about joining the TripYeah Creator Club.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What are the minimum eligibility criteria to join?',
              a: 'We accept creators with 10,000+ authentic Instagram followers or 5,000+ active YouTube subscribers with strong engagement (at least 3% engagement rate). We care more about aesthetic storytelling, high visual quality and an active travel audience than raw numbers.',
            },
            {
              q: 'How do free sponsored stays work?',
              a: 'Once approved, you gain access to our partner property portal with 850+ luxury hotels and villas. Choose your travel dates, submit your content plan (e.g. 1 Reel + 3 Stories, or 1 Vlog mention), and once confirmed, your stay is 100% complimentary.',
            },
            {
              q: 'When and how are commissions paid out?',
              a: 'All affiliate booking commissions and campaign bonuses are paid monthly on the 10th directly to your verified bank account (via UPI / NEFT for India, or Wire / Stripe for international creators). Zero payout delays.',
            },
            {
              q: 'Do I retain copyright over my content?',
              a: 'Yes, 100%! You own your original videos and photos. TripYeah only requests a non-exclusive digital license to repost or share your content across official TripYeah channels with full tags and credits.',
            },
            {
              q: 'Can I apply if I travel as a couple or duo?',
              a: 'Absolutely! Many of our highest-earning creators are couple travel vloggers and backpacking duos. Simply mention both handles or your shared channel link when applying.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-rose-600 font-extrabold text-lg">{openFaqIndex === i ? '−' : '+'}</span>
              </button>
              {openFaqIndex === i && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. BOTTOM INVITATION CTA
      ========================================================================= */}
      <section className="py-16 bg-gradient-to-t from-slate-100 via-rose-50/30 to-white border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready to Travel on Your Terms?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Submit your application in 2 minutes. Our creator team reviews every profile individually and gets back within 48 hours.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 cursor-pointer transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              <span>Join TripYeah Creator Club Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. APPLICATION MODAL: "JOIN CREATOR CLUB" (CLEAN LIGHT DESIGN)
      ========================================================================= */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={handleResetApplication}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSubmitted ? (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Application Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Welcome to the TripYeah Creator family, <strong className="text-rose-600">{applicantName}</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Creator Application ID:</span>
                    <span className="font-mono font-bold text-amber-700">{generatedCreatorId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Talent Desk:</span>
                    <span className="font-semibold text-slate-800">Divya &amp; Team (Influencer PR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Review SLA:</span>
                    <span className="font-semibold text-emerald-600">Within 48 Working Hours</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  We'll review your handles and send your welcome onboarding kit, custom vanity discount code, and media kit to <strong className="text-slate-900">{applicantEmail}</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleResetApplication}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Close &amp; Back to Creator Hub
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Creator Onboarding</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Apply to TripYeah Creator Club
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tell us about your channels to unlock sponsored stays, travel perks &amp; revenue share.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Aryan Verma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="creator@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Primary Platform */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Primary Channel</label>
                      <select
                        value={primaryPlatform}
                        onChange={(e) => setPrimaryPlatform(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      >
                        <option value="instagram">Instagram (Reels / Photos)</option>
                        <option value="youtube">YouTube (Vlogs / Series)</option>
                        <option value="both">Both Instagram &amp; YouTube</option>
                      </select>
                    </div>
                  </div>

                  {/* Handles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Instagram Handle</label>
                      <input
                        type="text"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value)}
                        placeholder="@yourhandle"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">YouTube Channel URL</label>
                      <input
                        type="url"
                        value={youtubeChannelUrl}
                        onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                        placeholder="https://youtube.com/@channel"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Audience Size & Niche */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Audience Following Size</label>
                      <select
                        value={followerCountTier}
                        onChange={(e) => setFollowerCountTier(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      >
                        <option value="10k - 25k">10k – 25k Followers / Subs</option>
                        <option value="25k - 100k">25k – 100k Followers / Subs</option>
                        <option value="100k - 250k">100k – 250k Followers / Subs</option>
                        <option value="250k - 500k">250k – 500k Followers / Subs</option>
                        <option value="500k+">500k+ Elite Tier</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Travel Niche</label>
                      <select
                        value={primaryNiche}
                        onChange={(e) => setPrimaryNiche(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                      >
                        <option value="Luxury Resorts & Villas">Luxury Resorts &amp; Villas</option>
                        <option value="Backpacking & Budget Trails">Backpacking &amp; Budget Trails</option>
                        <option value="Adventure, Hiking & Trekking">Adventure, Hiking &amp; Trekking</option>
                        <option value="Food, Street & Culinary Trails">Food, Street &amp; Culinary Trails</option>
                        <option value="Solo Female Exploration">Solo Female Exploration</option>
                        <option value="Couple Travel & Honeymoons">Couple Travel &amp; Honeymoons</option>
                      </select>
                    </div>
                  </div>

                  {/* Planned Destinations */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Upcoming Planned Trips / Wishlist (Next 3-6 months)
                    </label>
                    <input
                      type="text"
                      value={upcomingDestinations}
                      onChange={(e) => setUpcomingDestinations(e.target.value)}
                      placeholder="e.g. Bali in Nov, Goa in Dec, Kashmir in Jan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Application to PR Desk...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
