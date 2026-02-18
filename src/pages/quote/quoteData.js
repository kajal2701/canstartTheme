// Shared dummy data — used by both Quote list and ViewQuoteAdmin
// Replace with real API calls when backend is ready

export const QUOTES_DUMMY_DATA = {
  460: {
    id: 460,
    quoteNumber: "QTE2600460",
    quoteDate: "2026-01-22 01:04:32",
    status: "approved",
    from: {
      company: "CanStar",
      address: "3227 18 St NW,",
      city: "Edmonton,",
      province: "AB T6T 0H2",
    },
    to: {
      company: "Al Rashid Mosque,",
      address: "13070 113 St NW,",
      city: "Edmonton,",
      province: "Alberta - T5E 5A8",
      email: "wael.amer@alrashidmosque.ca",
      phone: "6474564226",
    },
    items: [
      {
        id: 1,
        description:
          "Canstar Puck Lights with a customized data line system, paired with a **Brown** aluminum track package, designed for the **Front And Side** of the house/property.",
        images: [1, 2, 3],
        quantity: 246,
        unitCost: 24,
        total: 5904.0,
        type: "linear",
      },
      {
        id: 2,
        description:
          "Canstar Four-Zone Smart Controller System with 12V Outdoor-Rated Power Box Unit",
        images: [],
        quantity: 1,
        unitCost: 280,
        total: 280.0,
        type: "controller",
      },
      {
        id: 3,
        description: "Wifi Extender",
        images: [],
        quantity: 1,
        unitCost: 140,
        total: 140.0,
        type: "controller",
      },
    ],
    customerNotes: "",
    adminNotes: "",
    totals: {
      linearFeet: 5904.0,
      controller: 420.0,
      discountPercent: 10,
      discount: 632.4,
      gstPercent: 5,
      gst: 284.58,
      mainTotal: 5976.18,
    },
    payment: {
      option: "Deposit Payment",
      amount: 1494.05,
      methods: "etransfer,cash",
    },
  },
  462: {
    id: 462,
    quoteNumber: "QTE2600462",
    quoteDate: "2026-02-11 10:30:00",
    status: "sent",
    from: {
      company: "CanStar",
      address: "3227 18 St NW,",
      city: "Edmonton,",
      province: "AB T6T 0H2",
    },
    to: {
      company: "Bart McAstocker,",
      address: "1823 56 St SW,",
      city: "Edmonton,",
      province: "Alberta",
      email: "bart@example.com",
      phone: "7809959867",
    },
    items: [
      {
        id: 1,
        description:
          "Canstar Puck Lights with a **Black** aluminum track package for **Front** of property.",
        images: [1, 2],
        quantity: 370,
        unitCost: 24,
        total: 8880.0,
        type: "linear",
      },
    ],
    customerNotes: "",
    adminNotes: "",
    totals: {
      linearFeet: 8880.0,
      controller: 280.0,
      discountPercent: 0,
      discount: 0,
      gstPercent: 5,
      gst: 458.0,
      mainTotal: 8722.56,
    },
    payment: { option: "Full Payment", amount: 8722.56, methods: "etransfer" },
  },
};
