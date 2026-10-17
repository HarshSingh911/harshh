import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust multi-model Gemini caller with automatic fallback across models
async function generateWithGemini(prompt: string, isJson: boolean = true) {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  // Try flagship gemini-3.8-flash first, followed by gemini-flash-latest and gemini-3.1-flash-lite
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  for (const model of modelsToTry) {
    try {
      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config: isJson ? { responseMimeType: 'application/json', temperature: 0.7 } : { temperature: 0.7 },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model}`)), 30000)
      );
      const response = await Promise.race([generatePromise, timeoutPromise]);
      if (response && response.text) {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        if (isJson) {
          try {
            return JSON.parse(cleanText);
          } catch (jsonErr) {
            console.warn(`JSON parse error on model ${model}:`, jsonErr);
            continue;
          }
        }
        return cleanText;
      }
    } catch (err: any) {
      console.warn(`Gemini model ${model} invocation note:`, err?.status || err?.message || err);
      // Try next model in sequence
    }
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Pre-compiled comprehensive destination directory for instant zero-latency responses & offline fallbacks
const DESTINATION_DIRECTORY: Record<string, any> = {
  japan: {
    country: 'Japan',
    city: 'Tokyo & Kyoto',
    currency: 'JPY',
    currencySymbol: '¥',
    airportCode: 'HND',
    airportName: 'Tokyo Haneda International Airport (HND / NRT)',
    flightDuration: '~8h 15m direct',
    topAirlines: ['Air India', 'ANA (All Nippon Airways)', 'Japan Airlines', 'Singapore Airlines'],
    hotelAreas: ['Shinjuku / Shibuya (Vibrant nightlife)', 'Ginza (Shopping & Luxury)', 'Asakusa / Ueno (Historic & Budget)', 'Gion, Kyoto (Traditional Ryokans)'],
    destinationSummary: 'Japan seamlessly blends ancient Shinto shrines and Zen rock gardens with neon-lit high-tech skyscrapers and culinary perfection.',
    bestTimeToVisit: 'March – May (Cherry Blossoms) & October – November (Autumn Foliage)',
    visa: {
      destination: 'Japan (Tokyo, Kyoto, Osaka)',
      visaType: 'Short-Term Tourist eVisa (Single Entry)',
      entryRule: 'eVisa / Embassy Visa Required for Indian passport',
      validity: '90 days validity for single stay up to 15 or 30 days',
      processingTime: '5 – 7 business days',
      estimatedFee: 'JPY 3,000 (~₹1,750) + VFS handling fee',
      portalName: 'JAPAN eVISA Official Portal (MOFA)',
      portalUrl: 'https://www.evisa.mofa.go.jp/',
      requiredDocuments: [
        'Valid Passport with at least 6 months validity & 2 blank pages',
        'Recent digital passport photograph (35x45mm or 45x45mm, white background)',
        'Confirmed return flight tickets (e.g. DEL to HND/NRT)',
        'Detailed daily itinerary schedule in Japan',
        'Confirmed hotel reservations throughout stay',
        'Bank account statement for the last 6 months stamped by bank',
        'Latest Income Tax Return (ITR-V) acknowledgement',
        'Registration on Visit Japan Web for customs & immigration QR codes',
      ],
      steps: [
        'Apply online on the official JAPAN eVISA portal or submit through VFS Japan center.',
        'Upload required financial documents and roundtrip flight vouchers.',
        'Complete pre-arrival customs and immigration QR codes on Visit Japan Web.',
        'Upon electronic visa issuance, present the digital visa issuance notice at immigration.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 48000,
      hotelTierRate: 9500,
      diningPerDayRate: 3500,
      transitPerDayRate: 1500,
      activitiesPerDayRate: 2800,
    },
    checklist: [
      { id: 'chk-jp-1', category: 'Docs', label: 'Visit Japan Web QR Code Registration', description: 'Fill immigration and customs declaration online before boarding for express entry', completed: false, priority: 'High' },
      { id: 'chk-jp-2', category: 'Packing', label: 'Type A & B 2-Pin Flat Power Adapter', description: 'Japan uses 100V flat two-prong outlets; bring universal travel adapter', completed: false, priority: 'High' },
      { id: 'chk-jp-3', category: 'Forex', label: 'Carry ¥20,000 Cash in Yen', description: 'Many traditional ramen shops, temples, and coin lockers are cash only', completed: false, priority: 'High' },
      { id: 'chk-jp-4', category: 'SIM', label: 'Japan eSIM or Pocket Wi-Fi', description: 'Essential for live Google Maps and Tokyo Metro navigation apps', completed: false, priority: 'High' },
      { id: 'chk-jp-5', category: 'Transit', label: 'Suica / Pasmo IC Card on Apple/Google Wallet', description: 'Tap-to-pay subway, bus, vending machine, and convenience store card', completed: false, priority: 'Medium' },
      { id: 'chk-jp-6', category: 'Packing', label: 'Comfortable slip-on walking shoes', description: 'You will walk 15,000+ steps daily and remove shoes frequently at shrines & ryokans', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'Senso-ji Temple & Nakamise Dori', time: 'Morning 09:00', duration: '2h', desc: 'Tokyo’s oldest temple with giant thunder gate lantern and heritage souvenir street.', lat: 35.7148, lng: 139.7967 },
      { name: 'Shibuya Crossing & Hachiko', time: 'Afternoon 14:00', duration: '2h 30m', desc: 'The world’s busiest pedestrian intersection with Shibuya Sky observation deck.', lat: 35.6595, lng: 139.7005 },
      { name: 'Shinjuku Omoide Yokocho & Neon District', time: 'Evening 18:30', duration: '3h', desc: 'Atmospheric nostalgic lantern alleys with authentic yakitori skewers and Tokyo city views.', lat: 35.6938, lng: 139.7003 },
      { name: 'Fushimi Inari Vermilion Shrines', time: 'Morning 08:30', duration: '3h', desc: '10,000 vibrant torii gates winding through sacred Mount Inari mountain paths in Kyoto.', lat: 34.9671, lng: 135.7727 },
      { name: 'Arashiyama Bamboo Grove & River', time: 'Afternoon 13:30', duration: '2h 30m', desc: 'Towering green bamboo stalks, Tenryu-ji Zen garden, and Togetsukyo wooden bridge.', lat: 35.0169, lng: 135.6713 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Arrival in Tokyo & Historic Asakusa',
        morning: { time: '09:00 AM – 12:30 PM', activity: 'Senso-ji Temple & Nakamise-dori', details: 'Walk beneath the giant Kaminarimon lantern and sample freshly baked ningyo-yaki sweets.', costEstimateInr: 1200, transport: 'Ginza Line Metro to Asakusa Station' },
        afternoon: { time: '01:30 PM – 05:00 PM', activity: 'Akihabara Electric Town & Ueno Park', details: 'Explore multi-story electronics, anime hubs, and serene lotus ponds in Ueno.', costEstimateInr: 1800, transport: 'JR Yamanote Line (5 mins)' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Tokyo Skytree Sunset & Sumida Riverfront', details: 'Marvel at 360-degree twilight views of the Tokyo metropolis extending to Mount Fuji.', costEstimateInr: 2500, transport: 'Short walk or Tobu Skytree Line' },
        diningTip: 'Savor piping hot Tonkotsu ramen at Ichiran or authentic tempura bowls in Asakusa.',
        proTip: 'Purchase a digital Suica card in your phone wallet to tap through metro turnstiles instantly.',
        estimatedDayTotalInr: 5500,
      },
      {
        dayNumber: 2,
        title: 'Modern Tokyo: Meiji Shrine, Harajuku & Shibuya',
        morning: { time: '09:00 AM – 12:00 PM', activity: 'Meiji Jingu Shrine & Yoyogi Forest', details: 'Tranquil forested shrine dedicated to Emperor Meiji, entered through giant cedar torii gates.', costEstimateInr: 800, transport: 'Chiyoda line to Meiji-jingumae' },
        afternoon: { time: '01:00 PM – 05:00 PM', activity: 'Takeshita Street & Shibuya Crossing', details: 'Trendy Harajuku boutique fashion followed by the world-famous Shibuya pedestrian scramble.', costEstimateInr: 2200, transport: 'Walk along Cat Street or Yamanote line' },
        evening: { time: '06:00 PM – 09:30 PM', activity: 'Shibuya Sky Deck & Omoide Yokocho Dinner', details: 'Open-air rooftop views from 229m height, followed by dinner in atmospheric lantern-lit alleys.', costEstimateInr: 3200, transport: 'Yamanote line to Shinjuku' },
        diningTip: 'Try conveyor-belt sushi at Kura Sushi or savory Okonomiyaki in Shibuya.',
        proTip: 'Book Shibuya Sky tickets for 30 minutes before sunset to catch both golden hour and neon night.',
        estimatedDayTotalInr: 6200,
      },
      {
        dayNumber: 3,
        title: 'Shinkansen Bullet Train to Cultural Kyoto',
        morning: { time: '08:00 AM – 11:30 AM', activity: 'Tokaido Shinkansen Ride & Fushimi Inari', details: 'Board the 300 km/h bullet train with Mount Fuji views from right-side seats, head straight to thousands of vermilion torii gates.', costEstimateInr: 3800, transport: 'JR Shinkansen Nozomi (2h 15m) + JR Nara line' },
        afternoon: { time: '01:00 PM – 05:00 PM', activity: 'Kiyomizu-dera & Ninenzaka Cobbled Lanes', details: 'Historic wooden temple on stilts offering views of Kyoto, followed by traditional preserved wooden tea houses.', costEstimateInr: 1500, transport: 'Kyoto City Bus 206' },
        evening: { time: '06:00 PM – 09:00 PM', activity: 'Gion Lantern District & Kamogawa River Stroll', details: 'Spot geishas heading to evening tea ceremonies along the historic Shirakawa canal.', costEstimateInr: 2800, transport: 'Scenic evening walk' },
        diningTip: 'Delight in Kaiseki multi-course dinner or Kyoto matcha parfaits in Gion.',
        proTip: 'Reserve seats on the right side (Rows D/E) of the Shinkansen from Tokyo to see Mount Fuji.',
        estimatedDayTotalInr: 8100,
      },
      {
        dayNumber: 4,
        title: 'Arashiyama Bamboo Sanctuary & Golden Pavilion',
        morning: { time: '08:30 AM – 12:00 PM', activity: 'Arashiyama Bamboo Grove & Tenryu-ji', details: 'Morning light filtering through towering green bamboo and UNESCO Zen landscape gardens.', costEstimateInr: 1600, transport: 'JR San-in Line to Saga-Arashiyama' },
        afternoon: { time: '01:30 PM – 05:00 PM', activity: 'Kinkaku-ji (Golden Pavilion) & Rock Garden', details: 'Stunning two-story pavilion covered in pure gold leaf shimmering over Mirror Pond.', costEstimateInr: 1400, transport: 'Bus 205' },
        evening: { time: '06:00 PM – 09:30 PM', activity: 'Nishiki Food Market & Souvenir Shopping', details: 'Kyoto’s "Kitchen" market featuring over 100 food stalls, wagyu skewers, and ceramic shops.', costEstimateInr: 2500, transport: 'Subway Karasuma line' },
        diningTip: 'Taste freshly grilled unagi (eel), dango rice skewers, and matcha soft serve.',
        proTip: 'Visit Arashiyama before 09:00 AM for completely peaceful photos without crowds.',
        estimatedDayTotalInr: 5500,
      },
    ],
  },
  switzerland: {
    country: 'Switzerland',
    city: 'Zurich, Lucerne & Interlaken',
    currency: 'CHF',
    currencySymbol: 'CHF',
    airportCode: 'ZRH',
    airportName: 'Zurich International Airport (ZRH / GVA)',
    flightDuration: '~8h 45m direct',
    topAirlines: ['SWISS International', 'Air India', 'Emirates', 'Lufthansa'],
    hotelAreas: ['Zurich Old Town (Altstadt)', 'Lucerne Lakefront (Chapel Bridge)', 'Interlaken / Grindelwald (Alpine peaks)'],
    destinationSummary: 'Switzerland dazzles with snow-capped Alpine peaks, turquoise glacial lakes, pristine cogwheel trains, and charming chocolate ateliers.',
    bestTimeToVisit: 'June – September (Hiking & Lakes) or December – March (Skiing & Winter Wonderland)',
    visa: {
      destination: 'Switzerland / Schengen Area',
      visaType: 'Schengen Short-Stay Visa (Type C)',
      entryRule: 'Sticker Visa Required for Indian passport',
      validity: 'Up to 90 days within any 180-day period',
      processingTime: '10 – 15 business days',
      estimatedFee: '€90 (~₹8,200) + VFS Global fee',
      portalName: 'Swiss Federal Department of Foreign Affairs (FDFA)',
      portalUrl: 'https://www.eda.admin.ch/',
      requiredDocuments: [
        'Original Passport with minimum 6 months validity & 2 blank pages',
        'Signed Schengen visa application form',
        '2 recent biometric photos (35x45mm, white background)',
        'Confirmed flight itinerary (roundtrip ticket with verifiable PNR)',
        'Proof of Swiss hotel accommodations / mountain lodge vouchers',
        'Mandatory Travel Medical Insurance with minimum €30,000 coverage including repatriation',
        'Bank statements for last 3-6 months attested with bank stamp (min CHF 100/day equivalent)',
        'ITR-V acknowledgement for last 2-3 years and leave approval letter from employer',
      ],
      steps: [
        'Fill online Schengen application form on Swiss FDFA portal.',
        'Schedule biometric appointment at your nearest VFS Global Visa Application Centre.',
        'Submit physical documents and complete fingerprint / photo enrollment.',
        'Receive passport stamped with Schengen visa via secure courier.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 58000,
      hotelTierRate: 16500,
      diningPerDayRate: 5500,
      transitPerDayRate: 3500,
      activitiesPerDayRate: 5000,
    },
    checklist: [
      { id: 'chk-ch-1', category: 'Transit', label: 'Swiss Travel Pass (Consecutive Days)', description: 'Unlimited rides on Swiss Federal Railways, boats, panoramas, and free entry to 500+ museums', completed: false, priority: 'High' },
      { id: 'chk-ch-2', category: 'Packing', label: 'Type J 3-Pin Diamond Swiss Adapter', description: 'Switzerland uses Type J plugs (different from standard Euro Type C for grounded appliances)', completed: false, priority: 'High' },
      { id: 'chk-ch-3', category: 'Docs', label: '€30,000 Schengen Medical Insurance Policy', description: 'Keep printed copy in hand luggage; required by Swiss border police', completed: false, priority: 'High' },
      { id: 'chk-ch-4', category: 'Packing', label: 'Thermal layers & windproof alpine jacket', description: 'Even in summer, Jungfraujoch and Mount Titlis temperatures drop below freezing', completed: false, priority: 'High' },
      { id: 'chk-ch-5', category: 'Forex', label: 'Zero-Forex CHF Card', description: 'Switzerland is virtually cashless; card tap-to-pay is accepted everywhere from trains to mountain huts', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'Lucerne Chapel Bridge & Water Tower', time: 'Morning 09:30', duration: '2h', desc: '14th-century covered wooden footbridge spanning the Reuss River with medieval interior paintings.', lat: 47.0516, lng: 8.3074 },
      { name: 'Mount Titlis Rotating Cable Car & Cliff Walk', time: 'Morning 10:00', duration: '4h', desc: 'World’s first revolving cable car to 3,020m glacier peak with suspension cliff bridge.', lat: 46.7722, lng: 8.4375 },
      { name: 'Jungfraujoch – Top of Europe', time: 'Full Day 08:30', duration: '6h', desc: 'Highest railway station in Europe at 3,454m with Ice Palace and Aletsch Glacier.', lat: 46.5475, lng: 7.9822 },
      { name: 'Lake Brienz & Iseltwald Pier', time: 'Afternoon 14:00', duration: '2h 30m', desc: 'Turquoise glacial lake famous for scenic steam boats and the Crash Landing on You wooden pier.', lat: 46.7111, lng: 7.9625 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Arrival in Zurich & Historic Altstadt',
        morning: { time: '09:30 AM – 12:30 PM', activity: 'Bahnhofstrasse & Lake Zurich Promenade', details: 'Stroll down world-famous shopping avenue to the pristine lakefront with Swiss swans.', costEstimateInr: 1500, transport: 'S-Bahn from airport (12 mins)' },
        afternoon: { time: '02:00 PM – 05:00 PM', activity: 'Grossmünster & Lindenhof Hill Viewpoint', details: 'Climb the towers of twin-spired cathedral for panoramas over Zurich river and Old Town.', costEstimateInr: 1200, transport: 'Scenic walking route' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Swiss Fondue Dinner in Niederdorf', details: 'Enjoy authentic Gruyère cheese fondue and Swiss chocolate in cozy cobblestone alleys.', costEstimateInr: 4500, transport: 'Walk along Limmat river' },
        diningTip: 'Taste traditional Zürcher Geschnetzeltes with crispy golden Rösti.',
        proTip: 'Tap water from any of Zurich’s 1,200 public fountains is pure Alpine spring water—bring a reusable bottle.',
        estimatedDayTotalInr: 7200,
      },
      {
        dayNumber: 2,
        title: 'Scenic Lucerne & Mount Titlis Glacier',
        morning: { time: '08:30 AM – 11:30 AM', activity: 'Chapel Bridge & Scenic Train to Engelberg', details: 'Cross the wooden 1333 Chapel Bridge, then board the panoramic express train into the Alps.', costEstimateInr: 2800, transport: 'SBB IR Train (45 mins)' },
        afternoon: { time: '12:00 PM – 04:30 PM', activity: 'Mount Titlis Rotair & Cliff Walk Suspension Bridge', details: 'Ascend to 3,020 meters via revolving cable car, walk through the glacier cave and cross Europe’s highest suspension bridge.', costEstimateInr: 6500, transport: 'Titlis Rotair Cable Car' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Lake Lucerne Steamboat Cruise & Old Town Dinner', details: 'Glacial sunset cruise across Lake Lucerne with mountain reflections.', costEstimateInr: 3200, transport: 'Steamboat dock at Lucerne pier' },
        diningTip: 'Sample fresh mountain trout or Luzerner Chügelipastete (pastry with veal and mushrooms).',
        proTip: 'Swiss Travel Pass covers the train to Engelberg and gives a 50% discount on the Titlis cable car.',
        estimatedDayTotalInr: 12500,
      },
      {
        dayNumber: 3,
        title: 'Interlaken & Jungfraujoch "Top of Europe"',
        morning: { time: '08:00 AM – 12:30 PM', activity: 'Eiger Express Tricable Gondola to Jungfraujoch', details: 'State-of-the-art Eiger Express cuts travel time to the 3,454m summit overlooking the colossal Aletsch Glacier.', costEstimateInr: 9500, transport: 'Eiger Express Gondola + Cogwheel Railway' },
        afternoon: { time: '01:30 PM – 05:00 PM', activity: 'Ice Palace, Sphinx Observatory & Lauterbrunnen Valley', details: 'Walk through sculpted ice tunnels, then descend into the valley of 72 cascading waterfalls.', costEstimateInr: 2000, transport: 'Wengernalp Railway' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Interlaken Höhematte Park & Alpine Dining', details: 'Watch paragliders land against the illuminated Jungfrau massif and savor Swiss raclette.', costEstimateInr: 3800, transport: 'BOB Train to Interlaken Ost' },
        diningTip: 'Melted Swiss Raclette cheese scraped over boiled new potatoes with gherkins.',
        proTip: 'Check webcams on the Jungfrau app before heading up to ensure clear blue skies at the peak.',
        estimatedDayTotalInr: 15300,
      },
    ],
  },
  thailand: {
    country: 'Thailand',
    city: 'Bangkok, Phuket & Krabi',
    currency: 'THB',
    currencySymbol: '฿',
    airportCode: 'BKK',
    airportName: 'Suvarnabhumi Airport (BKK / DMK)',
    flightDuration: '~4h 15m direct',
    topAirlines: ['Thai Airways', 'IndiGo', 'Air India', 'Bangkok Airways'],
    hotelAreas: ['Sukhumvit (Shopping & Skytrain)', 'Riverside (Luxury & Sunset)', 'Siam (Family & Central)'],
    destinationSummary: 'Thailand captivates with ornate golden temples, world-renowned street food, tropical limestone islands, and warm Thai hospitality.',
    bestTimeToVisit: 'November – February (Cool & Dry Season)',
    visa: {
      destination: 'Thailand (Bangkok, Phuket, Krabi)',
      visaType: 'Visa Exemption (Up to 60 Days)',
      entryRule: 'Visa Exemption (Free Entry for Indian Passports)',
      validity: '60 days per visit (extendable for 30 days)',
      processingTime: 'Instant on arrival / 0 days',
      estimatedFee: 'FREE (Visa fee waived for tourism)',
      portalName: 'Official Thai E-Visa Portal',
      portalUrl: 'https://www.thaievisa.go.th/',
      requiredDocuments: [
        'Passport valid for at least 6 months from entry date',
        'Confirmed return flight ticket within 60 days',
        'Proof of accommodation (Hotel booking confirmation)',
        'Proof of funds (10,000 THB per person / 20,000 THB per family in cash or cards)',
      ],
      steps: [
        'Fly to any international Thai airport (Bangkok BKK/DMK, Phuket HKT).',
        'Head to the immigration arrival hall.',
        'Present your passport and return ticket for a free 60-day entry stamp.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 18000,
      hotelTierRate: 4500,
      diningPerDayRate: 1500,
      transitPerDayRate: 700,
      activitiesPerDayRate: 1800,
    },
    checklist: [
      { id: 'chk-th-1', category: 'Docs', label: 'Passport with 6 Months Validity', description: 'Airlines strictly enforce 6 months validity from departure date', completed: false, priority: 'High' },
      { id: 'chk-th-2', category: 'Packing', label: 'Modest Temple Attire', description: 'Shoulders and knees must be covered for entry to Grand Palace & Wat Pho', completed: false, priority: 'High' },
      { id: 'chk-th-3', category: 'Forex', label: 'Carry 10,000 THB Cash Equivalent', description: 'Random immigration checks require proof of sufficient funds in cash or card', completed: false, priority: 'High' },
      { id: 'chk-th-4', category: 'SIM', label: 'AIS / TrueMove 5G Tourist eSIM', description: 'High-speed data for Grab taxi booking and navigation', completed: false, priority: 'Medium' },
      { id: 'chk-th-5', category: 'Packing', label: 'Mosquito repellent & Reef-safe sunscreen', description: 'Essential for tropical island tours and evening night markets', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'The Grand Palace & Wat Phra Kaew', time: 'Morning 09:00', duration: '2h 30m', desc: 'Official royal residence housing the sacred 14th-century Emerald Buddha.', lat: 13.7500, lng: 100.4913 },
      { name: 'Wat Arun (Temple of Dawn)', time: 'Afternoon 14:30', duration: '1h 30m', desc: 'Iconic porcelain-encrusted spire standing dramatically over Chao Phraya River.', lat: 13.7437, lng: 100.4889 },
      { name: 'Chao Phraya Riverfront & ICONSIAM', time: 'Evening 18:00', duration: '3h', desc: 'Luxury riverside mall with indoor floating market and water fountain show.', lat: 13.7268, lng: 100.5109 },
      { name: 'Chatuchak Weekend Market', time: 'Morning 10:00', duration: '3h 30m', desc: 'Over 15,000 stalls selling artisan handicrafts, spices, silk, and street food.', lat: 13.7999, lng: 100.5501 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Golden Heritage: Grand Palace & Wat Pho',
        morning: { time: '09:00 AM – 12:30 PM', activity: 'The Grand Palace & Emerald Buddha', details: 'Marvel at glittering golden stupas, intricate murals, and the revered Emerald Buddha.', costEstimateInr: 1500, transport: 'Chao Phraya Express Boat to Chang Pier' },
        afternoon: { time: '01:30 PM – 04:30 PM', activity: 'Wat Pho 46m Reclining Buddha & Thai Massage', details: 'See the massive gold-leaf reclining Buddha and experience the birthplace of traditional Thai massage.', costEstimateInr: 900, transport: 'Short 5-minute walk' },
        evening: { time: '06:00 PM – 09:30 PM', activity: 'Wat Arun Sunset & Chao Phraya Dinner Cruise', details: 'Watch the sun set behind Wat Arun’s spires, then board a live music dinner cruise.', costEstimateInr: 2800, transport: 'Cross-river ferry (5 THB)' },
        diningTip: 'Authentic Pad Thai and Tom Yum Goong at Thip Samai or riverside bistros.',
        proTip: 'Strict dress code enforced: no sleeveless shirts, tight leggings, or shorts above the knee.',
        estimatedDayTotalInr: 5200,
      },
      {
        dayNumber: 2,
        title: 'Modern Bangkok, ICONSIAM & Night Markets',
        morning: { time: '10:00 AM – 01:00 PM', activity: 'Jim Thompson House & Silk Museum', details: 'Lush tropical teak wood mansion showcasing traditional Southeast Asian art and architecture.', costEstimateInr: 800, transport: 'BTS Skytrain to National Stadium' },
        afternoon: { time: '02:00 PM – 05:30 PM', activity: 'ICONSIAM & SookSiam Indoor Floating Market', details: 'Experience regional food from all 77 Thai provinces inside an air-conditioned floating pavilion.', costEstimateInr: 1200, transport: 'Free shuttle boat from Sathorn Pier' },
        evening: { time: '06:30 PM – 10:00 PM', activity: 'Jodd Fairs Night Market & King Power Mahanakhon', details: 'Walk on the transparent glass tray skywalk at 314 meters height, followed by bustling night market eats.', costEstimateInr: 2600, transport: 'MRT to Phra Ram 9' },
        diningTip: 'Try spicy volcanic pork ribs (Leng Saap) and fresh mango sticky rice at Jodd Fairs.',
        proTip: 'Use Grab or Bolt apps to hail taxis with upfront pricing to avoid meter refusal during peak traffic.',
        estimatedDayTotalInr: 4600,
      },
    ],
  },
  france: {
    country: 'France',
    city: 'Paris',
    currency: 'EUR',
    currencySymbol: '€',
    airportCode: 'CDG',
    airportName: 'Paris Charles de Gaulle Airport (CDG / ORY)',
    flightDuration: '~8h 50m direct',
    topAirlines: ['Air France', 'Air India', 'Emirates', 'Lufthansa'],
    hotelAreas: ['Le Marais (Chic & Historic)', 'Saint-Germain-des-Prés (Artistic & Cafés)', 'Opera / Madeleine (Central Shopping)'],
    destinationSummary: 'France charms with the romantic boulevards of Paris, the majestic Louvre, world-class haute cuisine, and iconic monuments.',
    bestTimeToVisit: 'April – June & September – November',
    visa: {
      destination: 'France / Schengen Area',
      visaType: 'Schengen Short-Stay Visa (Type C)',
      entryRule: 'Sticker Visa Required for Indian passport',
      validity: 'Up to 90 days within any 180-day period',
      processingTime: '10 – 15 business days',
      estimatedFee: '€90 (~₹8,200) + VFS handling fee',
      portalName: 'Official France-Visas Portal',
      portalUrl: 'https://france-visas.gouv.fr/',
      requiredDocuments: [
        'Passport with at least 6 months validity & 2 blank pages',
        'Signed Schengen visa application form',
        '2 recent passport photos (35x45mm, white background)',
        'Confirmed roundtrip flight booking',
        'Proof of hotel accommodation',
        'Travel insurance with €30,000 coverage',
        'Bank statements for last 3-6 months attested by bank',
        'ITR acknowledgement for last 2-3 years',
      ],
      steps: [
        'Complete online application on France-Visas.',
        'Book appointment at VFS Global France center.',
        'Attend biometric enrollment and submit documents.',
        'Track passport and collect stamped visa.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 52000,
      hotelTierRate: 12500,
      diningPerDayRate: 4000,
      transitPerDayRate: 1800,
      activitiesPerDayRate: 3200,
    },
    checklist: [
      { id: 'chk-fr-1', category: 'Transit', label: 'Navigo Easy Metro Card / App', description: 'Save money with digital t+ 10-ticket packs on Paris Metro', completed: false, priority: 'High' },
      { id: 'chk-fr-2', category: 'Packing', label: 'Type C / E 2-Pin Round Euro Adapter', description: 'Standard European socket plugs', completed: false, priority: 'High' },
      { id: 'chk-fr-3', category: 'Docs', label: 'Printed €30,000 Travel Insurance & Hotel Vouchers', description: 'French border police routinely ask for printed accommodations at CDG', completed: false, priority: 'High' },
      { id: 'chk-fr-4', category: 'Forex', label: 'Zero-Forex Contactless EUR Card', description: 'Card payments are standard everywhere in France', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'Eiffel Tower & Trocadéro', time: 'Morning 09:30', duration: '2h 30m', desc: 'World’s most iconic iron tower offering 360-degree views across Paris.', lat: 48.8584, lng: 2.2945 },
      { name: 'Louvre Museum & Tuileries Garden', time: 'Afternoon 14:00', duration: '3h', desc: 'Home to the Mona Lisa, Venus de Milo, and glass pyramid courtyard.', lat: 48.8606, lng: 2.3376 },
      { name: 'Montmartre & Sacré-Cœur Basilica', time: 'Morning 10:00', duration: '2h 30m', desc: 'Bohemian cobbled village with street artists and hill views.', lat: 48.8867, lng: 2.3431 },
      { name: 'Seine River Sunset Cruise', time: 'Evening 18:30', duration: '1h 15m', desc: 'Glass-canopy boat past illuminated Notre-Dame and historic bridges.', lat: 48.8595, lng: 2.3280 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Iconic Paris: Eiffel Tower & Seine Cruise',
        morning: { time: '09:30 AM – 12:30 PM', activity: 'Eiffel Tower & Champ de Mars', details: 'Ascend to the summit or 2nd floor, followed by photos from Trocadéro terrace.', costEstimateInr: 3200, transport: 'Metro Line 6 to Bir-Hakeim' },
        afternoon: { time: '02:00 PM – 05:00 PM', activity: 'Champs-Élysées & Arc de Triomphe', details: 'Walk the prestigious avenue and climb to the roof of the triumphal arch.', costEstimateInr: 1600, transport: 'Walk along Avenue Kléber' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Illuminated Seine River Cruise & Bistro Dinner', details: 'Watch the Eiffel Tower sparkle on the hour from an evening boat cruise.', costEstimateInr: 2800, transport: 'Pont de l’Alma pier' },
        diningTip: 'Duck confit or steak frites at a classic Parisian brasserie.',
        proTip: 'Book Eiffel Tower summit tickets 60 days in advance on the official website to avoid huge lines.',
        estimatedDayTotalInr: 7600,
      },
      {
        dayNumber: 2,
        title: 'Masterpieces: The Louvre & Montmartre',
        morning: { time: '09:00 AM – 12:30 PM', activity: 'Louvre Museum & Palais Royal', details: 'See the Mona Lisa, Winged Victory, and iconic glass pyramid.', costEstimateInr: 2400, transport: 'Metro Line 1 to Palais-Royal' },
        afternoon: { time: '01:30 PM – 05:00 PM', activity: 'Montmartre, Place du Tertre & Sacré-Cœur', details: 'Wander through cobbled artist lanes and step inside the white travertine dome.', costEstimateInr: 800, transport: 'Metro Line 12 to Abbesses' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Latin Quarter & Saint-Germain Stroll', details: 'Explore historic student quarter, bookshops, and evening café terraces.', costEstimateInr: 2500, transport: 'Metro to Saint-Michel' },
        diningTip: 'Fresh warm croissants, French onion soup, and savory buckwheat crêpes.',
        proTip: 'Enter the Louvre via the Carrousel du Louvre underground entrance to skip outdoor pyramid queues.',
        estimatedDayTotalInr: 5700,
      },
    ],
  },
  dubai: {
    country: 'United Arab Emirates',
    city: 'Dubai',
    currency: 'AED',
    currencySymbol: 'AED',
    airportCode: 'DXB',
    airportName: 'Dubai International Airport (DXB)',
    flightDuration: '~3h 45m direct',
    topAirlines: ['Emirates', 'FlyDubai', 'IndiGo', 'Air India'],
    hotelAreas: ['Downtown Dubai (Burj Khalifa)', 'Dubai Marina (Beaches & Promenade)', 'Deira / Bur Dubai (Heritage & Souks)'],
    destinationSummary: 'Dubai is a futuristic desert metropolis famed for ultra-modern architecture, luxury shopping, red sand dunes, and world-record attractions.',
    bestTimeToVisit: 'November – March (Pleasant winter sunshine)',
    visa: {
      destination: 'United Arab Emirates (Dubai / Abu Dhabi)',
      visaType: 'Tourist eVisa (30 Days / 60 Days)',
      entryRule: 'Pre-arranged Tourist eVisa / VoA with US/UK Visa',
      validity: '30 or 60 days from date of entry',
      processingTime: '24 – 48 hours express processing',
      estimatedFee: 'AED 350 (~₹8,200) for 30-day single entry',
      portalName: 'Federal Authority for Identity & Citizenship (ICP / GDRFA)',
      portalUrl: 'https://smartservices.icp.gov.ae/',
      requiredDocuments: [
        'Color passport copy (first & last pages) with 6 months validity',
        'Recent digital passport photograph (white background)',
        'Confirmed roundtrip flight booking',
        'Hotel booking voucher',
      ],
      steps: [
        'Submit passport and photo online through airline or ICP portal.',
        'Pay official visa processing fees.',
        'Receive electronic visa PDF by email in 24-48 hours.',
        'Present eVisa copy at UAE airport e-gates.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 22000,
      hotelTierRate: 9000,
      diningPerDayRate: 3500,
      transitPerDayRate: 1500,
      activitiesPerDayRate: 4000,
    },
    checklist: [
      { id: 'chk-ae-1', category: 'Docs', label: 'UAE eVisa Printout / Digital PDF', description: 'Download and save to phone; show at check-in counter', completed: false, priority: 'High' },
      { id: 'chk-ae-2', category: 'Transit', label: 'Silver Nol Card for Dubai Metro', description: 'Rechargeable card for driverless metro and trams', completed: false, priority: 'High' },
      { id: 'chk-ae-3', category: 'Packing', label: 'Type G 3-Pin British Style Adapter', description: 'UAE uses 220V UK rectangular 3-pin wall sockets', completed: false, priority: 'High' },
      { id: 'chk-ae-4', category: 'Packing', label: 'Sun protection & Sunglasses', description: 'High UV index even during winter months', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'Burj Khalifa (At The Top Level 124/125)', time: 'Morning 10:00', duration: '2h', desc: 'World’s tallest building offering sweeping desert and gulf views.', lat: 25.1972, lng: 55.2744 },
      { name: 'Museum of the Future', time: 'Afternoon 14:00', duration: '2h', desc: 'Toroid-shaped marvel inscribed with Arabic calligraphy exploring futuristic tech.', lat: 25.2195, lng: 55.2819 },
      { name: 'Dubai Red Dunes 4x4 Desert Safari', time: 'Afternoon 15:30', duration: '5h', desc: 'Dune bashing, camel trekking, sandboarding, and Bedouin BBQ dinner show.', lat: 24.9542, lng: 55.6133 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Modern Marvels: Burj Khalifa & Dubai Mall',
        morning: { time: '10:00 AM – 01:00 PM', activity: 'Burj Khalifa Observation Deck & Dubai Mall', details: 'Soar up high-speed elevators to the 124th floor, then explore the world’s largest mall and indoor aquarium.', costEstimateInr: 4500, transport: 'Dubai Metro Red Line to Burj Khalifa/Dubai Mall' },
        afternoon: { time: '02:00 PM – 05:00 PM', activity: 'Museum of the Future & Dubai Frame', details: 'Step into year 2071, followed by glass-bridge views over Old and New Dubai.', costEstimateInr: 3800, transport: 'Dubai Metro (3 stops)' },
        evening: { time: '06:30 PM – 09:30 PM', activity: 'Dubai Fountain Show & Souk Al Bahar Dinner', details: 'Spectacular choreographed dancing water fountains set to Arabic music.', costEstimateInr: 2500, transport: 'Walk along waterfront' },
        diningTip: 'Traditional Emirati Machboos or Middle Eastern mixed grill with freshly baked pita.',
        proTip: 'Book Burj Khalifa sunset slots (16:30–18:00) at least 2 weeks in advance.',
        estimatedDayTotalInr: 10800,
      },
    ],
  },
  bali: {
    country: 'Indonesia',
    city: 'Bali (Ubud & Seminyak)',
    currency: 'IDR',
    currencySymbol: 'Rp',
    airportCode: 'DPS',
    airportName: 'Ngurah Rai International Airport (DPS)',
    flightDuration: '~8h 30m with 1 stop',
    topAirlines: ['Singapore Airlines', 'Batik Air', 'Air India', 'VietJet'],
    hotelAreas: ['Ubud (Jungle & Culture)', 'Seminyak / Canggu (Beach clubs & Surfing)', 'Uluwatu (Clifftop sunsets)'],
    destinationSummary: 'Bali is Indonesia’s Island of the Gods, renowned for emerald tiered rice terraces, sacred clifftop temples, and vibrant coastal culture.',
    bestTimeToVisit: 'April – October (Dry Season)',
    visa: {
      destination: 'Indonesia (Bali / Jakarta)',
      visaType: 'Electronic Visa on Arrival (e-VoA) / VoA',
      entryRule: 'e-VoA / Visa on Arrival for 90+ nationalities',
      validity: '30 days (extendable once for 30 days)',
      processingTime: 'Instant online or at Bali airport counter',
      estimatedFee: 'IDR 500,000 (~$35 / ₹2,800) + Bali Tourist Levy (IDR 150,000)',
      portalName: 'Official Indonesian Immigration (Molina) Portal',
      portalUrl: 'https://molina.imigrasi.go.id/',
      requiredDocuments: [
        'Passport with 6 months validity & 1 blank page',
        'Confirmed outbound/return flight ticket',
        'Electronic Customs Declaration (e-CD) QR code filled 3 days prior',
        'Bali Tourist Levy QR code (paid online via Love Bali)',
      ],
      steps: [
        'Apply for e-VoA online on Molina portal or buy sticker counter at DPS airport.',
        'Fill digital Indonesian Customs Declaration online before departure.',
        'Pay IDR 150,000 Bali Tourist Levy.',
        'Scan autogates at Denpasar airport for immediate entry.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: 28000,
      hotelTierRate: 6500,
      diningPerDayRate: 2000,
      transitPerDayRate: 1200,
      activitiesPerDayRate: 2200,
    },
    checklist: [
      { id: 'chk-id-1', category: 'Docs', label: 'Indonesian Electronic Customs Declaration (e-CD)', description: 'Mandatory online form filled within 72 hours of departure', completed: false, priority: 'High' },
      { id: 'chk-id-2', category: 'Docs', label: 'Bali Tourism Levy (Love Bali QR)', description: 'Official IDR 150,000 environmental levy paid online', completed: false, priority: 'High' },
      { id: 'chk-id-3', category: 'Packing', label: 'Type C & F 2-Pin Round Plug Adapter', description: 'Standard European style outlets used across Indonesia', completed: false, priority: 'High' },
      { id: 'chk-id-4', category: 'Transit', label: 'Grab or Gojek App Installed', description: 'Convenient ride-hailing and food delivery across Bali', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: 'Uluwatu Clifftop Temple & Kecak Dance', time: 'Late Afternoon 16:30', duration: '2h 30m', desc: 'Temple perched 70m above crashing Indian Ocean waves with hypnotic fire dance.', lat: -8.8291, lng: 115.0849 },
      { name: 'Tegallalang Rice Terraces & Jungle Swing', time: 'Morning 08:30', duration: '2h', desc: 'Iconic emerald valleys with cascading rice fields and panoramic swings.', lat: -8.4312, lng: 115.2785 },
      { name: 'Ulun Danu Bratan Water Temple', time: 'Morning 09:00', duration: '2h', desc: 'Photogenic 17th-century temple floating peacefully on Lake Bratan crater.', lat: -8.2753, lng: 115.1668 },
    ],
    daysTemplate: [
      {
        dayNumber: 1,
        title: 'Cultural Heart of Ubud & Rice Terraces',
        morning: { time: '08:30 AM – 12:00 PM', activity: 'Tegallalang Rice Terraces & Jungle Swing', details: 'Walk through cascading emerald rice paddies and fly above palm trees on a giant swing.', costEstimateInr: 1800, transport: 'Private driver or scooter transfer' },
        afternoon: { time: '01:30 PM – 04:30 PM', activity: 'Sacred Monkey Forest Sanctuary & Ubud Palace', details: 'Encounter hundreds of playful long-tailed macaques in lush banyan temple ruins.', costEstimateInr: 900, transport: 'Short drive to central Ubud' },
        evening: { time: '06:00 PM – 09:00 PM', activity: 'Ubud Traditional Market & Balinese Dinner', details: 'Shop handcrafted rattan bags, woodcarvings, and enjoy organic farm-to-table cuisine.', costEstimateInr: 1800, transport: 'Walk along Jalan Raya Ubud' },
        diningTip: 'Crispy duck (Bebek Betutu) or Nasi Campur with fresh sambal.',
        proTip: 'Keep sunglasses, jewelry, and loose bottles hidden in zipped bags around Ubud Monkey Forest.',
        estimatedDayTotalInr: 4500,
      },
    ],
  },
};

// Generic synthesizer function that dynamically builds a pristine country package for ANY destination in the world
function buildGenericDestinationFallback(params: {
  destination: string;
  origin: string;
  passportCountry: string;
  daysCount: number;
  budget: string;
  travellersCount: number;
  travellerType: string;
  interests: string[];
}) {
  const { destination, origin, passportCountry, daysCount, budget, travellersCount, travellerType, interests } = params;
  const dClean = destination.trim();
  const safeDays = Math.max(1, Math.min(daysCount || 4, 14));

  // Determine realistic regional budget defaults
  let flightCost = 50000;
  let hotelRate = budget === 'luxury' ? 18000 : budget === 'budget' ? 4500 : 9000;
  let foodPerDay = budget === 'luxury' ? 6000 : budget === 'budget' ? 1800 : 3200;
  let transitPerDay = 1500;
  let activitiesPerDay = 2500;
  let currencyCode = 'USD';
  let currencySymbol = '$';

  const dLower = dClean.toLowerCase();
  if (dLower.includes('singapore')) { currencyCode = 'SGD'; currencySymbol = 'S$'; flightCost = 24000; }
  else if (dLower.includes('london') || dLower.includes('uk') || dLower.includes('britain')) { currencyCode = 'GBP'; currencySymbol = '£'; flightCost = 55000; }
  else if (dLower.includes('usa') || dLower.includes('united states') || dLower.includes('york') || dLower.includes('california')) { currencyCode = 'USD'; currencySymbol = '$'; flightCost = 75000; hotelRate = 14000; }
  else if (dLower.includes('australia') || dLower.includes('sydney') || dLower.includes('melbourne')) { currencyCode = 'AUD'; currencySymbol = 'A$'; flightCost = 60000; }
  else if (dLower.includes('vietnam') || dLower.includes('hanoi') || dLower.includes('saigon')) { currencyCode = 'VND'; currencySymbol = '₫'; flightCost = 22000; hotelRate = 3500; foodPerDay = 1400; }
  else if (dLower.includes('turkey') || dLower.includes('istanbul')) { currencyCode = 'TRY'; currencySymbol = '₺'; flightCost = 35000; }
  else if (dLower.includes('germany') || dLower.includes('italy') || dLower.includes('spain') || dLower.includes('greece') || dLower.includes('netherlands')) { currencyCode = 'EUR'; currencySymbol = '€'; flightCost = 52000; }
  else if (dLower.includes('maldives')) { currencyCode = 'USD'; currencySymbol = '$'; flightCost = 26000; hotelRate = 18000; }

  const days: any[] = [];
  for (let i = 1; i <= safeDays; i++) {
    const dayTheme = i === 1
      ? `Arrival in ${dClean} & Historic Center`
      : i === 2
      ? `Iconic Landmarks & Cultural Heritage`
      : i === 3
      ? `Scenic Discovery, Local Markets & Sunset`
      : i === 4
      ? `Day Excursion & Nature Highlights`
      : `Hidden Gems & Neighborhood Immersion (Day ${i})`;

    days.push({
      dayNumber: i,
      title: dayTheme,
      morning: {
        time: '09:00 AM – 12:30 PM',
        activity: `Morning Highlights of ${dClean}`,
        details: `Begin your day with authentic breakfast followed by guided exploration of ${dClean}'s premier architectural and heritage treasures.`,
        costEstimateInr: Math.round(activitiesPerDay * 0.4),
        transport: 'Metro / Rapid City Transit',
      },
      afternoon: {
        time: '01:30 PM – 05:00 PM',
        activity: `${dClean} Cultural District & Artisan Quarters`,
        details: `Delight in regional specialties, then discover famous local galleries, scenic promenades, and shopping lanes.`,
        costEstimateInr: Math.round(activitiesPerDay * 0.6),
        transport: 'Scenic Walk / Short Cab',
      },
      evening: {
        time: '06:30 PM – 09:30 PM',
        activity: `Sunset Twilight & Dinner Experience`,
        details: `Enjoy vibrant golden hour views, followed by a curated dinner featuring celebrated local cuisine and evening atmosphere.`,
        costEstimateInr: Math.round(foodPerDay * 0.6),
        transport: 'City return transit',
      },
      diningTip: `Sample celebrated regional culinary specialties at top-rated local dining spots in ${dClean}.`,
      proTip: `Pre-book major attraction tickets online 24–48 hours ahead to skip entrance queues.`,
      estimatedDayTotalInr: Math.round(foodPerDay + transitPerDay + activitiesPerDay),
    });
  }

  return {
    destination: dClean,
    country: dClean,
    currency: currencyCode,
    currencySymbol: currencySymbol,
    destinationSummary: `${dClean} is a premier international destination celebrated for its rich culture, breathtaking landmarks, world-class cuisine, and unforgettable hospitality.`,
    bestTimeToVisit: 'Spring & Autumn (Pleasant temperatures & ideal sightseeing conditions)',
    estimatedTotalTripBudgetInr: days.reduce((sum, d) => sum + d.estimatedDayTotalInr, 0) + (flightCost * travellersCount) + (hotelRate * Math.max(1, safeDays - 1)),
    days: days,
    visa: {
      destination: dClean,
      visaType: `Tourist Visa / Entry Authorization for ${dClean}`,
      entryRule: `Check verified embassy requirements for ${passportCountry} passport holders`,
      validity: '30 to 90 days standard tourist stay',
      processingTime: '5 – 10 business days',
      estimatedFee: 'Approx ₹3,500 – ₹8,500 depending on single/multiple entry',
      portalName: `Official Immigration & Consular Portal of ${dClean}`,
      portalUrl: `https://www.google.com/search?q=official+visa+portal+${encodeURIComponent(dClean)}`,
      requiredDocuments: [
        'Original Passport with minimum 6 months validity & 2 blank pages',
        'Recent passport-size photographs matching official consular specifications',
        'Confirmed roundtrip flight booking with verifiable PNR',
        'Proof of accommodation (Hotel booking vouchers for duration of stay)',
        'Mandatory International Travel Medical Insurance',
        'Bank account statements for the last 3-6 months showing sufficient travel funds',
        'Income Tax Returns (ITR-V) or employment leave authorization letter',
        'Day-by-day travel itinerary schedule',
      ],
      steps: [
        `Visit the official immigration portal for ${dClean} or contact the accredited visa application center.`,
        'Complete the online visa application form and upload scanned documentation.',
        'Pay official government consular fees securely online.',
        'Download approved electronic visa (eVisa) or attend biometric submission.',
      ],
    },
    budgetDefaults: {
      flightEstimateInr: flightCost,
      hotelTierRate: hotelRate,
      diningPerDayRate: foodPerDay,
      transitPerDayRate: transitPerDay,
      activitiesPerDayRate: activitiesPerDay,
    },
    checklist: [
      { id: 'chk-gen-1', category: 'Docs', label: 'Passport with 6 Months Validity', description: `Verify your passport does not expire within 6 months of departure to ${dClean}`, completed: false, priority: 'High' },
      { id: 'chk-gen-2', category: 'Docs', label: 'Comprehensive Travel Medical Insurance', description: 'Covers medical emergencies, hospitalizations, flight delays, and lost baggage', completed: false, priority: 'High' },
      { id: 'chk-gen-3', category: 'Packing', label: 'Universal International Power Adapter', description: 'Compatible with local wall outlets across destinations', completed: false, priority: 'High' },
      { id: 'chk-gen-4', category: 'Forex', label: `Zero-Forex Card with ${currencyCode} Support`, description: 'Enjoy live interbank exchange rates with zero foreign transaction markup', completed: false, priority: 'High' },
      { id: 'chk-gen-5', category: 'SIM', label: 'International Tourist eSIM', description: 'Activate high-speed cellular data immediately upon landing', completed: false, priority: 'Medium' },
    ],
    places: [
      { name: `${dClean} Central Landmark & Plaza`, time: 'Morning 09:30', duration: '2h', desc: `The iconic heart and historic focal point of ${dClean}.`, lat: 48.8566, lng: 2.3522 },
      { name: `${dClean} National Cultural Museum & Gardens`, time: 'Afternoon 14:00', duration: '2h 30m', desc: `World-renowned heritage artifacts and botanical gardens.`, lat: 48.8606, lng: 2.3376 },
      { name: `${dClean} Waterfront & Twilight Promenade`, time: 'Evening 18:30', duration: '2h', desc: `Atmospheric sunset spot with charming evening restaurants and city lights.`, lat: 48.8584, lng: 2.2945 },
    ],
    flightsAndHotels: {
      airportCode: 'INTL',
      airportName: `${dClean} International Airport`,
      flightDuration: '~7h to 9h flight',
      topAirlines: ['Air India', 'Emirates', 'Qatar Airways', 'Singapore Airlines'],
      hotelAreas: [`City Center / Historic Quarter`, `Waterfront & Boulevard District`, `Boutique Arts Neighborhood`],
    },
  };
}

// 1. REAL AI AGENT FULL TRIP GENERATOR ENDPOINT
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  try {
    const {
      destination,
      origin = 'New Delhi',
      passportCountry = 'India',
      startDate = new Date().toISOString().split('T')[0],
      endDate,
      daysCount = 4,
      budget = 'mid-range',
      travellersCount = 2,
      travellerType = 'Couple',
      interests = ['Sightseeing', 'Food & Culture'],
      customNotes = '',
    } = req.body;

    if (!destination || typeof destination !== 'string' || !destination.trim()) {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const destClean = destination.trim();
    const destLower = destClean.toLowerCase();

    // Check pre-compiled instant directory first if exact match
    const matchedDirectoryKey = Object.keys(DESTINATION_DIRECTORY).find((k) =>
      destLower.includes(k) ||
      (k === 'france' && (destLower.includes('paris') || destLower.includes('nice') || destLower.includes('lyon'))) ||
      (k === 'switzerland' && (destLower.includes('zurich') || destLower.includes('lucerne') || destLower.includes('interlaken') || destLower.includes('swiss'))) ||
      (k === 'thailand' && (destLower.includes('bangkok') || destLower.includes('phuket') || destLower.includes('pattaya') || destLower.includes('chiang mai'))) ||
      (k === 'dubai' && (destLower.includes('uae') || destLower.includes('abu dhabi'))) ||
      (k === 'bali' && (destLower.includes('indonesia') || destLower.includes('ubud') || destLower.includes('seminyak'))) ||
      (k === 'japan' && (destLower.includes('tokyo') || destLower.includes('kyoto') || destLower.includes('osaka')))
    );

    // Call Real Gemini AI Agent for dynamic custom generation across ALL countries
    const prompt = `You are the TripYeah AI International Travel Agent.
Create a complete, realistic, country-specific travel intelligence package for:
- Destination: "${destClean}"
- Origin: "${origin}"
- Passport Nationality: "${passportCountry}"
- Duration: ${daysCount} Days (Dates: ${startDate} to ${endDate || 'Flexible'})
- Budget Level: ${budget} (budget / mid-range / luxury)
- Travellers: ${travellersCount} people (${travellerType})
- Interests: ${interests.join(', ')}
${customNotes ? `- Custom Preferences: ${customNotes}` : ''}

CRITICAL RULES:
1. Every single detail, landmark, currency, visa rule, transit mode, and cost MUST correspond specifically to "${destClean}".
2. Do NOT default to Paris or France unless the user explicitly requested Paris or France.
3. Currency must be the official currency of "${destClean}" (e.g. JPY for Japan, CHF for Switzerland, THB for Thailand, EUR for Europe, USD for USA, AED for UAE, etc.).
4. Flight estimate must be realistic in Indian Rupees (INR) for roundtrip flights from ${origin} to ${destClean}.
5. Visa details must accurately reflect official entry rules for ${passportCountry} passport holders entering "${destClean}".
6. Return EXACTLY ${daysCount} days in the days array with genuine real landmarks in "${destClean}".

Respond ONLY with a valid JSON object matching this schema:
{
  "destination": "${destClean}",
  "country": "Country name of ${destClean}",
  "currency": "3-letter currency code (e.g. JPY, EUR, CHF, THB, USD, AED, etc.)",
  "currencySymbol": "Symbol (e.g. ¥, €, CHF, ฿, $, etc.)",
  "destinationSummary": "Engaging 2-sentence description of ${destClean}",
  "bestTimeToVisit": "Best months and seasons to visit ${destClean}",
  "estimatedTotalTripBudgetInr": number (total budget for all ${travellersCount} travellers in INR),
  "visa": {
    "destination": "${destClean}",
    "visaType": "Official visa name for ${passportCountry} citizens",
    "entryRule": "Short summary e.g. eVisa Required / Visa Exemption (60 Days) / Sticker Visa",
    "validity": "e.g. 90 days / 30 days",
    "processingTime": "e.g. 5-7 business days / Instant on arrival",
    "estimatedFee": "Fee in local currency and approx INR e.g. ¥3,000 (~₹1,750)",
    "portalName": "Official government immigration portal name",
    "portalUrl": "Verified official website URL",
    "requiredDocuments": [
      "8 to 10 specific documents required for this country"
    ],
    "steps": [
      "4 to 5 step-by-step application instructions"
    ]
  },
  "budgetDefaults": {
    "flightEstimateInr": number (realistic roundtrip flight per person in INR from ${origin} to ${destClean}),
    "hotelTierRate": number (realistic hotel room rate per night in INR for ${budget} tier in ${destClean}),
    "diningPerDayRate": number (realistic food per person per day in INR in ${destClean}),
    "transitPerDayRate": number (realistic local transport per person per day in INR in ${destClean}),
    "activitiesPerDayRate": number (realistic sightseeing & tickets per person per day in INR in ${destClean})
  },
  "checklist": [
    {
      "id": "chk-1",
      "category": "Docs",
      "label": "Specific checklist item for ${destClean}",
      "description": "Practical details, e.g. specific plug adapter type or cash amount in local currency",
      "completed": false,
      "priority": "High"
    }
  ],
  "places": [
    {
      "name": "Attraction name in ${destClean}",
      "time": "Morning 09:30",
      "duration": "2h",
      "desc": "Short description",
      "lat": number (real latitude coordinate),
      "lng": number (real longitude coordinate)
    }
  ],
  "flightsAndHotels": {
    "airportCode": "3-letter IATA code of nearest major airport (e.g. HND, CDG, BKK, DXB, SIN, DPS, ZRH, LHR, JFK)",
    "airportName": "Airport name",
    "flightDuration": "Flight time from India (e.g. ~8h 30m)",
    "topAirlines": ["Airline 1", "Airline 2", "Airline 3"],
    "hotelAreas": ["Neighborhood 1", "Neighborhood 2 in ${destClean}"]
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Day Theme in ${destClean}",
      "morning": {
        "time": "09:00 AM – 12:30 PM",
        "activity": "Real attraction in ${destClean}",
        "details": "Engaging description with practical tips",
        "costEstimateInr": number,
        "transport": "Specific metro line or transit in ${destClean}"
      },
      "afternoon": {
        "time": "01:30 PM – 05:00 PM",
        "activity": "Real afternoon spot in ${destClean}",
        "details": "Description",
        "costEstimateInr": number,
        "transport": "Transit mode"
      },
      "evening": {
        "time": "06:30 PM – 09:30 PM",
        "activity": "Evening experience/dinner in ${destClean}",
        "details": "Atmosphere and what to do",
        "costEstimateInr": number,
        "transport": "Transit mode"
      },
      "diningTip": "Specific local culinary specialty or restaurant in ${destClean}",
      "proTip": "Insider secret or time-saver for ${destClean}",
      "estimatedDayTotalInr": number
    }
  ]
}`;

    const geminiResult = await generateWithGemini(prompt, true);

    if (geminiResult && geminiResult.days && Array.isArray(geminiResult.days) && geminiResult.days.length > 0) {
      return res.json({
        success: true,
        source: 'gemini-ai-agent',
        data: geminiResult,
      });
    }

    // If Gemini had temporary demand spike, check our curated directory
    if (matchedDirectoryKey && DESTINATION_DIRECTORY[matchedDirectoryKey]) {
      const dirData = DESTINATION_DIRECTORY[matchedDirectoryKey];
      const daysCountSafe = Math.max(1, Math.min(daysCount || 4, 14));
      const slicedDays = [];

      for (let i = 1; i <= daysCountSafe; i++) {
        if (dirData.daysTemplate && dirData.daysTemplate[i - 1]) {
          slicedDays.push(dirData.daysTemplate[i - 1]);
        } else {
          slicedDays.push({
            dayNumber: i,
            title: `Exploration & Local Highlights (Day ${i})`,
            morning: { time: '09:00 AM – 12:30 PM', activity: `Discover ${dirData.city} Cultural Quarter`, details: `Morning guided exploration of prominent historical landmarks and vibrant streets.`, costEstimateInr: 1500, transport: 'Local Metro / City Transit' },
            afternoon: { time: '01:30 PM – 05:00 PM', activity: `${dirData.city} Artisan Shops & Scenic Parks`, details: `Enjoy regional cuisine and visit local viewpoints and craft boutiques.`, costEstimateInr: 2000, transport: 'Short walk or transit' },
            evening: { time: '06:30 PM – 09:30 PM', activity: `Sunset Promenade & Dinner`, details: `Watch the sunset over the city skyline followed by dinner with local specialties.`, costEstimateInr: 2500, transport: 'Return transfer' },
            diningTip: `Sample celebrated regional culinary specialties at top-rated local dining spots.`,
            proTip: `Pre-book major attraction tickets online 24–48 hours ahead to skip entrance queues.`,
            estimatedDayTotalInr: 6000,
          });
        }
      }

      const packageData = {
        destination: destClean,
        country: dirData.country,
        currency: dirData.currency,
        currencySymbol: dirData.currencySymbol,
        destinationSummary: dirData.destinationSummary,
        bestTimeToVisit: dirData.bestTimeToVisit,
        estimatedTotalTripBudgetInr: slicedDays.reduce((sum: number, d: any) => sum + d.estimatedDayTotalInr, 0) + (dirData.budgetDefaults.flightEstimateInr * travellersCount) + (dirData.budgetDefaults.hotelTierRate * Math.max(1, daysCountSafe - 1)),
        visa: dirData.visa,
        budgetDefaults: dirData.budgetDefaults,
        checklist: dirData.checklist,
        places: dirData.places,
        flightsAndHotels: {
          airportCode: dirData.airportCode,
          airportName: dirData.airportName,
          flightDuration: dirData.flightDuration,
          topAirlines: dirData.topAirlines,
          hotelAreas: dirData.hotelAreas,
        },
        days: slicedDays,
      };

      return res.json({
        success: true,
        source: 'curated-directory',
        data: packageData,
      });
    }

    // Dynamic country synthesizer for ANY other destination
    const dynamicFallback = buildGenericDestinationFallback({
      destination: destClean,
      origin,
      passportCountry,
      daysCount: Number(daysCount) || 4,
      budget,
      travellersCount: Number(travellersCount) || 2,
      travellerType,
      interests: Array.isArray(interests) ? interests : ['Sightseeing'],
    });

    return res.json({
      success: true,
      source: 'dynamic-synthesizer',
      data: dynamicFallback,
    });
  } catch (error: any) {
    console.error('Error generating AI agent itinerary:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate itinerary' });
  }
});

// 2. AI TRAVEL ASSISTANT CHAT ENDPOINT
app.post('/api/itinerary/assistant', async (req: Request, res: Response) => {
  try {
    const { message, destination = 'International Destination', currentPlanSummary, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are the TripYeah AI International Travel Concierge.
You provide crisp, practical, authentic, and highly actionable travel advice for international travellers visiting ${destination}.
Give structured, friendly, concise answers (2-3 paragraphs max or clean bullet points).
Always provide realistic local recommendations (metro lines, local currency cash tips, safety, hidden gems, visa rules, food).`;

    const userPrompt = `Context: Traveller is planning a trip to ${destination}.
Current Plan Summary: ${currentPlanSummary || 'Planning day by day itinerary'}
Conversation History: ${JSON.stringify(conversationHistory.slice(-4))}

User Question: ${message}`;

    const geminiReply = await generateWithGemini(`${systemPrompt}\n\n${userPrompt}`, false);

    if (geminiReply && typeof geminiReply === 'string' && geminiReply.trim()) {
      return res.json({ success: true, reply: geminiReply.trim() });
    }

    // Practical fallback reply tailored to user question
    const msgLower = message.toLowerCase();
    let reply = `Here are practical recommendations for your trip to ${destination}:\n\n`;

    if (msgLower.includes('food') || msgLower.includes('vegetarian') || msgLower.includes('eat') || msgLower.includes('restaurant')) {
      reply += `🍴 **Dining & Cuisine in ${destination}:**\n- Most international hotspots have abundant options ranging from authentic local street stalls to certified vegetarian/vegan cafés.\n- We recommend looking out for central food quarters where you can sample fresh regional dishes safely.\n- Tipping etiquette: In Japan, tipping is not practiced; in Europe, 5-10% is customary for great table service; in the US, 18-20% is standard.`;
    } else if (msgLower.includes('visa') || msgLower.includes('passport') || msgLower.includes('document')) {
      reply += `🛂 **Visa & Entry Essentials for ${destination}:**\n- Ensure your passport has at least 6 months validity from departure date and 2 blank pages.\n- Carry digital and physical copies of return flight tickets, confirmed hotel bookings, and travel insurance.\n- Use the Visa Assistant tab in TripYeah to check exact country-by-country embassy guidelines.`;
    } else if (msgLower.includes('budget') || msgLower.includes('cost') || msgLower.includes('money') || msgLower.includes('forex')) {
      reply += `💳 **Money & Forex Tips for ${destination}:**\n- Carry a zero-forex-markup card for contactless card payments.\n- Keep approximately $100–$150 equivalent in local cash for small cash-only kiosks, transit tickets, and local markets.\n- Always choose to be charged in local currency at POS machines rather than INR to avoid dynamic conversion fees.`;
    } else if (msgLower.includes('sim') || msgLower.includes('internet') || msgLower.includes('phone') || msgLower.includes('wifi')) {
      reply += `📱 **Connectivity & eSIM:**\n- We recommend purchasing an eSIM (e.g. Airalo, Nomad, or Holafly) before departure so your internet activates immediately on touchdown.\n- Alternatively, airport arrival kiosks provide local physical tourist SIM cards with verified identity check.`;
    } else {
      reply += `📍 **Trip Recommendation for ${destination}:**\n- Peak visiting hours for major monuments are between 11:00 AM and 3:30 PM. For iconic photos and shorter lines, aim for early morning (08:30–09:30 AM) or sunset twilight.\n- Public transit (metros and rapid trains) is typically the fastest and most budget-friendly way to get around ${destination}.\n- You can customize your itinerary days directly using the TripYeah interactive controls.`;
    }

    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Error in assistant chat:', error);
    res.status(500).json({ error: error?.message || 'Assistant failed to answer' });
  }
});

// 3. DESTINATION VISA DATABASE & CHECKER ENDPOINT
app.post('/api/visa/check', async (req: Request, res: Response) => {
  try {
    const { destination, passportCountry = 'India' } = req.body;
    const dest = (destination || '').trim();
    const destLower = dest.toLowerCase();

    // Check pre-compiled directory first
    const matchedKey = Object.keys(DESTINATION_DIRECTORY).find((k) =>
      destLower.includes(k) || (k === 'dubai' && destLower.includes('uae')) || (k === 'bali' && destLower.includes('indonesia')) || (k === 'japan' && (destLower.includes('tokyo') || destLower.includes('kyoto') || destLower.includes('osaka')))
    );

    if (matchedKey && DESTINATION_DIRECTORY[matchedKey]?.visa) {
      return res.json({
        success: true,
        data: DESTINATION_DIRECTORY[matchedKey].visa,
      });
    }

    // Try Gemini AI for dynamic country visa check
    const prompt = `You are an international immigration and visa officer for TripYeah.
Provide verified visa rules for a citizen with a ${passportCountry} passport travelling to "${dest}" for tourism.
Respond ONLY with a JSON object:
{
  "destination": "${dest}",
  "visaType": "Official visa category (e.g. Tourist eVisa / Visa on Arrival / Sticker Visa)",
  "entryRule": "Short summary e.g. eVisa Required / Visa-Free (30 Days)",
  "validity": "e.g. 90 days validity / 30 days per entry",
  "processingTime": "e.g. 5-7 business days",
  "estimatedFee": "Official fee in local currency and approx INR",
  "portalName": "Official government immigration portal name",
  "portalUrl": "Verified official website URL",
  "requiredDocuments": [
    "8 to 10 specific required documents"
  ],
  "steps": [
    "4 to 5 step-by-step application instructions"
  ]
}`;

    const aiVisa = await generateWithGemini(prompt, true);
    if (aiVisa && aiVisa.visaType && aiVisa.requiredDocuments) {
      return res.json({ success: true, data: aiVisa });
    }

    // Fallback to generic synthesizer visa
    const fallback = buildGenericDestinationFallback({
      destination: dest || 'International Destination',
      origin: 'New Delhi',
      passportCountry,
      daysCount: 4,
      budget: 'mid-range',
      travellersCount: 2,
      travellerType: 'Couple',
      interests: ['Sightseeing'],
    });

    return res.json({ success: true, data: fallback.visa });
  } catch (err: any) {
    console.error('Visa check error:', err);
    res.status(500).json({ error: 'Failed to verify visa details' });
  }
});

// START EXPRESS & MOUNT VITE MIDDLEWARES
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TripYeah Full-Stack server with International Planner AI Agent active on http://0.0.0.0:${PORT}`);
  });
}

start();
