export const STATUS_MAP = {
  1: { label: "Created", color: "bg-blue-500 text-white" }, // bg-info
  2: { label: "Pending Approval", color: "bg-indigo-500 text-white" }, // bg-primary
  3: { label: "Approved", color: "bg-green-500 text-white" }, // bg-success
  4: { label: "Confirmed", color: "bg-yellow-400 text-gray-800" }, // bg-warning
  5: { label: "Cancelled", color: "bg-red-500 text-white" }, // bg-danger
};
export const quoteStatusList = [
  { value: "", label: "All Quotes" },
  { value: "Created", label: "Created" },
  { value: "Pending Approval", label: "Pending Approval" },
  { value: "Sent", label: "Sent" },
  { value: "Confirmed - Awaiting Payment", label: "Confirmed - Awaiting Payment" },
  { value: "Confirmed - Deposit Paid", label: "Confirmed - Deposit Paid" },
  { value: "Invoice Sent", label: "Invoice Sent" },
  { value: "Invoice Sent - Awaiting Confirmation", label: "Invoice Sent - Awaiting Confirmation" },
  { value: "Fully Paid", label: "Fully Paid" },
  { value: "Cancelled", label: "Cancelled" },
];


export const REVIEW_DATA = [
  {
    reviewer_name: "Frank Romano",
    rating: "5 Stars",
    review_text:
      "Extraordinary company who delivered a superb product that transformed our house into a beautiful color show at night. We are beyond pleased with our outdoor lighting and highly recommend CANstar to anyone looking for a company true to their word.",
  },
  {
    reviewer_name: "Bhanu Mehta",
    rating: "5 Stars",
    review_text:
      "I normally don't leave reviews but we highly recommend Can Star Lights. Their recommendations and installation work were exceptional. Everything has been great with the lights. Don't think otherwise, just do it!",
  },
  {
    reviewer_name: "Wade Brintnell",
    rating: "5 Stars",
    review_text:
      "Absolutely thrilled with our lighting! Canstar did a fantastic job and their App is simply amazing. Highly recommend their work!",
  },
  {
    reviewer_name: "Ellwood Daycare",
    rating: "5 Stars",
    review_text:
      "Canstar Light Edmonton and the team, according to me, is the ultimate 'A' team. Hands down the best in the business in Edmonton. Kudos!",
  },
  {
    reviewer_name: "Cherilyn Vreim",
    rating: "5 Stars",
    review_text:
      "Amazing service. After 2 years, they are still willing to help out to make our house magical. Very smart people!",
  },
  {
    reviewer_name: "Catherine Battiste",
    rating: "5 Stars",
    review_text:
      "Great product and awesome service! We love our lights! Had an issue and got a response very quickly. Definitely recommend going with this company!",
  },
];

export const REASON_OPTIONS = [
  { value: "", label: "-- Select Reason --" },
  { value: "1", label: "Cost" },
  { value: "2", label: "Complexity" },
  { value: "3", label: "Better price from competitor" },
  { value: "4", label: "Other" },
];

export const SANCTION_REASON_LABELS = {
  1: "Cost",
  2: "Complexity",
  3: "Better price from competitor",
  4: "Other",
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const STATUS_STYLES = {
  upcoming: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500" },
  in_progress: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
};

export const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5];
export const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export const PROCESS_STEPS = [
  { id: 1, label: "Prep Stage", icon: "ph:clipboard-text" },
  { id: 2, label: "On the Way", icon: "ph:car" },
  { id: 3, label: "Controller Box", icon: "ph:map-pin-area" },
  { id: 4, label: "Post Installation", icon: "ph:check-square" },
  { id: 5, label: "Supplies & Drop-off", icon: "ph:package" },
  { id: 6, label: "Time Entry", icon: "ph:clock" },
  { id: 7, label: "Completion", icon: "ph:flag-checkered" },
];

export const STEP_KEYS = {
  1: "prep",
  2: "onTheWay",
  3: "controllerBox",
  4: "postInstall",
  5: "dropOff",
  6: "timeEntry",
};

export const DB_COLUMN_MAP = {
  1: "prep_data",
  2: "on_the_way_data",
  3: "controller_box_data",
  4: "post_install_data",
  5: "drop_off_data",
  6: "time_entry_data",
};

// ── Track Types for Prep Checklist ───────────────────────────────
export const TRACK_TYPES = ["5.33ft Track", "6ft Track", "6.67ft Track", "7ft Track"];

export const TRACK_SIZES_OPTIONS = [
  { value: "Residential 48\"", label: "Residential 48\"" },
  { value: "Residential 72\"", label: "Residential 72\"" },
  { value: "Special profile", label: "Special profile" },
];

// ── Jumper/Connector Sizes for Post-Install ──────────────────────
export const JUMPER_SIZES = ["6 inch", "12 inch", "18 inch", "24 inch", "36 inch", "48 inch"];
export const CONNECTOR_SIZES = ["2-pin", "3-pin", "4-pin", "6-pin"];

// ── Post Installation Checklist Items ────────────────────────────────

// Core items that are always shown (auto-calculated from prep)
export const CORE_ITEMS = [
  { key: "lights", label: "Lights", icon: "ph:lightbulb", calcKey: "numberOfLights" },
  { key: "tracks", label: "Tracks", icon: "ph:arrow-line-down", calcKey: "numberOfTracks" },
  { key: "screws", label: "Screws", icon: "ph:wrench", calcKey: "numberOfScrews" },
];

// Checkbox items from prep stage — only shown if selected in prep
export const PREP_CHECKBOX_ITEMS = [
  { key: "conduit", prepKey: "conduit", label: "Conduit", icon: "ph:pipe", qtyKey: "conduitQty" },
  { key: "cableTie", prepKey: "cableTie", label: "Cable Tie", icon: "ph:link", qtyKey: "cableTieQty" },
  { key: "connectorsBag", prepKey: "connectorsBag", label: "Connectors Bag", icon: "ph:plugs-connected", qtyKey: "connectorsBagQty" },
];

// Current year + 4 prior years for the year filter dropdown
export const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

// 12 months for month filter dropdown
export const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Light theme options for charts
export const CHART_LIGHT_THEME = {
  background: "transparent",
  foreColor: "#64748b", // slate-500
};

export const CHART_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
  "#8b5cf6", "#14b8a6", "#f97316", "#ec4899", "#06b6d4",
  "#84cc16", "#a855f7", "#0ea5e9", "#eab308", "#22d3ee",
];

export const CONTROLLER_TYPES = [
  { value: "350W", label: "350W" },
  { value: "450W", label: "450W" },
  { value: "500W", label: "500W" },
  { value: "600W", label: "600W" },
];

export const CONNECTOR_TYPES = [
  { value: "T", label: "T (Boost Connector)" },
  { value: "Y", label: "Y" },
  { value: "Male", label: "Male (First Light Connector)" },
  { value: "2x2", label: "2x2" },
  { value: "2x4", label: "2x4" },
  { value: "3x3", label: "3x3" },
  { value: "3x6", label: "3x6" },
  { value: "2x6", label: "2x6" },
  { value: "4x4", label: "4x4" },
  { value: "3-in-1", label: "3-in-1" },
  { value: "5-in-1", label: "5-in-1" },
];

export const LIGHT_TYPES = [
  { value: "12V Puck LED", label: "12V Puck LED" },
  { value: "12V Boost Puck LED", label: "12V Boost Puck LED" },
  { value: "24V Puck LED", label: "24V Puck LED" },
  { value: "24V Boost Puck LED", label: "24V Boost Puck LED" },
  { value: "Flood Light", label: "Flood Light" },
];

export const CABLE_TYPES = [
  { value: "SJOOW Cable", label: "SJOOW Cable" },
  { value: "14x2 Audio Cables", label: "14x2 Audio Cables" },
  { value: "14x4 Audio Cables", label: "14x4 Audio Cables" },
];

export const JUMPER_TYPES = [
  { value: "1 Ft", label: "1 Ft" },
  { value: "5 Ft", label: "5 Ft" },
  { value: "10 Ft", label: "10 Ft" },
  { value: "20 Ft", label: "20 Ft" },
];

export const PLUG_TYPES = [
  { value: "3-Pin Plug", label: "3-Pin Plug" },
  { value: "4-Pin Plug", label: "4-Pin Plug" },
  { value: "USB Plug", label: "USB Plug" },
  { value: "DC Plug", label: "DC Plug" },
  { value: "Audio Plug", label: "Audio Plug" },
];

export const POWER_CORD_TYPES = [
  { value: "6-Foot Cord", label: "6-Foot Cord" },
  { value: "10-Foot Cord", label: "10-Foot Cord" },
  { value: "12-Foot Cord", label: "12-Foot Cord" },
  { value: "15-Foot Cord", label: "15-Foot Cord" },
  { value: "20-Foot Cord", label: "20-Foot Cord" },
];

export const OUTER_CASE_TYPES = [
  { value: "Regular", label: "Regular" },
  { value: "Large", label: "Large" },
];

export const APP_CONTROLLER_TYPES = [
  { value: "V5", label: "V5" },
  { value: "V6", label: "V6" },
  { value: "V7", label: "V7" },
  { value: "V8", label: "V8" },
];

export const POWER_SUPPLY_TYPES = [
  { value: "350 W – 12V", label: "350 W – 12V" },
  { value: "450 W – 12V", label: "450 W – 12V" },
  { value: "350 W – 24V", label: "350 W – 24V" },
  { value: "450 W – 24V", label: "450 W – 24V" },
  { value: "600 W – 12V", label: "600 W – 12V" },
  { value: "600 W – 24V", label: "600 W – 24V" },
];