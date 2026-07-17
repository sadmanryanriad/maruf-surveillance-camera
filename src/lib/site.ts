export const site = {
  name: "Maruf",
  tagline: "Surveillance, done properly.",
  phone: "+1 (555) 018-4477",
  email: "hello@maruf-security.com",
  address: "24 Watchtower Ave, Suite 300, Metro City",
  hours: "Mon–Sat · 8am–8pm",
};

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Payments", href: "/payments" },
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
    title: "CCTV & Camera Installation",
    description:
      "Site survey, coverage planning, and clean, concealed installs — from a single doorway camera to a full multi-zone system.",
    points: ["4K & low-light optics", "Discreet cabling", "Coverage mapping"],
  },
  {
    id: "monitoring",
    code: "MON-02",
    title: "24/7 Monitoring",
    description:
      "Live and recorded footage in your pocket. Smart motion alerts flag what matters and ignore what doesn't.",
    points: ["Mobile & desktop apps", "Smart motion alerts", "Cloud + local storage"],
  },
  {
    id: "maintenance",
    code: "SVC-03",
    title: "Maintenance & Support",
    description:
      "Systems stay sharp with scheduled health checks, firmware updates, and fast callouts when you need a hand.",
    points: ["Scheduled health checks", "Firmware updates", "Priority callouts"],
  },
  {
    id: "smart",
    code: "NET-04",
    title: "Smart Integration",
    description:
      "Tie cameras into access control, lighting, and alarms so your whole property responds as one system.",
    points: ["Access control", "Alarm & lighting", "Automation rules"],
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
      "Certified installers fit and configure everything, with cabling kept out of sight.",
  },
  {
    n: "04",
    title: "Monitor & support",
    description:
      "Footage on every device, smart alerts, and a team on call for the life of the system.",
  },
];

// Rotating trust strip
export const marquee: string[] = [
  "Licensed & insured",
  "4K ultra-HD",
  "24/7 monitoring",
  "Certified installers",
  "5-year warranty",
  "Night-vision optics",
  "Cloud + local backup",
  "Smart motion alerts",
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
      "Maruf mapped our whole warehouse and found blind spots our old installer completely missed. Footage is crystal clear and the app is genuinely easy for my floor managers.",
    name: "Marcus Reyes",
    role: "Operations Director, Bayline Logistics",
  },
  {
    quote:
      "They treated our home like it mattered. Cabling is invisible, the doorbell cam is razor sharp at night, and setup on our phones took five minutes.",
    name: "Priya Anand",
    role: "Homeowner",
  },
  {
    quote:
      "From quote to install was 48 hours. Clean work, no upsell, and the coverage plan they handed us was more thorough than anything the big-box guys offered.",
    name: "Danielle Wu",
    role: "Store Manager, Meridian Retail",
  },
  {
    quote:
      "The 24/7 monitoring caught an after-hours break-in attempt and dispatched before I even woke up. Worth every dollar.",
    name: "James Okafor",
    role: "Owner, Okafor Auto Group",
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
  { value: 500, suffix: "+", label: "Systems installed" },
  { value: 12, suffix: "yrs", label: "Protecting the city" },
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
    id: "home",
    name: "Home",
    price: "$690",
    cadence: "from · one-off install",
    blurb: "Essential coverage for a house or apartment.",
    features: [
      "Up to 4 cameras",
      "1080p / 4K options",
      "Mobile app access",
      "7-day cloud clips",
      "1-year warranty",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$1,850",
    cadence: "from · one-off install",
    blurb: "Multi-zone coverage for shops, offices, and sites.",
    features: [
      "Up to 12 cameras",
      "4K low-light optics",
      "Smart motion zones",
      "30-day cloud + local NVR",
      "Priority support",
      "3-year warranty",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "tailored quote",
    blurb: "Campuses, chains, and integrated security stacks.",
    features: [
      "Unlimited cameras",
      "Access control + alarms",
      "24/7 monitored response",
      "Dedicated account team",
      "SLA & 5-year warranty",
    ],
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
    a: "We offer interest-free financing over 6 or 12 months on Business and Enterprise systems. Ask for details in your quote.",
  },
  {
    q: "What happens to my footage?",
    a: "Footage is encrypted and stored to your plan — cloud, a local recorder, or both. You own your data and can export it anytime.",
  },
  {
    q: "Can you upgrade an existing system?",
    a: "Often, yes. We can assess your current cameras and cabling and tell you honestly what's worth keeping.",
  },
];
