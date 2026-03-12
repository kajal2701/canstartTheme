// src/utils/exportUtils.js

import * as XLSX from "xlsx";

export const exportQuotesToExcel = (data) => {
  const exportData = data.map((item) => ({
    "Quote #": item.srNumber,
    "Salesman": item.salesman,
    "Customer Name": item.customerName,
    "Phone": item.phone,
    "Address": item.address,
    "City": item.city,
    "State": item.state,
    "Country": item.country,
    "Post Code": item.post_code,
    "Linear Feet": item.linearFeet,
    "Colors": item.colors,
    "Total": item.total,
    "Status": item.status,
    "Installation Date": item.installationSchedule,
    "Date": item.date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 15 }, // Quote #
    { wch: 20 }, // Salesman
    { wch: 25 }, // Customer Name
    { wch: 15 }, // Phone
    { wch: 30 }, // Address
    { wch: 15 }, // City
    { wch: 15 }, // State
    { wch: 15 }, // Country
    { wch: 12 }, // Post Code
    { wch: 12 }, // Linear Feet
    { wch: 15 }, // Colors
    { wch: 12 }, // Total
    { wch: 30 }, // Status
    { wch: 20 }, // Installation Date
    { wch: 15 }, // Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quotes");

  // Generate filename with current date
  const today = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `Quotes_${today}.xlsx`);
};