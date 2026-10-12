/*
  ANYA - shared site configuration
  ---------------------------------
  Everything that might change (contact details, the intro video path,
  the treatment list) lives here, so it only has to be edited in one place.
  All business details below are FICTIONAL placeholders.
*/

const ANYA_CONFIG = {
  brand: {
    name: "ANYA",
    tagline: "A considered approach to skincare."
  },

  // Opening animation (the Higgsfield droplet video).
  // Change these paths if you rename or move the files.
  intro: {
    videoSrc: "assets/video/anya-intro.mp4",
    posterSrc: "assets/images/intro-poster.jpg",     // first frame of the video
    fallbackSrc: "assets/images/intro-fallback.jpg", // last frame (ANYA wordmark)
    sessionKey: "anya-intro-seen"                    // sessionStorage flag, not personal data
  },

  // WhatsApp click-to-chat.
  // IMPORTANT: replace the number below with the real business number in
  // international format, digits only, no "+" or spaces (e.g. "60123456789"
  // for a Malaysian number). While it still contains "X", every WhatsApp
  // button shows a "demo" message instead of opening a chat with a fake number.
  whatsapp: {
    number: "60XXXXXXXXX",
    messages: {
      general: "Hello ANYA, I would like to enquire about your skincare treatments.",
      treatment: "Hello ANYA, I have a question about one of your treatments.",
      booking: "Hello ANYA, I would like to ask about booking an appointment."
    }
  },

  // Placeholder contact details (shown in the footer and on the contact page)
  contact: {
    address: ["Level 2, 18 Jalan Contoh", "50450 Kuala Lumpur, Malaysia"],
    phone: "+60 3-0000 0000",
    email: "hello@anya-studio.example"
  },

  // Demonstration opening hours. day: 0 = Sunday ... 6 = Saturday
  // open/close are 24h hours; null means closed.
  hours: [
    { label: "Tuesday – Saturday", days: [2, 3, 4, 5, 6], open: 10, close: 19 },
    { label: "Sunday", days: [0], open: 10, close: 16 },
    { label: "Monday", days: [1], open: null, close: null }
  ],

  social: [
    { name: "Instagram" },
    { name: "Facebook" },
    { name: "TikTok" }
  ],

  // Treatments - the single source used by the homepage, treatments page
  // and booking form. Prices are fictional demonstration prices.
  services: [
    {
      id: "signature",
      name: "The Signature Facial",
      duration: 60,
      price: 180,
      featured: true,
      description: "A customized facial experience featuring cleansing, gentle exfoliation, a hydrating mask, and moisturizing care.",
      image: "https://images.unsplash.com/photo-1706795033728-9232ef548a16?auto=format&fit=crop&w=900&q=75",
      alt: "A client lying back with eyes closed as a therapist gently massages her face"
    },
    {
      id: "hydration",
      name: "The Hydration Ritual",
      duration: 45,
      price: 150,
      featured: true,
      description: "A moisture-focused facial centered on gentle cleansing, hydration, and a soothing finishing routine.",
      image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=900&q=75",
      alt: "Hands releasing a drop of serum from a glass dropper bottle"
    },
    {
      id: "renewal",
      name: "The Renewal Facial",
      duration: 60,
      price: 200,
      featured: true,
      description: "A gentle exfoliation-focused facial with a personalized finishing routine. Suitability should be assessed before treatment.",
      image: "https://images.unsplash.com/photo-1761718209835-c8586b7dcac0?auto=format&fit=crop&w=900&q=75",
      alt: "A soft brush applying a cream mask to a client's cheek"
    },
    {
      id: "consultation",
      name: "The Skin Consultation",
      duration: 20,
      price: 50,
      featured: false,
      description: "A consultation to discuss skincare preferences, existing routines, and suitable studio services.",
      image: "https://images.unsplash.com/photo-1739980213756-753aea153bb8?auto=format&fit=crop&w=900&q=75",
      alt: "Three skincare bottles arranged on stone with dried flowers on a beige background"
    }
  ]
};

/* ---------- small helpers shared by the page scripts ---------- */

function getService(id) {
  return ANYA_CONFIG.services.find(function (s) { return s.id === id; }) || null;
}

function formatPrice(amount) {
  return "RM" + amount;
}

function formatDuration(minutes) {
  return minutes + " minutes";
}

// Returns a real wa.me link, or null if the number is still the placeholder.
function getWhatsAppLink(messageKey) {
  const number = ANYA_CONFIG.whatsapp.number;
  if (!/^\d{8,15}$/.test(number)) return null;

  const text = ANYA_CONFIG.whatsapp.messages[messageKey] || ANYA_CONFIG.whatsapp.messages.general;
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
}
