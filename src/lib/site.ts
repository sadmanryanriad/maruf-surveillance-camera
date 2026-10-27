export const site = {
  name: "Maruf",
  tagline: "Surveillance, done properly.",
  phone: "+880 1790-424860",
  email: "hello@maruf-security.com",
  address: "Worthing, West Sussex · Local to you",
  hours: "Mon–Sat · 8am–8pm",
  whatsappNumber: "8801790424860",
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

export type Service = {
  id: string;
  code: string; // mono HUD tag, surveillance-native
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "installation",
    code: "CAM-01",
    title: "Home CCTV & Camera Installation",
    description:
      "Full survey, blind-spot mapping, and neat wiring — protecting your doors, driveway, and garden.",
    points: ["Colour night vision optics", "Discreet hidden cabling", "Family & pet zones"],
  },
  {
    id: "monitoring",
    code: "MON-02",
    title: "Mobile Access & Smart Alerts",
    description:
      "Crystal-clear footage on your phone. Instant alerts when family arrives or activity is spotted.",
    points: ["Phone & tablet live view", "Pet & human detection", "No hidden fees"],
  },
  {
    id: "maintenance",
    code: "SVC-03",
    title: "Local Support & Warranty",
    description:
      "Reliable Worthing & West Sussex technicians on call for health checks, tune-ups, and advice.",
    points: ["Prompt local callouts", "3-year system warranty", "Friendly local advice"],
  },
];

export type Step = { n: string; title: string; description: string };

export const processSteps: Step[] = [
  {
    n: "01",
    title: "Site survey",
    description:
      "We walk the property, map blind spots, and pinpoint the angles that actually matter.",
  },
  {
    n: "02",
    title: "System design",
    description:
      "You get a clear plan: camera positions, coverage, storage, and a fixed quote — no surprises.",
  },
  {
    n: "03",
    title: "Clean install",
    description:
      "Professional installers fit and configure everything, with cabling kept out of sight.",
  },
  {
    n: "04",
    title: "Monitor & support",
    description:
      "Footage on every device, smart alerts, and a team on call for the life of the system.",
  },
];

// Brands we install — shown in the marquee after the hero
export const brands: string[] = [
  "Hikvision",
  "Axis",
  "Ubiquiti",
  "Hanwha",
  "Verkada",
  "Dahua",
  "Reolink",
  "Bosch",
];

export type Testimonial = { quote: string; name: string; role: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "With two kids and a dog playing in the garden, having clear night vision across the driveway and lawn gives us complete peace of mind. Excellent installation.",
    name: "Mark & Sarah Jenkins",
    role: "Worthing Homeowners",
  },
  {
    quote:
      "They treated our home like it mattered. Cabling is invisible, the doorbell cam is razor sharp at night, and setup on our phones took five minutes.",
    name: "Priya Anand",
    role: "West Sussex Homeowner",
  },
  {
    quote:
      "From survey to install was 48 hours. Clean work, friendly advice, and we can check on our pets and front door right from our phones anywhere.",
    name: "Danielle Wu",
    role: "Goring-by-Sea Resident",
  },
  {
    quote:
      "Having local installers in Worthing who actually pick up the phone makes all the difference. Superb night vision and no hidden fees.",
    name: "James Okafor",
    role: "Worthing Resident",
  },
];

// Coverage floor-plan cameras (SVG coords, 480×360 viewbox)
export type CoverageCam = {
  x: number;
  y: number;
  dir: number; // degrees
  reach: number;
  spread: number; // degrees (half-angle)
};

export const coverageCams: CoverageCam[] = [
  { x: 70, y: 70, dir: 45, reach: 150, spread: 38 },
  { x: 410, y: 70, dir: 135, reach: 150, spread: 38 },
  { x: 230, y: 170, dir: 270, reach: 150, spread: 42 },
  { x: 410, y: 250, dir: 180, reach: 150, spread: 40 },
];

export type Stat = { value: number; suffix?: string; label: string };

export const stats: Stat[] = [
  { value: 4, suffix: "K", label: "Ultra-HD clarity" },
  { value: 98, suffix: "%", label: "Would recommend" },
];

export type Value = { title: string; description: string };

export const values: Value[] = [
  {
    title: "Coverage that thinks",
    description:
      "We design around real blind spots and real risks — not a catalogue of cameras nobody needs.",
  },
  {
    title: "Installed to last",
    description:
      "Weather-sealed hardware, tidy cabling, and configuration done right the first time.",
  },
  {
    title: "Always reachable",
    description:
      "Real people answer the phone. Priority callouts keep your system watching without gaps.",
  },
];

export type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "customised",
    name: "Customised to you",
    price: "Custom",
    cadence: "tailored package · one-off install",
    blurb: "Tailored smart protection designed specifically for your home, family, pets, and grounds.",
    features: [
      "Up to 12 cameras with optimal coverage",
      "Colour night vision optics",
      "Smart motion & pet/family zones",
      "Local secure storage + mobile access (no hidden fees)",
      "Neat, concealed cabling & weatherproof mounts",
      "Priority local Worthing & West Sussex support",
      "3-year comprehensive warranty",
    ],
    featured: true,
  },
];

export const paymentMethods: string[] = [
  "Visa",
  "Mastercard",
  "Amex",
  "Apple Pay",
  "Google Pay",
  "Bank transfer",
];

export type Social = {
  name: string;
  href: string;
  icon: "facebook" | "instagram" | "x" | "linkedin";
};

// Demo placeholders — swap in Maruf's real profile URLs before launch.
export const socials: Social[] = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "X", href: "#", icon: "x" },
  { name: "LinkedIn", href: "#", icon: "linkedin" },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Is installation included in the price?",
    a: "Yes. Every install price covers the site survey, hardware fitting, configuration, and a full walkthrough of your system.",
  },
  {
    q: "Do you offer monthly payment plans?",
    a: "We offer interest-free financing over 6 or 12 months. Ask for details in your survey.",
  },
  {
    q: "What happens to my footage?",
    a: "Footage is encrypted and stored to your own local secure recorder and phone. You own your data with no monthly cloud subscription required.",
  },
  {
    q: "Can you upgrade an existing system?",
    a: "Often, yes. We can assess your current cameras and cabling during our survey and tell you honestly what's worth keeping.",
  },
];
