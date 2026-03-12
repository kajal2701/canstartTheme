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
            "Canstar lights edmonton and the team, according to me, is the ultimate 'A' team. Hands down the best in the business in Edmonton. Kudos!",
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
