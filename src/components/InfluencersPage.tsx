import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Sparkles,
  Camera,
  Video,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Compass,
  Film,
  Users,
  User,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Search,
  Filter,
  Eye,
  Send,
  X,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Mail,
  Calendar,
  Layers,
  Globe,
  DollarSign,
  Briefcase,
  Copy,
  Info,
} from 'lucide-react';
import { CurrencyCode, formatPrice } from '../data/travelData';
import { SafeImage } from './SafeImage';

export interface InfluencersPageProps {
  onBackToHome: () => void;
  currency: CurrencyCode;
  onNotify: (title: string, message: string, type?: 'success' | 'info') => void;
  onOpenExplore?: () => void;
  onPlanTrip?: (destination: string) => void;
  userName?: string | null;
}

export type CommunityTab = 'for-you' | 'explore' | 'trip-reels' | 'trippers' | 'my-profile' | 'creator-hub';

export interface TravelPostComment {
  id: string;
  authorName: string;
  authorHandle: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface TravelPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isVerified?: boolean;
  destination: string;
  locationTag: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  videoDuration?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  postedAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isTripping?: boolean; // Follow state
  comments: TravelPostComment[];
  tripPlanDestination: string; // destination query for TripYeah planner
  itineraryHighlights?: string[];
  tripCostEstimateInr?: number;
}

export interface TripReel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isVerified?: boolean;
  title: string;
  destination: string;
  locationTag: string;
  videoThumbnail: string;
  videoUrl?: string;
  audioTrack: string;
  viewsCount: string;
  likesCount: number;
  commentsCount: number;
  caption: string;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  isTripping?: boolean;
}

export interface TripperProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  isVerified?: boolean;
  bio: string;
  niche: string;
  badges: string[];
  location: string;
  trippersCount: string; // Followers
  trippingCount: number; // Following
  travelPostsCount: number;
  favouriteDestinations: string[];
  travelInterests: string[];
  isTripping?: boolean;
  collaborationRate?: string;
  gearUsed?: string[];
}

// REALISTIC TRAVEL DATASETS (Goa, Manali, Kashmir, Bali, Japan, Dubai, Switzerland)
const INITIAL_TRIPPERS: TripperProfile[] = [
  {
    id: 'tripper-aanya',
    name: 'Aanya Sen',
    handle: '@aanya_wanders',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    niche: 'Solo Travel & Luxury Stays',
    badges: ['Top Creator 2026', 'TripYeah Ambassador'],
    location: 'Mumbai & Digital Nomad',
    trippersCount: '28.4K',
    trippingCount: 342,
    travelPostsCount: 46,
    bio: 'Storyteller exploring unseen coastal shores & boutique heritage retreats. Helping 28K+ Trippers craft slow-travel journeys.',
    favouriteDestinations: ['Goa', 'Bali', 'Kyoto', 'Udaipur'],
    travelInterests: ['Solo Escapes', 'Boutique Villas', 'Coastal Cafes', 'Drone Cinematography'],
    isTripping: false,
    collaborationRate: '₹35,000 / Resort Showcase',
    gearUsed: ['Sony A7IV', 'DJI Mini 4 Pro', '24-70mm f/2.8 GM'],
  },
  {
    id: 'tripper-kabir',
    name: 'Kabir & Meera',
    handle: '@thehimalayanpair',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    niche: 'High Altitude & Snow Treks',
    badges: ['Himalayan Pioneer', '4K Storyteller'],
    location: 'Manali, Himachal Pradesh',
    trippersCount: '52.1K',
    trippingCount: 418,
    travelPostsCount: 68,
    bio: 'Couple documenting deep mountain valleys, glacier lakes, and high-altitude road trips across Kashmir, Ladakh & Himachal.',
    favouriteDestinations: ['Kashmir', 'Manali', 'Switzerland', 'Spiti'],
    travelInterests: ['Snow Treks', 'Homestays', 'Off-roading', 'Landscape Film'],
    isTripping: true,
    collaborationRate: '₹50,000 / Expedition Reel Series',
    gearUsed: ['Canon R5 C', 'GoPro Hero 13 Black', 'DJI Ronin RS3'],
  },
  {
    id: 'tripper-rohit',
    name: 'Rohit Kulkarni',
    handle: '@rohit_escapes',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    niche: 'International Architecture & Skyline',
    badges: ['Global Jetsetter'],
    location: 'Dubai & Bengaluru',
    trippersCount: '19.7K',
    trippingCount: 289,
    travelPostsCount: 32,
    bio: 'Chasing futuristic architecture, desert golden hour in Dubai, and European train journeys across the Swiss Alps.',
    favouriteDestinations: ['Dubai', 'Switzerland', 'Tokyo', 'Singapore'],
    travelInterests: ['Modern Architecture', 'Luxury Travel', 'Night Cityscapes', 'Aviation'],
    isTripping: false,
    collaborationRate: '₹40,000 / City Guide',
    gearUsed: ['Fujifilm X-T5', '16-55mm f/2.8', 'DJI Osmo Pocket 3'],
  },
  {
    id: 'tripper-tanya',
    name: 'Tanya Fernandez',
    handle: '@tanya_goavibes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    niche: 'Coastal Living & Food Trails',
    badges: ['Goa Local Insider'],
    location: 'Anjuna, North Goa',
    trippersCount: '34.6K',
    trippingCount: 520,
    travelPostsCount: 54,
    bio: 'Goa native uncovering hidden cliffside beaches, Portuguese villas, and authentic Konkani secret recipes.',
    favouriteDestinations: ['Goa', 'Bali', 'Thailand', 'Sri Lanka'],
    travelInterests: ['Culinary Trails', 'Beachside Sunset', 'Heritage Architecture', 'Cafes'],
    isTripping: false,
    collaborationRate: '₹28,000 / Cafe & Villa Review',
    gearUsed: ['iPhone 16 Pro Max', 'DJI Mic 2', 'Insta360 X4'],
  },
  {
    id: 'tripper-zayan',
    name: 'Zayan Mir',
    handle: '@kashmir_unfiltered',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80',
    isVerified: true,
    niche: 'Paradise on Earth & Alpine Meadows',
    badges: ['Kashmir Specialist'],
    location: 'Srinagar, Jammu & Kashmir',
    trippersCount: '44.9K',
    trippingCount: 310,
    travelPostsCount: 59,
    bio: 'Born in the Pir Panjal valleys. Showing you the real Shikara sunrises on Dal Lake, Gulmarg fresh powder, and Sonamarg trails.',
    favouriteDestinations: ['Kashmir', 'Manali', 'Switzerland', 'Ladakh'],
    travelInterests: ['Mountain Photography', 'Alpine Meadows', 'Cultural Heritage', 'Winter Sports'],
    isTripping: true,
    collaborationRate: '₹35,000 / Tourism Campaign',
    gearUsed: ['Sony FX3', '70-200mm f/2.8', 'DJI Mavic 3 Pro'],
  },
];

const INITIAL_POSTS: TravelPost[] = [
  {
    id: 'post-1',
    creatorId: 'tripper-aanya',
    creatorName: 'Aanya Sen',
    creatorHandle: '@aanya_wanders',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Bali, Indonesia',
    locationTag: 'Tegallalang Rice Terraces, Ubud',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Woke up at 5:45 AM before any tourists arrived. Emerald tiered rice paddies floating in morning jungle mist, with only the sound of rushing river water below. Ubud feels completely surreal when you slow down and immerse. 🌾✨',
    hashtags: ['#BaliVibes', '#UbudJungle', '#TripYeah', '#SlowTravel', '#IndonesianMorning'],
    likesCount: 1420,
    commentsCount: 88,
    sharesCount: 134,
    postedAt: '3 hours ago',
    isLiked: false,
    isSaved: false,
    isTripping: false,
    tripPlanDestination: 'Bali',
    itineraryHighlights: ['Sunrise trek at Tegallalang', 'Coffee tasting in Gianyar', 'Campuhan Ridge Walk'],
    tripCostEstimateInr: 34500,
    comments: [
      {
        id: 'c1',
        authorName: 'Rohan Joshi',
        authorHandle: '@rohan_travels',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'The lighting here is unreal Aanya! Did you need to pre-book a local guide for the early entrance?',
        timeAgo: '2h ago',
        likes: 12,
      },
      {
        id: 'c2',
        authorName: 'Priya Mehta',
        authorHandle: '@priya_wanderlust',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        text: 'Adding this straight to my Bali 2026 TripYeah wishlist! Which resort did you stay at?',
        timeAgo: '1h ago',
        likes: 7,
      },
    ],
  },
  {
    id: 'post-2',
    creatorId: 'tripper-zayan',
    creatorName: 'Zayan Mir',
    creatorHandle: '@kashmir_unfiltered',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Kashmir, India',
    locationTag: 'Apharwat Peak, Gulmarg (Phase 2)',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Standing at 13,780 feet after riding the Gulmarg Gondola Phase 2. The air is crisp, the snow is bone-dry powder, and the Himalayan horizon stretches all the way to Nanga Parbat. Kashmir in winter is poetry written in white. ❄️🏔️',
    hashtags: ['#Kashmir', '#GulmargGondola', '#Himalayas', '#WinterParadise', '#TripYeah'],
    likesCount: 2840,
    commentsCount: 156,
    sharesCount: 312,
    postedAt: '5 hours ago',
    isLiked: true,
    isSaved: true,
    isTripping: true,
    tripPlanDestination: 'Kashmir',
    itineraryHighlights: ['Gulmarg Gondola Phase 1 & 2', 'Dal Lake Shikara at sunrise', 'Pahalgam Betaab Valley'],
    tripCostEstimateInr: 22800,
    comments: [
      {
        id: 'c3',
        authorName: 'Sneha Kapoor',
        authorHandle: '@sneha_globetrotter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'Gulmarg Phase 2 tickets sell out so fast online! Any insider tips for booking slots on TripYeah?',
        timeAgo: '4h ago',
        likes: 19,
      },
    ],
  },
  {
    id: 'post-3',
    creatorId: 'tripper-tanya',
    creatorName: 'Tanya Fernandez',
    creatorHandle: '@tanya_goavibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Goa, India',
    locationTag: 'Cabo de Rama Cliff, South Goa',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Forget the noisy party strips. This is the real South Goa: hidden red laterite cliffs, coconut groves whispering in the sea breeze, and golden sunsets that melt into the Arabian Sea. Best sunset spot on the entire western coastline. 🌊🥥',
    hashtags: ['#SouthGoa', '#GoaUnseen', '#CabodeRama', '#SunsetLovers', '#TripYeah'],
    likesCount: 1950,
    commentsCount: 72,
    sharesCount: 189,
    postedAt: '7 hours ago',
    isLiked: false,
    isSaved: false,
    isTripping: false,
    tripPlanDestination: 'Goa',
    itineraryHighlights: ['Cliffside sunset at Cabo de Rama', 'Agonda quiet beach day', 'Fontainhas Latin Quarter heritage stroll'],
    tripCostEstimateInr: 14500,
    comments: [
      {
        id: 'c4',
        authorName: 'Devansh Verma',
        authorHandle: '@devansh_v',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        text: 'South Goa is pure therapy. Renting a scooter and riding through these interior village roads is the dream!',
        timeAgo: '6h ago',
        likes: 14,
      },
    ],
  },
  {
    id: 'post-4',
    creatorId: 'tripper-rohit',
    creatorName: 'Rohit Kulkarni',
    creatorHandle: '@rohit_escapes',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Switzerland',
    locationTag: 'Gornergrat & Matterhorn, Zermatt',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Took the cogwheel train up to Gornergrat at 3,089 meters. Looking straight at the iconic pyramid of the Matterhorn mirroring in the alpine tarn. Every Swiss Franc spent on the Swiss Travel Pass pays off on views like this. 🇨🇭🏔️',
    hashtags: ['#Switzerland', '#Matterhorn', '#Zermatt', '#SwissAlps', '#TripYeahGlobal'],
    likesCount: 3120,
    commentsCount: 142,
    sharesCount: 420,
    postedAt: '12 hours ago',
    isLiked: false,
    isSaved: false,
    isTripping: false,
    tripPlanDestination: 'Switzerland',
    itineraryHighlights: ['Gornergrat cogwheel railway', 'Lake Riffelsee reflection', 'Glacier Paradise ice palace'],
    tripCostEstimateInr: 88000,
    comments: [
      {
        id: 'c5',
        authorName: 'Alia Khan',
        authorHandle: '@alia_wanders',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        text: 'The reflection of Matterhorn in Lake Riffelsee is insane. How cold was it at the summit?',
        timeAgo: '9h ago',
        likes: 22,
      },
    ],
  },
  {
    id: 'post-5',
    creatorId: 'tripper-kabir',
    creatorName: 'Kabir & Meera',
    creatorHandle: '@thehimalayanpair',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Manali, India',
    locationTag: 'Solang Valley & Atal Tunnel North Portal',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1510414842594-a61752a33f10?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Drive through Atal Tunnel and the world transforms from pine forests into the stark, dramatic lunar snowscapes of Sissu and Lahaul Valley. Stop by the frozen waterfall for hot roadside Siddu and masala chai. ❄️☕',
    hashtags: ['#Manali', '#AtalTunnel', '#LahaulValley', '#Himachal', '#RoadTrips'],
    likesCount: 2210,
    commentsCount: 94,
    sharesCount: 198,
    postedAt: '1 day ago',
    isLiked: false,
    isSaved: false,
    isTripping: true,
    tripPlanDestination: 'Manali',
    itineraryHighlights: ['Atal Tunnel to Sissu Waterfall', 'Old Manali cafe hopping', 'Jogini Falls trek'],
    tripCostEstimateInr: 16500,
    comments: [],
  },
  {
    id: 'post-6',
    creatorId: 'tripper-rohit',
    creatorName: 'Rohit Kulkarni',
    creatorHandle: '@rohit_escapes',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Dubai, UAE',
    locationTag: 'Dubai Marina & Ain Dubai Sunset',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'Golden hour hitting the glass towers of Dubai Marina while mega-yachts cruise into the Persian Gulf. You can feel the pulsating energy of modern architecture and futuristic ambitions here like nowhere else. 🏙️✨',
    hashtags: ['#DubaiMarina', '#VisitDubai', '#SkylinePhotography', '#TripYeah'],
    likesCount: 2680,
    commentsCount: 104,
    sharesCount: 245,
    postedAt: '1 day ago',
    isLiked: false,
    isSaved: false,
    isTripping: false,
    tripPlanDestination: 'Dubai',
    itineraryHighlights: ['Dubai Marina private yacht sunset', 'Museum of the Future tour', 'Desert safari dune bashing'],
    tripCostEstimateInr: 45000,
    comments: [],
  },
  {
    id: 'post-7',
    creatorId: 'tripper-aanya',
    creatorName: 'Aanya Sen',
    creatorHandle: '@aanya_wanders',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    destination: 'Japan',
    locationTag: 'Arashiyama Bamboo Grove & Tenryu-ji, Kyoto',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
    aspectRatio: 'landscape',
    caption: 'The way the morning wind rustles through thousands of towering green bamboo stalks in Kyoto. Walking here in silence gives you an instant sense of Zen. Don’t miss the matcha soft-serve right outside the northern gate! 🎋🍵',
    hashtags: ['#Kyoto', '#JapanTravel', '#Arashiyama', '#ZenMoments', '#TripYeah'],
    likesCount: 3890,
    commentsCount: 210,
    sharesCount: 512,
    postedAt: '2 days ago',
    isLiked: false,
    isSaved: false,
    isTripping: false,
    tripPlanDestination: 'Japan',
    itineraryHighlights: ['Early morning Arashiyama walk', 'Fushimi Inari vermilion shrines', 'Gion historic lantern district'],
    tripCostEstimateInr: 65000,
    comments: [],
  },
];

const INITIAL_REELS: TripReel[] = [
  {
    id: 'reel-1',
    creatorId: 'tripper-aanya',
    creatorName: 'Aanya Sen',
    creatorHandle: '@aanya_wanders',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    title: 'Top 3 Secret Beach Caves in South Goa You Never Knew Existed 🐚',
    destination: 'Goa',
    locationTag: 'Butterfly Beach & Cola Lagoon, South Goa',
    videoThumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85',
    audioTrack: 'Original Audio - @aanya_wanders · Coastal Ambient Chill',
    viewsCount: '124K',
    likesCount: 8420,
    commentsCount: 412,
    caption: 'Save this for your next Goa escape! 3 secret spots where freshwater lagoons meet turquoise waves without any crowd. Book scooters in advance! 🌊🌴',
    tags: ['#GoaBeaches', '#HiddenGoa', '#TripReels', '#TravelGuide'],
    isLiked: false,
    isSaved: false,
    isTripping: false,
  },
  {
    id: 'reel-2',
    creatorId: 'tripper-zayan',
    creatorName: 'Zayan Mir',
    creatorHandle: '@kashmir_unfiltered',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    title: 'Sunrise Shikara Ride on Dal Lake at -4°C 🛶❄️',
    destination: 'Kashmir',
    locationTag: 'Dal Lake Floating Flower Market, Srinagar',
    videoThumbnail: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=85',
    audioTrack: 'Kashmiri Sitar & Flute Harmonics · Traditional Folk',
    viewsCount: '286K',
    likesCount: 19400,
    commentsCount: 924,
    caption: 'Waking up before dawn in a wooden houseboat. Sipping hot Kahwa with crushed saffron and almonds while the mist clears over Shankaracharya hill.',
    tags: ['#KashmirDiaries', '#DalLake', '#TripReels', '#WinterWonderland'],
    isLiked: true,
    isSaved: true,
    isTripping: true,
  },
  {
    id: 'reel-3',
    creatorId: 'tripper-rohit',
    creatorName: 'Rohit Kulkarni',
    creatorHandle: '@rohit_escapes',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    title: 'Riding the Glacier Express Panorama Train across Swiss Viaducts 🚂🏔️',
    destination: 'Switzerland',
    locationTag: 'Landwasser Viaduct & Oberalp Pass, Switzerland',
    videoThumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=85',
    audioTrack: 'Cinematic Travel Strings · Alpine Horizons',
    viewsCount: '342K',
    likesCount: 24100,
    commentsCount: 1210,
    caption: 'The slowest express train in the world, and every single second through these massive glass ceilings feels like an IMAX documentary in real life.',
    tags: ['#SwitzerlandTrain', '#GlacierExpress', '#SwissAlps', '#TripReels'],
    isLiked: false,
    isSaved: false,
    isTripping: false,
  },
  {
    id: 'reel-4',
    creatorId: 'tripper-kabir',
    creatorName: 'Kabir & Meera',
    creatorHandle: '@thehimalayanpair',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    title: 'Hidden Igloo Stay & Stargazing in Sethan, Manali 🌌⛺',
    destination: 'Manali',
    locationTag: 'Sethan Valley, Hampta Pass Road',
    videoThumbnail: 'https://images.unsplash.com/photo-1510414842594-a61752a33f10?auto=format&fit=crop&w=800&q=85',
    audioTrack: 'Acoustic Guitar Nomad · Mountain Echoes',
    viewsCount: '198K',
    likesCount: 14800,
    commentsCount: 630,
    caption: 'Did you know you can stay inside actual sculpted ice igloos just 45 minutes above Manali? Sleeping under sheepskin blankets with the Milky Way above.',
    tags: ['#ManaliIgloo', '#Sethan', '#WinterCamp', '#TripReels'],
    isLiked: false,
    isSaved: false,
    isTripping: true,
  },
  {
    id: 'reel-5',
    creatorId: 'tripper-aanya',
    creatorName: 'Aanya Sen',
    creatorHandle: '@aanya_wanders',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    title: 'Floating Breakfast at 7 AM in Ubud Private Pool Villa 🌺🥞',
    destination: 'Bali',
    locationTag: 'Ayung River Valley, Ubud, Bali',
    videoThumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
    audioTrack: 'Tropical Sunset Beats · Balinese Breeze',
    viewsCount: '410K',
    likesCount: 31200,
    commentsCount: 1480,
    caption: 'Is the floating breakfast cliché? Yes. Is it 100% worth waking up for in a jungle infinity pool overlooking the mist? Absolutely yes.',
    tags: ['#BaliVilla', '#FloatingBreakfast', '#UbudLuxury', '#TripReels'],
    isLiked: false,
    isSaved: false,
    isTripping: false,
  },
];

const DESTINATIONS_EXPLORE = [
  {
    id: 'dest-goa',
    name: 'Goa',
    tagline: 'Sun-drenched beaches, Portuguese villas & cliff cafes',
    category: 'Coastal & Nightlife',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '420+ Trippers active',
    startingPriceInr: 6499,
    badge: 'Popular Weekend',
  },
  {
    id: 'dest-manali',
    name: 'Manali',
    tagline: 'Snow-capped peaks, pine valleys & cozy wooden cafes',
    category: 'Adventure & Snow',
    image: 'https://images.unsplash.com/photo-1510414842594-a61752a33f10?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '310+ Trippers active',
    startingPriceInr: 8200,
    badge: 'Trending Now',
  },
  {
    id: 'dest-kashmir',
    name: 'Kashmir',
    tagline: 'Paradise on earth: Gulmarg powder & Dal Lake Shikaras',
    category: 'Alpine Paradise',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '280+ Trippers active',
    startingPriceInr: 12999,
    badge: 'Must Visit 2026',
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    tagline: 'Emerald rice terraces, spiritual temples & cliff clubs',
    category: 'International Tropical',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '580+ Trippers active',
    startingPriceInr: 28500,
    badge: 'Global Favorite',
  },
  {
    id: 'dest-japan',
    name: 'Japan',
    tagline: 'Cherry blossoms, Shinto shrines & Tokyo neon skyline',
    category: 'Culture & Modern',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '190+ Trippers active',
    startingPriceInr: 48000,
    badge: 'Iconic Journey',
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    tagline: 'Futuristic skyscrapers, red desert dunes & luxury marinas',
    category: 'Modern Luxury',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '340+ Trippers active',
    startingPriceInr: 22000,
    badge: 'Express Visa',
  },
  {
    id: 'dest-switzerland',
    name: 'Switzerland',
    tagline: 'Matterhorn reflections, scenic rail & turquoise alpine lakes',
    category: 'Alps & Scenic Rail',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    creatorsCount: '230+ Trippers active',
    startingPriceInr: 58000,
    badge: 'Bucket List',
  },
];

export interface HeroCreatorSlide {
  url: string;
  creator: string;
  location: string;
  tag: string;
}

export const TAB_CREATOR_SLIDES: Record<CommunityTab, HeroCreatorSlide[]> = {
  'for-you': [
    {
      url: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=2400&q=90',
      creator: '@aanya_wanders',
      location: 'Goreme Hot Air Balloons, Cappadocia',
      tag: 'Sunrise Balloon Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2400&q=90',
      creator: '@tanya_goavibes',
      location: 'Positano Cliffside Overlook, Amalfi Coast',
      tag: 'Mediterranean Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2400&q=90',
      creator: '@aanya_wanders',
      location: 'Tegalalang Emerald Terrace, Bali',
      tag: 'Sunbeam Jungle Photoshoot',
    },
  ],
  'explore': [
    {
      url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=90',
      creator: '@rohit_escapes',
      location: 'Lake Oeschinen Alpine Pier, Switzerland',
      tag: 'Turquoise Lake Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1570077188670-b375b48624d6?auto=format&fit=crop&w=2400&q=90',
      creator: '@aanya_wanders',
      location: 'Oia Blue Dome Caldera, Santorini',
      tag: 'Sunset Scenery Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=90',
      creator: '@rohit_escapes',
      location: 'Al Badayer Golden Desert Dunes, Dubai',
      tag: 'Desert Safari Golden Hour',
    },
    {
      url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
      creator: '@kashmir_unfiltered',
      location: 'Gulmarg Pine Valley Snowline, Kashmir',
      tag: 'Himalayan Scenery Photoshoot',
    },
  ],
  'trip-reels': [
    {
      url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=90',
      creator: '@aanya_wanders',
      location: 'South Ari Lagoon Overwater Boardwalk, Maldives',
      tag: 'Turquoise Coral Video Reel',
    },
    {
      url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
      creator: '@tanya_goavibes',
      location: 'Palolem Beach Sunset Palms, South Goa',
      tag: 'Golden Wave Video Reel',
    },
    {
      url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      creator: '@thehimalayanpair',
      location: 'Solang Valley Snowy Pines, Manali',
      tag: 'Winter Adventure Reel',
    },
  ],
  'trippers': [
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
      creator: 'TripYeah Trippers Collective',
      location: 'Val di Funes Alpine Ridge, Dolomites',
      tag: 'Mountain Creator Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=90',
      creator: 'Wanderer Nomads Club',
      location: 'Kelingking T-Rex Cliff, Nusa Penida',
      tag: 'Ocean Ridge Expedition',
    },
    {
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=90',
      creator: 'Global Trippers Society',
      location: 'Tokyo City Lights & Mt. Fuji Skyline, Japan',
      tag: 'City Scenery Photoshoot',
    },
  ],
  'my-profile': [
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=90',
      creator: '@tripyeah_creator',
      location: 'Grand Alpine Crest & Scenic Overlook',
      tag: 'Summit Horizon Photoshoot',
    },
    {
      url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2400&q=90',
      creator: '@tripyeah_creator',
      location: 'Lake Louise Emerald Glacier Waters, Canada',
      tag: 'Canoe Expedition Photoshoot',
    },
  ],
  'creator-hub': [
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=90',
      creator: 'Grand Azure Lagoon & Partner Resorts',
      location: 'Overwater Luxury Bungalow, Maldives',
      tag: 'Sponsored Brand Retreat',
    },
    {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=90',
      creator: 'TripYeah Brand Collective',
      location: 'Oceanfront Glass Edge Cliff Villa, Bali',
      tag: 'Creator Residency Program',
    },
  ],
};

export const InfluencersPage: React.FC<InfluencersPageProps> = ({
  onBackToHome,
  currency,
  onNotify,
  onOpenExplore,
  onPlanTrip,
  userName,
}) => {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<CommunityTab>('for-you');

  // Slideshow state driven by activeTab
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);

  // When activeTab changes, reset slideIndex to 0
  useEffect(() => {
    setHeroSlideIndex(0);
  }, [activeTab]);

  // Auto-advance slideshow every 4.5 seconds
  useEffect(() => {
    const currentSlides = TAB_CREATOR_SLIDES[activeTab] || TAB_CREATOR_SLIDES['for-you'];
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % currentSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeTab]);

  // Current tab slides & active slide helper
  const currentTabSlides = useMemo(() => {
    return TAB_CREATOR_SLIDES[activeTab] || TAB_CREATOR_SLIDES['for-you'];
  }, [activeTab]);

  const activeSlide = useMemo(() => {
    return currentTabSlides[heroSlideIndex % currentTabSlides.length] || currentTabSlides[0];
  }, [currentTabSlides, heroSlideIndex]);

  // Posts and Reels data state
  const [posts, setPosts] = useState<TravelPost[]>(INITIAL_POSTS);
  const [reels, setReels] = useState<TripReel[]>(INITIAL_REELS);
  const [trippers, setTrippers] = useState<TripperProfile[]>(INITIAL_TRIPPERS);

  // Active creator profile modal state (when inspecting a tripper)
  const [selectedTripper, setSelectedTripper] = useState<TripperProfile | null>(null);

  // Create content modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createContentType, setCreateContentType] = useState<
    'photo' | 'video' | 'reel' | 'story' | 'guide' | 'itinerary'
  >('photo');

  // Create Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>('');
  const [newDestination, setNewDestination] = useState<string>('Goa');
  const [newLocationTag, setNewLocationTag] = useState<string>('');
  const [newHashtags, setNewHashtags] = useState<string>('#TripYeah #TravelGram');
  const [selectedMediaPreset, setSelectedMediaPreset] = useState<string>(
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85'
  );
  const [customMediaUrl, setCustomMediaUrl] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Comments modal state
  const [activeCommentsPost, setActiveCommentsPost] = useState<TravelPost | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Destination Preview Modal State
  const [previewDestination, setPreviewDestination] = useState<any | null>(null);

  // Collaboration Inquiry Modal State
  const [collabTargetTripper, setCollabTargetTripper] = useState<TripperProfile | null>(null);
  const [collabBrandName, setCollabBrandName] = useState<string>('');
  const [collabEmail, setCollabEmail] = useState<string>('');
  const [collabDetails, setCollabDetails] = useState<string>('');
  const [collabSuccess, setCollabSuccess] = useState<boolean>(false);

  // Search & Filter State in Explore tab
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Reels interactive video playing state
  const [playingReelId, setPlayingReelId] = useState<string | null>('reel-1');
  const [isReelMuted, setIsReelMuted] = useState<boolean>(true);

  // User's own Tripper Profile
  const myProfile: TripperProfile = useMemo(
    () => ({
      id: 'my-tripper-profile',
      name: userName || 'Rahul Sharma',
      handle: userName ? `@${userName.toLowerCase().replace(/\s+/g, '_')}` : '@rahul_travels',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      bio: 'Wanderer & creator on TripYeah. Documenting hidden beach cliffs, high mountain passes & boutique stays.',
      niche: 'Travel Photography & Itineraries',
      badges: ['Verified Tripper', 'Early Creator'],
      location: 'New Delhi, India',
      trippersCount: '12.5K',
      trippingCount: 486,
      travelPostsCount: posts.filter((p) => p.creatorId === 'my-tripper-profile').length + 8,
      favouriteDestinations: ['Goa', 'Kashmir', 'Manali', 'Bali', 'Switzerland'],
      travelInterests: ['Backpacking', 'Drone Video', 'Food Trails', 'Solo Journeys'],
      isTripping: false,
      collaborationRate: '₹25,000 / Collab Post',
      gearUsed: ['Sony A7C II', 'DJI Osmo Pocket 3'],
    }),
    [userName, posts]
  );

  // Interactive like handler
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  // Interactive save/bookmark handler
  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isSaved = !post.isSaved;
          if (isSaved) {
            onNotify('Saved to Tripper Board', `Post saved to your personal travel collection.`, 'success');
          }
          return { ...post, isSaved };
        }
        return post;
      })
    );
  };

  // Interactive follow / tripping handler
  const handleToggleTripping = (creatorId: string) => {
    // Update posts
    setPosts((prev) =>
      prev.map((p) => {
        if (p.creatorId === creatorId) {
          return { ...p, isTripping: !p.isTripping };
        }
        return p;
      })
    );

    // Update trippers
    setTrippers((prev) =>
      prev.map((t) => {
        if (t.id === creatorId) {
          const isNowTripping = !t.isTripping;
          onNotify(
            isNowTripping ? 'Now Tripping' : 'Unfollowed Tripper',
            isNowTripping
              ? `You are now Tripping with ${t.name} (${t.handle}). You'll see their travel posts first!`
              : `Removed ${t.name} from your Tripping list.`,
            'info'
          );
          return { ...t, isTripping: isNowTripping };
        }
        return t;
      })
    );

    if (selectedTripper && selectedTripper.id === creatorId) {
      setSelectedTripper((prev) => (prev ? { ...prev, isTripping: !prev.isTripping } : null));
    }
  };

  // Reel Like toggle
  const handleToggleReelLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  // Share action
  const handleSharePost = (post: TravelPost) => {
    const url = `${window.location.origin}/influencers?post=${post.id}`;
    try {
      navigator.clipboard.writeText(url);
      onNotify('Link Copied to Clipboard', `Share ${post.creatorHandle}'s travel post from ${post.destination}!`, 'success');
    } catch {
      onNotify('Travel Post Shared', `Shared ${post.creatorHandle}'s post with your Tripper community!`, 'info');
    }
  };

  // Submit comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsPost) return;

    const newComment: TravelPostComment = {
      id: `c-${Date.now()}`,
      authorName: userName || 'Rahul Sharma',
      authorHandle: myProfile.handle,
      avatar: myProfile.avatar,
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === activeCommentsPost.id) {
          const updated = {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
          setActiveCommentsPost(updated);
          return updated;
        }
        return p;
      })
    );

    setNewCommentText('');
    onNotify('Comment Published', 'Your travel insight has been added to the discussion.', 'success');
  };

  // Handle Publish New Content
  const handlePublishContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) {
      onNotify('Missing Caption', 'Please write a short caption or travel story before publishing.', 'info');
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      const media = customMediaUrl.trim() || selectedMediaPreset;

      const newPost: TravelPost = {
        id: `post-${Date.now()}`,
        creatorId: myProfile.id,
        creatorName: myProfile.name,
        creatorHandle: myProfile.handle,
        creatorAvatar: myProfile.avatar,
        isVerified: true,
        destination: newDestination,
        locationTag: newLocationTag.trim() || `${newDestination} Scenic Viewpoint`,
        mediaType: createContentType === 'reel' || createContentType === 'video' ? 'video' : 'image',
        mediaUrl: media,
        aspectRatio: createContentType === 'reel' ? 'portrait' : 'landscape',
        caption: newCaption.trim(),
        hashtags: newHashtags
          .split(' ')
          .filter((t) => t.startsWith('#'))
          .slice(0, 5),
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        postedAt: 'Just now',
        isLiked: true,
        isSaved: false,
        isTripping: false,
        tripPlanDestination: newDestination,
        itineraryHighlights: [`Explore ${newDestination} highlights`, 'Local food tasting', 'Sunset viewpoint'],
        tripCostEstimateInr: 18500,
        comments: [],
      };

      setPosts((prev) => [newPost, ...prev]);

      // If reel was created, also add to Trip Reels
      if (createContentType === 'reel') {
        const newReel: TripReel = {
          id: `reel-${Date.now()}`,
          creatorId: myProfile.id,
          creatorName: myProfile.name,
          creatorHandle: myProfile.handle,
          creatorAvatar: myProfile.avatar,
          isVerified: true,
          title: newTitle.trim() || `Exploring ${newDestination}`,
          destination: newDestination,
          locationTag: newLocationTag.trim() || newDestination,
          videoThumbnail: media,
          audioTrack: `Original Audio - ${myProfile.handle} · Travel Vibes`,
          viewsCount: '1',
          likesCount: 1,
          commentsCount: 0,
          caption: newCaption.trim(),
          tags: newPost.hashtags,
          isLiked: true,
          isSaved: false,
          isTripping: false,
        };
        setReels((prev) => [newReel, ...prev]);
      }

      setShowCreateModal(false);
      setNewTitle('');
      setNewCaption('');
      setNewLocationTag('');
      setCustomMediaUrl('');
      setActiveTab('for-you');

      onNotify(
        'Published to Session Feed! (Demo Mode)',
        `Your Travel Post for ${newDestination} is now live in the community feed.`,
        'success'
      );
    }, 600);
  };

  // Handle Collaboration Form Submit
  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabBrandName.trim() || !collabEmail.trim()) {
      onNotify('Incomplete Details', 'Please fill in your company/brand name and contact email.', 'info');
      return;
    }

    setCollabSuccess(true);
    onNotify(
      'Inquiry Dispatched',
      `Collaboration request sent to ${collabTargetTripper?.name} (${collabTargetTripper?.handle}). They will reply to ${collabEmail}.`,
      'success'
    );
  };

  // Filtered explore posts
  const filteredExplorePosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creatorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategoryFilter === 'All' ||
        (selectedCategoryFilter === 'Hidden Gems' && (p.destination.includes('Goa') || p.destination.includes('Kashmir'))) ||
        (selectedCategoryFilter === 'Budget Trips' && (p.tripCostEstimateInr || 0) < 20000) ||
        (selectedCategoryFilter === 'Solo Travel' && (p.caption.toLowerCase().includes('solo') || p.creatorId === 'tripper-aanya')) ||
        (selectedCategoryFilter === 'Adventure Travel' && (p.destination.includes('Manali') || p.destination.includes('Kashmir'))) ||
        (selectedCategoryFilter === 'International Destinations' &&
          (p.destination.includes('Bali') || p.destination.includes('Japan') || p.destination.includes('Dubai') || p.destination.includes('Switzerland')));

      return matchSearch && matchCategory;
    });
  }, [posts, searchQuery, selectedCategoryFilter]);

  // Handle plan trip action: routes to existing TripYeah travel-planning features
  const handlePlanThisTrip = (destinationName: string) => {
    if (onPlanTrip) {
      onPlanTrip(destinationName);
    } else {
      onNotify(
        `Planning ${destinationName} Trip`,
        `Opening TripYeah travel booking desk with curated flights and stays for ${destinationName}.`,
        'success'
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* 1. TOP COMMUNITY BANNER — Content Creators Slideshow & Immersive Scrim */}
      <section className="relative w-full text-white pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Dynamic Slideshow Backgrounds with Cross-fade */}
        <div className="absolute inset-0 pointer-events-none">
          {currentTabSlides.map((slide, idx) => (
            <div
              key={`${activeTab}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === (heroSlideIndex % currentTabSlides.length) ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <SafeImage
                src={slide.url}
                alt={`${slide.creator} at ${slide.location}`}
                className="w-full h-full object-cover object-center scale-100 brightness-[1.08] contrast-[1.05] saturate-[1.12] transition-transform duration-[9000ms] ease-out"
              />
            </div>
          ))}

          {/* Minimal top scrim: leaves the center scenery crystal-clear, bright, and vibrant while giving subtle contrast for the top header */}
          <div className="absolute inset-0 z-2 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-transparent" />

          {/* Subtle horizontal gradient to ensure creator headlines are crisp without dimming the photo */}
          <div className="absolute inset-y-0 left-0 z-2 w-full max-w-xl bg-gradient-to-r from-slate-950/45 via-slate-950/15 to-transparent" />

          {/* Bottom feathering: Multi-step seamless dissolve + delicate ambient shadow (no harsh cut lines) */}
          <div className="absolute inset-x-0 bottom-0 z-3 h-36 sm:h-52 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 via-[#F8FAFC]/40 via-[#F8FAFC]/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 z-3 h-16 pointer-events-none shadow-[0_30px_50px_-15px_rgba(15,23,42,0.10)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Row: Back button, Logo badge, Slide Attribution Pill & Create Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
              >
                <span>← Back to Bookings</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-white/20 text-sky-300 text-xs font-bold tracking-wide backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>TripYeah Creator Community</span>
              </div>

              {/* Creator Attribution Tag for currently active slide */}
              {activeSlide && (
                <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-white/20 text-slate-100 text-[11px] font-medium backdrop-blur-md shadow-md">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold text-white">{activeSlide.creator}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-slate-200">{activeSlide.location}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-sky-300 text-[10px] font-bold uppercase">{activeSlide.tag}</span>
                </div>
              )}
            </div>

            {/* Right Side: Slide Dots Indicator & Quick Action Create Button */}
            <div className="flex items-center gap-2.5">
              {/* Slide Dots Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 border border-white/20 backdrop-blur-md shadow-md">
                {currentTabSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === (heroSlideIndex % currentTabSlides.length) ? 'w-4 bg-sky-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('creator-hub')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer backdrop-blur-md ${
                  activeTab === 'creator-hub'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-xs'
                    : 'bg-slate-950/60 hover:bg-slate-900 text-slate-200 border-white/15'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Creator Hub</span>
                <span className="text-[10px] bg-amber-400/25 text-amber-300 px-1.5 py-0.2 rounded font-mono">Perks</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-blue-400/40"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Hero Headline & Community Bio */}
          <div className="max-w-2xl mb-8">
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Discover Trips Through{' '}
              <span className="bg-gradient-to-r from-sky-300 via-white to-blue-200 bg-clip-text text-transparent">
                Travel Creators
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] max-w-xl">
              Explore authentic travel stories, watch Trip Reels, connect with top Trippers, and plan your next journey directly from real creator itineraries.
            </p>
          </div>

          {/* Trippers Community Stats Bar - Frosted Glass Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/55 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <span className="text-slate-300 block text-[11px] font-medium">Active Trippers</span>
              <span className="font-display text-base sm:text-lg font-bold text-white font-mono-tabular">5,840+</span>
            </div>
            <div className="bg-slate-950/55 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <span className="text-slate-300 block text-[11px] font-medium">Destinations Tagged</span>
              <span className="font-display text-base sm:text-lg font-bold text-sky-300 font-mono-tabular">140+ Worldwide</span>
            </div>
            <div className="bg-slate-950/55 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <span className="text-slate-300 block text-[11px] font-medium">Trip Reels Watched</span>
              <span className="font-display text-base sm:text-lg font-bold text-amber-300 font-mono-tabular">1.2M+ Views</span>
            </div>
            <div className="bg-slate-950/55 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <span className="text-slate-300 block text-[11px] font-medium">Tripper Partner Perks</span>
              <span className="font-display text-base sm:text-lg font-bold text-emerald-300 font-mono-tabular">Free Stays &amp; Flights</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PAGE NAVIGATION TABS — For You, Explore, Trip Reels, Trippers, My Profile */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4 py-2.5">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Tab 1: For You */}
              <button
                type="button"
                onClick={() => setActiveTab('for-you')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'for-you'
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>For You</span>
              </button>

              {/* Tab 2: Explore */}
              <button
                type="button"
                onClick={() => setActiveTab('explore')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Explore</span>
              </button>

              {/* Tab 3: Trip Reels */}
              <button
                type="button"
                onClick={() => setActiveTab('trip-reels')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'trip-reels'
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Film className="w-4 h-4 text-purple-600" />
                <span>Trip Reels</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">Shorts</span>
              </button>

              {/* Tab 4: Trippers */}
              <button
                type="button"
                onClick={() => setActiveTab('trippers')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'trippers'
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Trippers</span>
              </button>

              {/* Tab 5: My Profile */}
              <button
                type="button"
                onClick={() => setActiveTab('my-profile')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'my-profile'
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>
            </div>

            {/* Quick Upload Button in Tab Bar */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              title="Create & Upload Content"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================================= */}
        {/* TAB 1: FOR YOU — SCROLLABLE SOCIAL TRAVEL FEED */}
        {/* ========================================================================= */}
        {activeTab === 'for-you' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center Main Social Feed */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Stories / Creators Highlights Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-4 min-w-max">
                  {/* Current User Story bubble */}
                  <div
                    onClick={() => setShowCreateModal(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-full p-0.5 border-2 border-dashed border-blue-500 flex items-center justify-center bg-blue-50/50 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <SafeImage
                          src={myProfile.avatar}
                          alt={myProfile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                        +
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[68px]">Your Story</span>
                  </div>

                  {/* Other Tripper highlights */}
                  {trippers.map((tripper) => (
                    <div
                      key={tripper.id}
                      onClick={() => setSelectedTripper(tripper)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-blue-600 group-hover:scale-105 transition-transform shadow-xs">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                          <SafeImage
                            src={tripper.avatar}
                            alt={tripper.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[70px]">
                        {tripper.handle.replace('@', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Posts List */}
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Post Header: Creator Info & Follow/Tripping button */}
                  <div className="p-4 sm:px-5 flex items-center justify-between gap-3">
                    <div
                      onClick={() => {
                        const matched = trippers.find((t) => t.id === post.creatorId);
                        if (matched) setSelectedTripper(matched);
                        else if (post.creatorId === myProfile.id) setActiveTab('my-profile');
                      }}
                      className="flex items-center gap-3 cursor-pointer group min-w-0"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <SafeImage
                          src={post.creatorAvatar}
                          alt={post.creatorName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {post.creatorName}
                          </span>
                          {post.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                          <span>{post.creatorHandle}</span>
                          <span>•</span>
                          <span className="text-slate-400">{post.postedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Destination Tag & Follow Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[150px]">{post.destination}</span>
                      </div>

                      {post.creatorId !== myProfile.id && (
                        <button
                          type="button"
                          onClick={() => handleToggleTripping(post.creatorId)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            post.isTripping
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {post.isTripping ? '✓ Tripping' : '+ Trippers'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Media: Photo or Video display */}
                  <div className="relative w-full bg-slate-950 overflow-hidden">
                    <SafeImage
                      src={post.mediaUrl}
                      alt={`${post.creatorName} in ${post.destination}`}
                      className="w-full max-h-[520px] object-cover object-center"
                    />

                    {/* Location Badge on Image */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{post.locationTag}</span>
                    </div>

                    {/* If video/reel indicator */}
                    {post.mediaType === 'video' && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 text-white text-[11px] font-mono flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <span>Trip Reel</span>
                      </div>
                    )}
                  </div>

                  {/* Post Actions Bar: Like, Comment, Share, Save & Trip Planner CTA */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Social Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            post.isLiked ? 'text-rose-600' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 transition-transform active:scale-125 ${
                              post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{post.likesCount.toLocaleString()}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveCommentsPost(post)}
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.commentsCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSharePost(post)}
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Share Travel Post"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>

                      {/* Right: Save Bookmark & Plan Trip Action */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSave(post.id)}
                          className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${
                            post.isSaved ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
                          }`}
                          title="Save Post"
                        >
                          <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Post Caption & Hashtags */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 mr-1.5">{post.creatorHandle}</span>
                      <span>{post.caption}</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {post.hashtags.map((h, i) => (
                          <span
                            key={i}
                            onClick={() => {
                              setSearchQuery(h);
                              setActiveTab('explore');
                            }}
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comments preview snippet if any */}
                    {post.comments.length > 0 && (
                      <div
                        onClick={() => setActiveCommentsPost(post)}
                        className="pt-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <span>
                          View all {post.comments.length} comments... (Latest by {post.comments[0].authorHandle})
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* TripYeah Integration Bar: Explore Destination & Plan This Trip */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/80 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3.5 rounded-b-3xl">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          TY
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Featured Itinerary: {post.destination}</span>
                            {post.tripCostEstimateInr && (
                              <span className="font-mono text-emerald-600 font-semibold text-[11px]">
                                (~{formatPrice(post.tripCostEstimateInr, currency)})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Book verified flights, hotels &amp; activities recommended by {post.creatorName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {/* Explore Destination Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const found = DESTINATIONS_EXPLORE.find((d) =>
                              d.name.toLowerCase().includes(post.tripPlanDestination.toLowerCase())
                            );
                            setPreviewDestination(
                              found || {
                                name: post.destination,
                                tagline: `Curated creator journey in ${post.destination}`,
                                category: 'TripYeah Destination',
                                startingPriceInr: post.tripCostEstimateInr || 15000,
                                image: post.mediaUrl,
                                highlights: post.itineraryHighlights || ['Scenic landmarks', 'Curated stays', 'Local cuisine'],
                              }
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Explore Destination
                        </button>

                        {/* Plan This Trip Button (Connected to TripYeah engine) */}
                        <button
                          type="button"
                          onClick={() => handlePlanThisTrip(post.tripPlanDestination)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <span>Plan This Trip</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Right Sidebar: Recommended Trippers & Trending Destinations */}
            <div className="lg:col-span-4 space-y-6">
              {/* Creator Card: My Profile Preview */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <SafeImage src={myProfile.avatar} alt={myProfile.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                      <span>{myProfile.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{myProfile.handle}</p>
                    <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                      {myProfile.niche}
                    </span>
                  </div>
                </div>

                {/* Unique Statistics: Trippers | Tripping | Travel Posts */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center mb-3">
                  <div>
                    <span className="font-display font-bold text-slate-900 text-sm block">{myProfile.trippersCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Trippers</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-slate-900 text-sm block">{myProfile.trippingCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Tripping</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-slate-900 text-sm block">{myProfile.travelPostsCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Travel Posts</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-profile')}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    View Tripper Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* Recommended Travel Creators (Trippers to Follow) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-slate-900 text-sm">Suggested Trippers</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('trippers')}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    See All
                  </button>
                </div>

                <div className="space-y-3.5">
                  {trippers.slice(0, 4).map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3">
                      <div
                        onClick={() => setSelectedTripper(t)}
                        className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                          <SafeImage src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate flex items-center gap-1">
                            <span>{t.name}</span>
                            {t.isVerified && <CheckCircle2 className="w-3 h-3 text-blue-600 fill-blue-50" />}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{t.handle}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{t.trippersCount} Trippers</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleTripping(t.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          t.isTripping
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600'
                        }`}
                      >
                        {t.isTripping ? 'Tripping' : '+ Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Destinations Quick Box */}
              <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider text-sky-300 uppercase">Trending Hubs</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2">Plan from Creator Hotspots</h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Goa beach villas, Manali snow trails, Kashmir Shikaras &amp; Bali jungle retreats trending this week.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Goa', 'Manali', 'Kashmir', 'Bali', 'Switzerland', 'Dubai', 'Japan'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handlePlanThisTrip(d)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 transition-colors cursor-pointer"
                    >
                      {d} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EXPLORE — DESTINATIONS, CREATORS & TRAVEL INSPIRATION */}
        {/* ========================================================================= */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            {/* Search Bar & Category Filters */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations (Goa, Manali, Bali, Japan), creators (@username), or hashtags..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {[
                  'All',
                  'Hidden Gems',
                  'Budget Trips',
                  'Solo Travel',
                  'Adventure Travel',
                  'International Destinations',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Destination Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    Popular Creator Destinations
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Vetted travel guides and verified creator recommendations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {DESTINATIONS_EXPLORE.map((dest) => (
                  <div
                    key={dest.id}
                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 bg-white flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <SafeImage
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        {dest.badge}
                      </span>
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <h3 className="font-display font-bold text-lg leading-tight">{dest.name}</h3>
                        <span className="text-[11px] text-sky-200">{dest.category}</span>
                      </div>
                    </div>

                    <div className="p-3.5 flex flex-col justify-between flex-1">
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{dest.tagline}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">From</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {formatPrice(dest.startingPriceInr, currency)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePlanThisTrip(dest.name)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Plan Trip</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Travel Posts Grid (Instagram Explore Style) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    Trending Travel Posts ({filteredExplorePosts.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    High-engagement photos &amp; guides captured by Trippers
                  </p>
                </div>
              </div>

              {filteredExplorePosts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 text-slate-500">
                  <Camera className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No travel posts matched your filter</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for "Goa", "Kashmir", "Bali", or resetting filters.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryFilter('All');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredExplorePosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setActiveCommentsPost(post)}
                      className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-200/70"
                    >
                      <SafeImage
                        src={post.mediaUrl}
                        alt={post.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Scrim Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent group-hover:bg-slate-950/60 transition-colors" />

                      {/* Top Location tag */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/65 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{post.destination}</span>
                      </div>

                      {/* Bottom Creator Info & Likes */}
                      <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate flex items-center gap-1">
                            <span>{post.creatorName}</span>
                            {post.isVerified && <CheckCircle2 className="w-3 h-3 text-sky-400" />}
                          </p>
                          <p className="text-[11px] text-slate-300 truncate mt-0.5 line-clamp-1">{post.caption}</p>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs font-bold font-mono shrink-0">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {post.commentsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRIP REELS — SHORT-FORM TRAVEL VIDEOS */}
        {/* ========================================================================= */}
        {activeTab === 'trip-reels' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center max-w-lg mx-auto mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                <Film className="w-3.5 h-3.5" />
                <span>Short-Form Travel Video Feed</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Trending Trip Reels
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Watch 15-second visual escapes and plan the itinerary with a single tap
              </p>
            </div>

            {/* Vertical Reels Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {reels.map((reel) => {
                const isPlaying = playingReelId === reel.id;
                return (
                  <div
                    key={reel.id}
                    className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-slate-950 shadow-xl border border-slate-800 flex flex-col justify-between group"
                  >
                    {/* Background Media Thumbnail */}
                    <SafeImage
                      src={reel.videoThumbnail}
                      alt={reel.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60 pointer-events-none" />

                    {/* Top Bar: Location & Audio Track */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[11px] truncate max-w-[120px]">{reel.destination}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsReelMuted(!isReelMuted)}
                        className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-900 cursor-pointer"
                        title={isReelMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {isReelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
                      </button>
                    </div>

                    {/* Center: Play/Pause Tap Button */}
                    <div className="relative z-10 self-center">
                      <button
                        type="button"
                        onClick={() => setPlayingReelId(isPlaying ? null : reel.id)}
                        className={`w-14 h-14 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer ${
                          isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-90 scale-100'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5 text-sky-300" />}
                      </button>
                    </div>

                    {/* Bottom Area: Creator info, Caption, Plan Trip & Reel Actions */}
                    <div className="relative z-10 p-4 text-white space-y-2.5">
                      {/* Creator Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          onClick={() => {
                            const found = trippers.find((t) => t.id === reel.creatorId);
                            if (found) setSelectedTripper(found);
                          }}
                          className="flex items-center gap-2 cursor-pointer group min-w-0"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shrink-0">
                            <SafeImage src={reel.creatorAvatar} alt={reel.creatorName} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold truncate group-hover:text-sky-300">{reel.creatorHandle}</span>
                        </div>

                        {reel.creatorId !== myProfile.id && (
                          <button
                            type="button"
                            onClick={() => handleToggleTripping(reel.creatorId)}
                            className="px-2.5 py-1 rounded-full bg-white/20 hover:bg-blue-600 text-white text-[11px] font-bold backdrop-blur-xs transition-colors cursor-pointer shrink-0"
                          >
                            {reel.isTripping ? 'Tripping' : '+ Trippers'}
                          </button>
                        )}
                      </div>

                      {/* Title & Caption */}
                      <p className="text-xs font-semibold line-clamp-2 leading-relaxed text-slate-100">
                        {reel.title}
                      </p>

                      {/* Audio Tag */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-300 truncate">
                        <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                        <span className="truncate">{reel.audioTrack}</span>
                      </div>

                      {/* Plan This Trip Action Button inside Reel */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlanThisTrip(reel.destination)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-900/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <span>Plan {reel.destination} Trip</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleReelLike(reel.id)}
                          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                          title="Like Trip Reel"
                        >
                          <Heart className={`w-4 h-4 ${reel.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TRIPPERS — DISCOVER & CONNECT WITH TRAVEL CREATORS */}
        {/* ========================================================================= */}
        {activeTab === 'trippers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Featured Travel Trippers
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Verified creators crafting guides for Goa, Kashmir, Manali, Bali, Japan &amp; the Swiss Alps
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Total Network:</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-mono">
                  {trippers.length + 120}+ Trippers
                </span>
              </div>
            </div>

            {/* Tripper Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trippers.map((tripper) => (
                <div
                  key={tripper.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Tripper Cover Image */}
                    <div className="relative h-28 w-full bg-slate-900">
                      <SafeImage
                        src={tripper.coverImage}
                        alt={`${tripper.name} cover`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-slate-950/70 text-white px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
                        {tripper.location}
                      </span>
                    </div>

                    {/* Avatar & Basic Info */}
                    <div className="p-5 pt-0 relative">
                      <div className="flex items-end justify-between -mt-9 mb-3">
                        <div className="w-18 h-18 rounded-full overflow-hidden border-3 border-white shadow-md bg-white">
                          <SafeImage src={tripper.avatar} alt={tripper.name} className="w-full h-full object-cover" />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleTripping(tripper.id)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            tripper.isTripping
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {tripper.isTripping ? '✓ Tripping' : '+ Trippers'}
                        </button>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-1.5">
                          <span>{tripper.name}</span>
                          {tripper.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{tripper.handle}</p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{tripper.bio}</p>
                      </div>

                      {/* Unique Terminology Statistics: Trippers | Tripping | Travel Posts */}
                      <div className="grid grid-cols-3 gap-1 py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs mb-3 font-mono-tabular">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{tripper.trippersCount}</span>
                          <span className="text-[10px] text-slate-400">Trippers</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{tripper.trippingCount}</span>
                          <span className="text-[10px] text-slate-400">Tripping</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{tripper.travelPostsCount}</span>
                          <span className="text-[10px] text-slate-400">Travel Posts</span>
                        </div>
                      </div>

                      {/* Favourite Destinations */}
                      <div className="mb-4">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Favorite Destinations
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tripper.favouriteDestinations.map((d, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Profile & Collab */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTripper(tripper)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCollabTargetTripper(tripper);
                        setCollabSuccess(false);
                      }}
                      className="py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Collaborate with Creator"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Collab</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MY PROFILE — USER CREATOR PROFILE & UPLOADED CONTENT */}
        {/* ========================================================================= */}
        {activeTab === 'my-profile' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Profile Cover & Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Cover Banner */}
              <div className="relative h-44 sm:h-56 w-full bg-slate-900">
                <SafeImage
                  src={myProfile.coverImage}
                  alt={myProfile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => onNotify('Cover Updated', 'Profile cover visual updated in current session.', 'info')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Edit Cover</span>
                </button>
              </div>

              {/* Profile Details Bar */}
              <div className="p-6 pt-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
                  <div className="flex items-end gap-3.5">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                      <SafeImage src={myProfile.avatar} alt={myProfile.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="mb-1">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{myProfile.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">{myProfile.handle}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(`${window.location.origin}/influencers?user=${myProfile.handle}`);
                          onNotify('Profile Link Copied', 'Your Tripper profile link is ready to share.', 'success');
                        } catch {}
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Post</span>
                    </button>
                  </div>
                </div>

                {/* Profile Bio & Interests */}
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed mb-4">
                  {myProfile.bio}
                </p>

                {/* Unique Statistics: Trippers | Tripping | Travel Posts */}
                <div className="flex flex-wrap items-center gap-6 py-3 border-y border-slate-100 text-xs text-slate-600 font-mono-tabular">
                  <div>
                    <strong className="font-bold text-slate-900 text-base">{myProfile.trippersCount}</strong>{' '}
                    <span className="text-slate-500">Trippers</span>
                  </div>
                  <div>
                    <strong className="font-bold text-slate-900 text-base">{myProfile.trippingCount}</strong>{' '}
                    <span className="text-slate-500">Tripping</span>
                  </div>
                  <div>
                    <strong className="font-bold text-slate-900 text-base">{myProfile.travelPostsCount}</strong>{' '}
                    <span className="text-slate-500">Travel Posts</span>
                  </div>
                </div>

                {/* Favourite Destinations Tags */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Favourite Destinations:</span>
                  {myProfile.favouriteDestinations.map((d, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* My Uploaded Content Grid */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    Uploaded Travel Posts ({posts.filter((p) => p.creatorId === myProfile.id).length})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  + Upload Content
                </button>
              </div>

              {posts.filter((p) => p.creatorId === myProfile.id).length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No Travel Posts Published Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Share your first travel photos, video story, or itinerary guide with the TripYeah community!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {posts
                    .filter((p) => p.creatorId === myProfile.id)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setActiveCommentsPost(post)}
                        className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-900 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <SafeImage src={post.mediaUrl} alt={post.destination} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <span className="text-[10px] font-mono text-sky-300 font-bold block">{post.destination}</span>
                          <p className="text-xs font-semibold truncate">{post.caption}</p>
                          <div className="flex items-center gap-3 text-[11px] font-mono mt-1 text-slate-300">
                            <span>❤️ {post.likesCount}</span>
                            <span>💬 {post.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CREATOR HUB / BENEFITS (Section 8) */}
        {/* ========================================================================= */}
        {activeTab === 'creator-hub' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#1E293B] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
                <Award className="w-3.5 h-3.5" />
                <span>TripYeah Creator Hub &amp; Partnerships</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Monetize &amp; Travel with TripYeah Partner Brands
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Connect with boutique resorts, luxury hotels, and official airline sponsors. Transparent partner criteria, real campaign bookings, and verified affiliate commissions.
              </p>
            </div>

            {/* Verified Analytics Dashboard (Demo Transparency) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Performance &amp; Tripper Reach</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono font-bold">
                      Verified Stats
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">Simulated analytics for your demo creator profile</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Last 30 Days</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <span className="text-xs text-slate-500 block mb-1">Total Impressions</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-blue-700 font-mono-tabular">184.2K</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">↑ 18% vs last month</span>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-xs text-slate-500 block mb-1">Engagement Rate</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-purple-700 font-mono-tabular">6.4%</span>
                  <span className="text-[10px] text-purple-600 font-semibold block mt-1">Industry avg: 2.8%</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-xs text-slate-500 block mb-1">Trippers Gained</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-emerald-700 font-mono-tabular">+1,240</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Organic growth</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <span className="text-xs text-slate-500 block mb-1">Itinerary Bookings</span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-amber-700 font-mono-tabular">28</span>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">₹42,000 potential comm.</span>
                </div>
              </div>
            </div>

            {/* Active Brand & Hotel Collaboration Opportunities */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Open Hotel &amp; Resort Campaigns (Apply Now)
                </h3>
                <p className="text-xs text-slate-500">
                  Sponsored 3N/4D stays in exchange for 2 Trip Reels and 1 Curated Travel Post
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Goa · Luxury Villa
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-900 mt-2">
                      The Grand Azure Beachfront Resort
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Seeking 3 Trippers for Monsoon Suite &amp; private plunge pool review. Min 10K Trippers required.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNotify('Campaign Application Sent', 'Applied for The Grand Azure Goa campaign!', 'success')}
                    className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Apply for Goa Stay
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Manali · Alpine Lodge
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-900 mt-2">
                      Himalayan Glade Chalets &amp; Spa
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Snow adventure documentary reel and pine forest photography. Drone permit included.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNotify('Campaign Application Sent', 'Applied for Himalayan Glade Manali campaign!', 'success')}
                    className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Apply for Manali Stay
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Bali · Eco Resort
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-900 mt-2">
                      Ubud Valley Bamboo Sanctuary
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Focus on sustainable travel, organic farm dining, and morning yoga pavilion content.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNotify('Campaign Application Sent', 'Applied for Ubud Bali campaign!', 'success')}
                    className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Apply for Bali Stay
                  </button>
                </div>
              </div>
            </div>

            {/* Affiliate Link Generator */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="font-display font-bold text-slate-900 text-base mb-1">
                Your TripYeah Affiliate Referral Generator
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Earn 12% commission on flight &amp; hotel bookings completed via your custom links.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={`https://tripyeah.com/go?ref=${myProfile.handle.replace('@', '')}&campaign=creator2026`}
                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        `https://tripyeah.com/go?ref=${myProfile.handle.replace('@', '')}&campaign=creator2026`
                      );
                      onNotify('Affiliate Link Copied', 'Paste this into your Instagram Bio or YouTube description.', 'success');
                    } catch {}
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Affiliate Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE & UPLOAD TRAVEL CONTENT MODAL */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Create Travel Content</h3>
                  <p className="text-xs text-slate-500">Upload and share with the TripYeah Trippers community</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Type Selector (Photos, Videos, Reels, Stories, Guides, Itineraries) */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Content Format</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                {[
                  { id: 'photo', label: 'Photo', icon: Camera },
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'reel', label: 'Trip Reel', icon: Film },
                  { id: 'story', label: 'Story', icon: Sparkles },
                  { id: 'guide', label: 'Guide', icon: Compass },
                  { id: 'itinerary', label: 'Itinerary', icon: Layers },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCreateContentType(item.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        createContentType === item.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handlePublishContent} className="space-y-4">
              {/* Media Selection / Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Travel Photography / Visual Preset
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { name: 'Goa', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85' },
                    { name: 'Kashmir', url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85' },
                    { name: 'Manali', url: 'https://images.unsplash.com/photo-1510414842594-a61752a33f10?auto=format&fit=crop&w=1200&q=85' },
                    { name: 'Bali', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85' },
                  ].map((preset) => (
                    <div
                      key={preset.name}
                      onClick={() => {
                        setSelectedMediaPreset(preset.url);
                        setCustomMediaUrl('');
                        setNewDestination(preset.name);
                      }}
                      className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedMediaPreset === preset.url && !customMediaUrl
                          ? 'border-blue-600 scale-95 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-slate-950/70 text-white text-[10px] font-bold">
                        {preset.name}
                      </span>
                    </div>
                  ))}
                </div>

                <input
                  type="url"
                  value={customMediaUrl}
                  onChange={(e) => setCustomMediaUrl(e.target.value)}
                  placeholder="Or paste custom image/video URL (e.g. from Unsplash or direct link)..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Destination Tag & Specific Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination *</label>
                  <select
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="Goa">Goa, India</option>
                    <option value="Manali">Manali, Himachal</option>
                    <option value="Kashmir">Kashmir (Gulmarg &amp; Dal Lake)</option>
                    <option value="Bali">Bali, Indonesia</option>
                    <option value="Japan">Kyoto &amp; Tokyo, Japan</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Switzerland">Switzerland (Zermatt &amp; Alps)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specific Location Tag *</label>
                  <input
                    type="text"
                    required
                    value={newLocationTag}
                    onChange={(e) => setNewLocationTag(e.target.value)}
                    placeholder="e.g. Cabo de Rama Cliff, South Goa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Caption & Travel Story */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caption &amp; Travel Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Describe your travel moment, hidden viewpoints, budget tips, and best sunset hours..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={newHashtags}
                  onChange={(e) => setNewHashtags(e.target.value)}
                  placeholder="#TripYeah #GoaVibes #TravelDiaries"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Notice regarding demo mode & persistence */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Demo Mode: Content is published immediately to your active TripYeah session feed and creator profile.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Travel Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: COMMENTS DRAWER / MODAL */}
      {/* ========================================================================= */}
      {activeCommentsPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Comments ({activeCommentsPost.comments.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCommentsPost(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Original Post Context */}
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 mb-3 border border-slate-100">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                  <SafeImage src={activeCommentsPost.creatorAvatar} alt={activeCommentsPost.creatorName} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">{activeCommentsPost.creatorHandle}</span>
                  <p className="text-[11px] text-slate-600 truncate">{activeCommentsPost.caption}</p>
                </div>
              </div>

              {/* Comments Scrollable List */}
              <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
                {activeCommentsPost.comments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No comments yet. Be the first Tripper to comment!
                  </div>
                ) : (
                  activeCommentsPost.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <SafeImage src={c.avatar} alt={c.authorName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-900">{c.authorHandle}</span>
                          <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Input Comment Box */}
            <form onSubmit={handleAddComment} className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a travel tip or ask about this spot..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TRIPPER CREATOR PROFILE INSPECT MODAL */}
      {/* ========================================================================= */}
      {selectedTripper && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 text-slate-900 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            {/* Cover Banner */}
            <div className="relative h-36 w-full bg-slate-900">
              <SafeImage src={selectedTripper.coverImage} alt={selectedTripper.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setSelectedTripper(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-6 pt-0 relative">
              <div className="flex items-end justify-between -mt-12 mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-xl bg-white">
                  <SafeImage src={selectedTripper.avatar} alt={selectedTripper.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCollabTargetTripper(selectedTripper);
                      setCollabSuccess(false);
                    }}
                    className="px-3 py-1.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Collaborate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTripping(selectedTripper.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedTripper.isTripping
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {selectedTripper.isTripping ? '✓ Tripping' : '+ Trippers'}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{selectedTripper.name}</span>
                  {selectedTripper.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />}
                </h3>
                <p className="text-xs text-slate-400 font-medium">{selectedTripper.handle}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedTripper.bio}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs mb-3 font-mono-tabular">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{selectedTripper.trippersCount}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Trippers</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{selectedTripper.trippingCount}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Tripping</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{selectedTripper.travelPostsCount}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Travel Posts</span>
                </div>
              </div>

              {/* Favourite destinations */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Favorite Destinations</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTripper.favouriteDestinations.map((d, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-md">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Creator's Posts in feed preview */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">Featured Travel Posts</span>
                <div className="grid grid-cols-3 gap-2">
                  {posts
                    .filter((p) => p.creatorId === selectedTripper.id)
                    .slice(0, 3)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          setSelectedTripper(null);
                          setActiveCommentsPost(post);
                        }}
                        className="relative h-20 rounded-xl overflow-hidden cursor-pointer group"
                      >
                        <SafeImage src={post.mediaUrl} alt={post.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-slate-950/70 text-white text-[9px] font-bold">
                          {post.destination}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EXPLORE DESTINATION PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewDestination && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
              <SafeImage src={previewDestination.image} alt={previewDestination.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewDestination(null)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-950/70 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300">
                  {previewDestination.category}
                </span>
                <h3 className="font-display font-bold text-xl">{previewDestination.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {previewDestination.tagline || `Top rated creator hotspot with scenic vistas, authentic cuisine, and curated itineraries.`}
            </p>

            {previewDestination.highlights && (
              <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs">
                <span className="font-bold text-blue-900 block mb-1">Highlights:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                  {previewDestination.highlights.map((h: string, i: number) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">Starting Trip Cost</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {formatPrice(previewDestination.startingPriceInr || 14500, currency)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = previewDestination.name;
                  setPreviewDestination(null);
                  handlePlanThisTrip(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Plan This Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: BRAND & RESORT COLLABORATION INQUIRY MODAL */}
      {/* ========================================================================= */}
      {collabTargetTripper && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Collaboration Inquiry: {collabTargetTripper.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCollabTargetTripper(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {collabSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-600">
                  {collabTargetTripper.name} and their manager have received your brief. Expected turnaround: 24-48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setCollabTargetTripper(null)}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCollabSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Hotel Name *</label>
                  <input
                    type="text"
                    required
                    value={collabBrandName}
                    onChange={(e) => setCollabBrandName(e.target.value)}
                    placeholder="e.g. Taj Exotica Resorts / Tourism Board"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={collabEmail}
                    onChange={(e) => setCollabEmail(e.target.value)}
                    placeholder="partnerships@brand.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Brief / Deliverables</label>
                  <textarea
                    rows={3}
                    value={collabDetails}
                    onChange={(e) => setCollabDetails(e.target.value)}
                    placeholder="e.g. 3N luxury suite review in Goa + 2 Trip Reels & high-res media package..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCollabTargetTripper(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    Submit Inquiry
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
