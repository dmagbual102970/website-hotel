// ---------------------------------------------------------------------------
// Sample Lodge Hotel — demo site content model.
// Placeholder brand, contact details and copy for a fictional boutique hotel on
// the Papua New Guinea coast. Edit this file and run "npm run build".
// ---------------------------------------------------------------------------

export const site = {
  name: "Sample Lodge Hotel",
  legalName: "Sample Lodge Hotel & Apartments",
  tagline: "A boutique hotel on the Papua New Guinea coast",
  description:
    "Sample Lodge Hotel is a privately run boutique hotel on a quiet stretch of the Papua New Guinea coast, set amongst tropical gardens and palm-lined lawns.",
  longDescription:
    "Sample Lodge Hotel is a privately run boutique hotel on a quiet stretch of the Papua New Guinea coast, set amongst tropical gardens and palm-lined lawns. The hotel offers rooms, serviced apartments and self-contained cottages, ten minutes from the airport and five minutes from the town centre.",
  url: "https://www.samplewebsite.com",
  brandTop: "Sample Lodge",
  brandSub: "Hotel & Apartments",
  sampleNotice: "",
  hideStats: false,
  phoneLocal: "+675 123 4567",
  phoneLocalRaw: "+6751234567",
  phoneMobile: "+675 123 4568",
  phoneMobileRaw: "+6751234568",
  email: "admin@samplewebsite.com",
  street: "1234 Sample Address",
  postal: ["1234 Sample Address", "Location", "Papua New Guinea"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Papua+New+Guinea",
  checkIn: "2:00pm",
  checkOut: "10:00am",
};

// ---------------------------------------------------------------------------
// Rooms / accommodation
// ---------------------------------------------------------------------------
export const rooms = [
  {
    slug: "bay-apartments",
    name: "Bay Apartments",
    short: "Two-bedroom apartments with an open plan kitchen and a balcony over the bay.",
    rate: "PGK 990",
    rateNote: "per night",
    banner: "img/banner-bay-apartments.jpg",
    images: [
      { src: "img/rooms/bay-2.jpg", alt: "The apartment building framed by palms" },
      { src: "img/rooms/bay-1.jpg", alt: "Bedroom in a Bay Apartment" },
      { src: "img/rooms/bay-3.jpg", alt: "Open plan living and dining area" },
    ],
    facts: [
      { label: "Sleeps", value: "Up to 4 guests" },
      { label: "Bedrooms", value: "Double + twin" },
      { label: "Outlook", value: "Over the bay" },
      { label: "Bathroom", value: "Private ensuite" },
    ],
    paragraphs: [
      "Modern and spacious, our tropical style apartments each feature a double and a twin bedroom, a stylish open plan kitchen, dining and lounge area, an ensuite bathroom, cable television, air-conditioning and ceiling fans, and a veranda or balcony overlooking the bay.",
      "Rooms stay naturally cool on the ocean breeze, and the sights and sounds of the water are never far away.",
      "The apartments are perfect for families, or for guests who simply want more space to spread out.",
    ],
    amenities: [
      "High speed Wi-Fi",
      "Room service",
      "Free car parking",
      "Complimentary water",
      "Access to the gym",
      "Shuttle transfers",
    ],
  },
  {
    slug: "seaside-room",
    name: "Seaside Room",
    short: "Oceanfront cottages surrounded by lush gardens, with a balcony made for listening to the sea.",
    rate: "PGK 460",
    rateNote: "per night",
    banner: "img/banner-seaside.jpg",
    images: [
      { src: "img/rooms/seaside-3.jpg", alt: "Seaside cottages framed by palms" },
      { src: "img/rooms/seaside-1.jpg", alt: "Twin beds in a Seaside Room" },
      { src: "img/rooms/seaside-2.jpg", alt: "Oceanfront cottages along the garden path" },
    ],
    facts: [
      { label: "Sleeps", value: "Up to 4 guests" },
      { label: "Beds", value: "Queen + twin" },
      { label: "Outlook", value: "Oceanfront" },
      { label: "Bathroom", value: "Private ensuite" },
    ],
    paragraphs: [
      "Our seaside cottages sit along a quiet oceanfront stretch, surrounded by lush gardens. Rooms are furnished in fresh whites and include one queen and one twin bed, cable television, air-conditioning and fans, an ensuite bathroom, a desk area, tea and coffee making facilities, a fridge, and a balcony or veranda to enjoy the view.",
      "Guests will feel immediately relaxed listening to the gentle sounds of the ocean, which can be heard from every room.",
    ],
    amenities: [
      "High speed Wi-Fi",
      "Room service",
      "Free car parking",
      "Complimentary water",
      "Access to the gym",
      "Shuttle transfers",
    ],
  },
  {
    slug: "long-term-cottage",
    name: "Long Term Cottage",
    short: "Self-contained houses available for longer stays. Availability is limited — please enquire.",
    rate: "Enquire",
    rateNote: "monthly rates available",
    banner: "img/banner-cottage.jpg",
    images: [
      { src: "img/rooms/cottage-2.jpg", alt: "Self-contained cottages set in tropical gardens" },
      { src: "img/rooms/cottage-1.jpg", alt: "Poolside lawn outside the long term cottages" },
    ],
    facts: [
      { label: "Stay length", value: "Long term" },
      { label: "Style", value: "Self-contained" },
      { label: "Outlook", value: "Gardens & pool" },
      { label: "Availability", value: "Limited" },
    ],
    paragraphs: [
      "We keep a small number of self-contained units for longer-term rental to private clients. Availability is limited.",
      "Please contact management directly to check current availability and monthly rates.",
    ],
    amenities: [
      "High speed Wi-Fi",
      "Room service",
      "Free car parking",
      "Complimentary water",
      "Access to the gym",
      "Shuttle transfers",
    ],
  },
  {
    slug: "garden-terrace",
    name: "Garden Terrace",
    short: "Twin or double rooms overlooking sweeping gardens and the oceanfront pool, each with a veranda.",
    rate: "PGK 360",
    rateNote: "per night",
    banner: "img/banner-garden.jpg",
    images: [
      { src: "img/rooms/garden-1.jpg", alt: "Garden Terrace twin room" },
      { src: "img/rooms/garden-2.jpg", alt: "Garden Terrace room with garden outlook" },
      { src: "img/rooms/garden-3.jpg", alt: "Garden path leading to the Terrace rooms" },
    ],
    facts: [
      { label: "Sleeps", value: "2 guests" },
      { label: "Beds", value: "Twin or double" },
      { label: "Outlook", value: "Gardens & pool" },
      { label: "Bathroom", value: "Private ensuite" },
    ],
    paragraphs: [
      "Tranquil and spacious twin or double bedrooms overlook sweeping manicured gardens and the oceanfront pool. Garden Terrace rooms are furnished with air-conditioning and ceiling fans, a TV, an ensuite bathroom, tea and coffee making facilities and a fridge.",
      "Each room has a small veranda with lounge chairs — the ideal spot to relax and watch the sun go down.",
    ],
    amenities: [
      "High speed Wi-Fi",
      "Room service",
      "Free car parking",
      "Complimentary water",
      "Access to the gym",
      "Shuttle transfers",
    ],
  },
  {
    slug: "budget-room",
    name: "Budget Room",
    short: "Comfortable twin rooms around a courtyard garden, with full access to the lodge and pool.",
    rate: "PGK 160",
    rateNote: "per night",
    banner: "img/banner-budget.jpg",
    images: [
      { src: "img/rooms/budget-1.jpg", alt: "Twin beds in a Budget Room" },
    ],
    facts: [
      { label: "Sleeps", value: "2 guests" },
      { label: "Beds", value: "Twin" },
      { label: "Bathroom", value: "Shared" },
      { label: "Outlook", value: "Courtyard garden" },
    ],
    paragraphs: [
      "Comfortable twin bedrooms set around an immaculate courtyard garden. Each room has a fan and access to a shared bathroom. All of the hotel's amenities, including use of the swimming pool, are available to budget room guests.",
      "This room type suits backpackers and independent travellers looking for a simple, friendly base.",
    ],
    amenities: [
      "High speed Wi-Fi",
      "Room service",
      "Free car parking",
      "Complimentary water",
      "Access to the gym",
      "Shuttle transfers",
    ],
  },
];

// ---------------------------------------------------------------------------
// Facilities
// ---------------------------------------------------------------------------
export const facilities = [
  {
    slug: "art-gallery",
    name: "Art & Craft Gallery",
    short: "Indigenous timber carvings, artefacts and crafts, commissionable and for sale.",
    banner: "img/banner-art-gallery.jpg",
    images: [
      { src: "img/facilities/art-1.jpg", alt: "Carvings and crafts displayed in the gallery" },
      { src: "img/facilities/art-2.jpg", alt: "Handmade artefacts at a craft market" },
    ],
    paragraphs: [
      "The gallery within the lodge grounds offers rare and unique indigenous timber carvings, which can be commissioned and purchased as gifts and souvenirs.",
      "We work with local carvers and makers as part of the hotel's commitment to supporting local enterprise and tourism in Papua New Guinea. Profits from the gallery go directly to the craftspeople, as the hotel takes no commission.",
      "Traditional carvings and woven pieces can also be seen throughout the hotel as features within the architecture and decor.",
    ],
    hours: [],
  },
  {
    slug: "waterfront-bar-restaurant",
    name: "Waterfront Bar & Restaurant",
    short: "A fusion menu, a hand-carved bar and a long deck over the ocean.",
    banner: "img/banner-waterfront.jpg",
    images: [
      { src: "img/facilities/waterfront-1.jpg", alt: "Tables set in the restaurant" },
      { src: "img/facilities/waterfront-2.jpg", alt: "The bar and lounge area" },
    ],
    paragraphs: [
      "The Waterfront Bar & Restaurant combines a large restaurant and a spacious bar, both fully air-conditioned and connected by a vast deck that runs the length of the building.",
      "Every table has a clear view over the ocean and the mountains beyond, with a soft sea breeze providing natural cooling.",
      "The bar and restaurant are styled with bright, modern furnishings and local artefacts, including a rare continuous timber-carved bar.",
      "The kitchen serves a fusion menu built around fresh, locally caught fish and regional produce.",
      "Dine inside the air-conditioned restaurant or al fresco on the deck, with a gentle breeze and sunset views at both.",
    ],
    hours: [
      { label: "Breakfast", value: "6:30am – 9:30am (Sat/Sun until 10am)" },
      { label: "Lunch", value: "11:00am – 1:30pm (Sat/Sun until 2pm)" },
      { label: "Dinner", value: "4:00pm – 9:00pm" },
      { label: "Bar", value: "Open with the restaurant at lunch and dinner" },
    ],
  },
  {
    slug: "cafe-giftshop",
    name: "Cafe & Gift Shop",
    short: "Highlands Arabica coffee, freshly baked cakes and PNG crafts under one roof.",
    banner: "img/banner-cafe.jpg",
    images: [
      { src: "img/facilities/cafe-1.jpg", alt: "The cafe interior" },
      { src: "img/facilities/cafe-2.jpg", alt: "The cafe and gift shop frontage" },
    ],
    paragraphs: [
      "For casual dining, coffee and snacks throughout the day, guests can enjoy refreshments at the hotel cafe.",
      "Papua New Guinea's Highlands are famous for their Arabica coffee, served here alongside freshly baked cakes and desserts.",
      "A selection of traditional artefacts, jewellery and crafts from the region is available to purchase as gifts and souvenirs in the adjoining shop.",
    ],
    hours: [{ label: "Opening hours", value: "Monday – Saturday, 8:00am – 5:30pm" }],
  },
  {
    slug: "gym-fitness-centre",
    name: "Gym & Fitness Centre",
    short: "A fully equipped gym with instructor-led aerobic and stretch classes.",
    banner: "img/banner-gym.jpg",
    images: [
      { src: "img/facilities/gym-1.jpg", alt: "Cardio equipment in the gym" },
      { src: "img/facilities/gym-2.jpg", alt: "Strength training area in the fitness centre" },
    ],
    paragraphs: [
      "The Gym & Fitness Centre is a fully functional gym with a range of popular exercise machines and free weights.",
      "The centre also runs fitness classes, including aerobic and stretch sessions led by a qualified instructor.",
      "Guests have access to the gym, and access is also available through private membership.",
    ],
    hours: [
      { label: "Monday – Friday", value: "8:00am – 11:00am and 4:30pm – 8:00pm" },
      { label: "Saturday", value: "4:00pm – 8:00pm" },
      { label: "Sunday", value: "Closed" },
      { label: "Classes", value: "Ask reception for the class schedule and membership rates" },
    ],
  },
  {
    slug: "conference-boardroom",
    name: "Conference & Boardroom",
    short: "Two meeting spaces for 30 or 150 guests, a step from the restaurant and deck.",
    banner: "img/banner-conference.jpg",
    images: [
      { src: "img/facilities/conference-1.jpg", alt: "The boardroom set for a meeting" },
      { src: "img/facilities/conference-2.jpg", alt: "Conference room arranged for delegates" },
    ],
    paragraphs: [
      "The hotel caters for business as well as leisure travellers, with two fully equipped meeting spaces for small to medium sized groups.",
      "The Board Room is a bright, quiet room that seats up to 30 guests boardroom style.",
      "The Conference Room is a larger function space for up to 150 guests in theatre style, and can be set up to suit other layouts. It sits just below the Waterfront Bar & Restaurant, convenient for tea, coffee and lunch breaks.",
      "To discuss your requirements in detail, please contact reception directly.",
    ],
    hours: [
      { label: "Board Room", value: "Up to 30 guests, boardroom style" },
      { label: "Conference Room", value: "Up to 150 guests, theatre style" },
    ],
  },
  {
    slug: "business-centre-wireless-internet",
    name: "Business Centre & Wi-Fi",
    short: "Complimentary wireless internet in rooms and shared areas, plus business support.",
    banner: "img/banner-business.jpg",
    images: [],
    paragraphs: [
      "Wireless internet is available to guests throughout the hotel's rooms and shared areas, so you can keep up with work, family or travel plans from the garden, the deck or your veranda.",
      "A business centre supports guests who need to print, scan or send documents during their stay. Please speak with reception about access, equipment and any applicable charges.",
      "For longer stays, meetings or conference support, the Board Room and Conference Room can be booked through reception.",
    ],
    hours: [
      { label: "Wi-Fi", value: "Complimentary for hotel guests" },
      { label: "Business centre", value: "Printing, scanning and documents — ask reception" },
    ],
  },
  {
    slug: "swimming-pool",
    name: "Swimming Pool",
    short: "An oceanfront pool with sun loungers and views out over the water.",
    banner: "img/banner-pool.jpg",
    images: [
      { src: "img/facilities/pool-1.jpg", alt: "Sun loungers on the lawn beside the pool" },
      { src: "img/facilities/pool-2.jpg", alt: "The pool terrace looking out to sea" },
    ],
    paragraphs: [
      "The swimming pool sits at the water's edge, so guests can enjoy views of the ocean and the mountains beyond while they swim.",
      "Sun loungers surround the pool — the perfect place to relax in the tropical sunshine.",
      "There is no lifeguard on duty, so children are not permitted to use the pool unless accompanied by an adult.",
    ],
    hours: [],
  },
  {
    slug: "spa-wellness",
    name: "Spa & Wellness",
    short: "Massage and spa treatments by appointment, with a fully trained therapist.",
    banner: "img/banner-spa.jpg",
    images: [],
    paragraphs: [
      "The lodge spa offers a selection of massage and wellness treatments by appointment.",
      "Therapies are provided by a fully trained massage therapist in a quiet, private treatment room.",
      "For treatments, prices and bookings, please enquire at reception.",
    ],
    hours: [{ label: "Bookings", value: "By appointment — through reception" }],
  },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const services = [
  {
    slug: "laundry-room-service",
    name: "Laundry & Room Service",
    short: "Laundry, pressing and in-room dining delivered to your door.",
    banner: "img/banner-laundry.jpg",
    images: [
      { src: "img/facilities/laundry-1.jpg", alt: "Breakfast served in a guest room" },
    ],
    paragraphs: [
      "Laundry, dry cleaning and pressing services are available to house guests, with same-day turnaround when items are handed in early in the morning.",
      "Room service runs during restaurant hours, so breakfast, lunch or dinner can be enjoyed on your veranda or balcony.",
      "To arrange laundry or in-room dining, please contact reception. Charges apply and are confirmed before the service is provided.",
    ],
    hours: [
      { label: "Laundry", value: "Daily — hand in by 9:00am for same-day service" },
      { label: "Room service", value: "During Waterfront Bar & Restaurant hours" },
      { label: "Enquiries", value: "Please contact reception" },
    ],
  },
  {
    slug: "airport-transfers",
    name: "Airport Transfers",
    short: "Meet-and-greet transfers from the airport, ten minutes from the lodge.",
    banner: "img/banner-airport.jpg",
    images: [
      { src: "img/facilities/transfers-1.jpg", alt: "The airport departures hall" },
    ],
    paragraphs: [
      "The hotel is ten minutes from the airport, on the main road and just a few minutes from the town centre.",
      "Transfers must be booked with reception. Please enquire for further information and bookings. Fees apply.",
      "Flights arrive daily. Share your flight details when booking so the team can meet you on arrival.",
    ],
    hours: [
      { label: "Operating times", value: "5:00am – 6:00pm daily" },
      { label: "Bookings", value: "Through reception — please share your flight details" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "grounds", label: "The Grounds" },
  { id: "dining", label: "Dining" },
  { id: "culture", label: "Culture & Craft" },
  { id: "coast", label: "The Coast" },
];

export const gallery = [
  { src: "img/gallery/g01.jpg", thumb: "img/gallery/g01-thumb.jpg", alt: "A shaded path through the tropical gardens", category: "grounds" },
  { src: "img/gallery/g02.jpg", thumb: "img/gallery/g02-thumb.jpg", alt: "The swimming pool and sun terrace", category: "grounds" },
  { src: "img/gallery/g03.jpg", thumb: "img/gallery/g03-thumb.jpg", alt: "Loungers beside the pool", category: "grounds" },
  { src: "img/gallery/g04.jpg", thumb: "img/gallery/g04-thumb.jpg", alt: "A timber cottage among the palms", category: "grounds" },
  { src: "img/gallery/g05.jpg", thumb: "img/gallery/g05-thumb.jpg", alt: "Late afternoon by the pool", category: "grounds" },
  { src: "img/gallery/g06.jpg", thumb: "img/gallery/g06-thumb.jpg", alt: "Palms along the beach", category: "grounds" },
  { src: "img/gallery/g07.jpg", thumb: "img/gallery/g07-thumb.jpg", alt: "A table set in the restaurant", category: "dining" },
  { src: "img/gallery/g08.jpg", thumb: "img/gallery/g08-thumb.jpg", alt: "Breakfast served in the room", category: "dining" },
  { src: "img/gallery/g09.jpg", thumb: "img/gallery/g09-thumb.jpg", alt: "Handmade crafts at the local market", category: "culture" },
  { src: "img/gallery/g10.jpg", thumb: "img/gallery/g10-thumb.jpg", alt: "A carved timber panel", category: "culture" },
  { src: "img/gallery/g11.jpg", thumb: "img/gallery/g11-thumb.jpg", alt: "A traditional carved canoe prow", category: "culture" },
  { src: "img/gallery/g12.jpg", thumb: "img/gallery/g12-thumb.jpg", alt: "Sunset over the water", category: "coast" },
];

// ---------------------------------------------------------------------------
// Home page content
// ---------------------------------------------------------------------------
export const slides = [
  {
    image: "img/hero-home-1.jpg",
    eyebrow: "Papua New Guinea",
    title: "Welcome to Sample Lodge Hotel",
    text: "A quiet escape on the coast",
    primary: { label: "Explore accommodation", href: "accommodation/bay-apartments.html" },
    secondary: { label: "See the gallery", href: "gallery.html" },
  },
  {
    image: "img/hero-home-2.jpg",
    eyebrow: "Rooms & apartments",
    title: "Space to settle in",
    text: "For every kind of traveller",
    primary: { label: "View the rooms", href: "accommodation/bay-apartments.html" },
    secondary: { label: "Discover the lodge", href: "location.html" },
  },
  {
    image: "img/hero-home-3.jpg",
    eyebrow: "Evenings by the pool",
    title: "Where the day slows down",
    text: "Dining, spa and sunsets",
    primary: { label: "Dining & bar", href: "facilities/waterfront-bar-restaurant.html" },
    secondary: { label: "Plan your stay", href: "contact.html" },
  },
];

export const stats = [
  { value: "54", label: "Rooms & suites" },
  { value: "12", label: "Serviced apartments" },
  { value: "10", label: "Long-term cottages" },
  { value: "10", label: "Minutes from town" },
];

export const highlights = [
  { icon: "wifi", title: "High speed Wi-Fi", text: "Reliable internet for work or leisure, across the lodge." },
  { icon: "utensils", title: "Waterfront restaurant", text: "A long deck overlooking the ocean and the mountains." },
  { icon: "heart", title: "Health & fitness", text: "It is easy to get swept away here — staying fit is easy too." },
  { icon: "presentation", title: "Conference centre", text: "The ideal setting for business or education conferences." },
  { icon: "briefcase", title: "Business centre", text: "Balance work and play, with support when you need it." },
  { icon: "car", title: "Airport pickup", text: "Transfers from the airport, ten minutes away." },
];

export const contactFaq = [
  {
    q: "How far is the hotel from the airport?",
    a: "Sample Lodge Hotel is a 10 minute drive from the airport on the main road. Airport transfers can be arranged through reception between 5:00am and 6:00pm.",
  },
  {
    q: "What time is check-in and check-out?",
    a: "Check-in is from 2:00pm and check-out is by 10:00am. If you need an early arrival or a late departure, speak with reception and the team will do their best to help.",
  },
  {
    q: "Do you have Wi-Fi and parking?",
    a: "Yes — wireless internet is complimentary across the lodge, and free car parking is available for guests.",
  },
  {
    q: "Can I hold a conference or meeting at the hotel?",
    a: "The hotel has a Board Room for up to 30 guests and a Conference Room for up to 150 guests in theatre style. Contact reception to discuss layouts, catering and equipment.",
  },
];
