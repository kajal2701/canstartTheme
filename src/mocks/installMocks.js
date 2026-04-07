// ── Dummy Installers ──────────────────────────────────────────────
export const DUMMY_INSTALLERS = [
  { id: 101, name: "Mike Johnson",  email: "mike@example.com",   phone: "555-1001", avatar: "" },
  { id: 102, name: "Sarah Lee",     email: "sarah@example.com",  phone: "555-1002", avatar: "" },
  { id: 103, name: "Carlos Ruiz",   email: "carlos@example.com", phone: "555-1003", avatar: "" },
  { id: 104, name: "Emily Chen",    email: "emily@example.com",  phone: "555-1004", avatar: "" },
];

// ── Helper: today-relative date strings ──────────────────────────
const dayOffset = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};

// ── Dummy Calendar Jobs ──────────────────────────────────────────
export const DUMMY_CALENDAR_JOBS = [
  {
    quote_id: 1001, quote_no: "QT-1001",
    fname: "John",  lname: "Smith",
    email: "john.smith@example.com", phone: "555-2001",
    address: "123 Main St", city: "Calgary", state: "AB", country: "CA",
    installation_date: dayOffset(0), // today
    installer_id: 101, installer_name: "Mike Johnson",
    status: "in_progress", linear_feet: 48, main_total: "3200.00",
    total_numerical_box: 48,
    controller_confirm_with_customer: true,
  },
  {
    quote_id: 1002, quote_no: "QT-1002",
    fname: "Alice", lname: "Brown",
    email: "alice.b@example.com", phone: "555-2002",
    address: "456 Elm Dr", city: "Edmonton", state: "AB", country: "CA",
    installation_date: dayOffset(1),
    installer_id: 102, installer_name: "Sarah Lee",
    status: "upcoming", linear_feet: 32, main_total: "2100.00",
    total_numerical_box: 32,
    controller_confirm_with_customer: false,
  },
  {
    quote_id: 1003, quote_no: "QT-1003",
    fname: "Bob",   lname: "Williams",
    email: "bob.w@example.com", phone: "555-2003",
    address: "789 Oak Ave", city: "Red Deer", state: "AB", country: "CA",
    installation_date: dayOffset(3),
    installer_id: null, installer_name: null,
    status: "upcoming", linear_feet: 60, main_total: "4500.00",
    total_numerical_box: 60,
    controller_confirm_with_customer: true,
  },
  {
    quote_id: 1004, quote_no: "QT-1004",
    fname: "Diana", lname: "Ross",
    email: "diana.r@example.com", phone: "555-2004",
    address: "321 Pine Rd", city: "Lethbridge", state: "AB", country: "CA",
    installation_date: dayOffset(-2),
    installer_id: 103, installer_name: "Carlos Ruiz",
    status: "completed", linear_feet: 24, main_total: "1800.00",
    total_numerical_box: 24,
    controller_confirm_with_customer: false,
  },
  {
    quote_id: 1005, quote_no: "QT-1005",
    fname: "Edward", lname: "Green",
    email: "ed.green@example.com", phone: "555-2005",
    address: "654 Spruce St", city: "Medicine Hat", state: "AB", country: "CA",
    installation_date: dayOffset(5),
    installer_id: 104, installer_name: "Emily Chen",
    status: "upcoming", linear_feet: 40, main_total: "2900.00",
    total_numerical_box: 40,
    controller_confirm_with_customer: true,
  },
  {
    quote_id: 1006, quote_no: "QT-1006",
    fname: "Fiona",  lname: "Clark",
    email: "fiona.c@example.com", phone: "555-2006",
    address: "987 Birch Ln", city: "Calgary", state: "AB", country: "CA",
    installation_date: dayOffset(-5),
    installer_id: 101, installer_name: "Mike Johnson",
    status: "completed", linear_feet: 56, main_total: "4100.00",
    total_numerical_box: 56,
    controller_confirm_with_customer: false,
  },
  {
    quote_id: 1007, quote_no: "QT-1007",
    fname: "George", lname: "White",
    email: "george.w@example.com", phone: "555-2007",
    address: "111 Cedar Ct", city: "Airdrie", state: "AB", country: "CA",
    installation_date: dayOffset(7),
    installer_id: null, installer_name: null,
    status: "upcoming", linear_feet: 36, main_total: "2600.00",
    total_numerical_box: 36,
    controller_confirm_with_customer: true,
  },
  {
    quote_id: 1008, quote_no: "QT-1008",
    fname: "Hannah", lname: "Taylor",
    email: "hannah.t@example.com", phone: "555-2008",
    address: "222 Maple Dr", city: "Cochrane", state: "AB", country: "CA",
    installation_date: dayOffset(2),
    installer_id: 102, installer_name: "Sarah Lee",
    status: "upcoming", linear_feet: 44, main_total: "3100.00",
    total_numerical_box: 44,
    controller_confirm_with_customer: false,
  },
];

// ── Track Types for Prep Checklist ───────────────────────────────
export const TRACK_TYPES = ["2ft Track", "4ft Track", "8ft Track", "Custom Track"];

// ── Jumper/Connector Sizes for Post-Install ──────────────────────
export const JUMPER_SIZES = ["6 inch", "12 inch", "18 inch", "24 inch", "36 inch", "48 inch"];
export const CONNECTOR_SIZES = ["2-pin", "3-pin", "4-pin", "6-pin"];

// ── Process Steps ────────────────────────────────────────────────
export const PROCESS_STEPS = [
  { id: 1, label: "Prep Stage",           icon: "ph:clipboard-text" },
  { id: 2, label: "On the Way",           icon: "ph:car" },
  { id: 3, label: "Controller Box",       icon: "ph:map-pin-area" },
  { id: 4, label: "Post Installation",    icon: "ph:check-square" },
  { id: 5, label: "Supplies & Drop-off",  icon: "ph:package" },
  { id: 6, label: "Time Entry",           icon: "ph:clock" },
  { id: 7, label: "Completion",           icon: "ph:flag-checkered" },
];

// ── Default Process State per Job ────────────────────────────────
export const getDefaultProcessState = (job) => {
  const linearFeet = job?.linear_feet || job?.total_numerical_box || 0;
  const numberOfLights = Math.ceil(linearFeet * 1.5);

  return {
    // Step 1 — Prep
    prep: {
      numberOfLights,
      linearFeet,
      trackType: "",
      controllerBox: false,
      boostBox: false,
      screws: false,
      conduit: false,
      cableTie: false,
      connectorsBag: false,
      other: "",
    },
    // Step 2 — On the Way
    onTheWay: {
      sent: false,
      etaMinutes: 15,
      sentAt: null,
    },
    // Step 3 — Controller Box
    controllerBox: {
      photo: null,
      confirmWithCustomer: job?.controller_confirm_with_customer || false,
      emailSent: false,
      preAssessmentImages: [],
      preAssessmentNotes: "",
    },
    // Step 4 — Post Installation
    postInstall: {
      checklist: {
        lights:     { used: "", waste: "", notes: "" },
        tracks:     { used: "", waste: "", notes: "" },
        boostWire:  { used: "", waste: "", notes: "" },
        sjoowWire:  { used: "", waste: "", notes: "" },
        jumpers:    { used: "", waste: "", size: "", notes: "" },
        connectors: { used: "", waste: "", size: "", notes: "" },
        other:      { used: "", waste: "", notes: "" },
      },
      images: [],
      notes: "",
    },
    // Step 5 — Supplies & Drop-off
    dropOff: {
      items: [],
      travelTime: { hours: 0, minutes: 0 },
      notes: "",
    },
    // Step 6 — Time Entry
    timeEntry: {
      startTime: "",
      endTime: "",
      expenses: [],
    },
    // Step 7 — Completion
    completed: false,
  };
};
