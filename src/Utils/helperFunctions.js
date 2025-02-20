// src/Utils/helperFunctions.js

/**
 * Formats a given ISO date into different formats based on type.
 *
 * @param {string} isoDate - The ISO date string (e.g., "2025-01-10T09:02:22.517Z").
 * @param {string} type - The format type: "long", "short", "numeric", etc.
 * @returns {string} - Formatted date string.
 */
export const formatDate = (isoDate, type = "long") => {
  if (!isoDate) return "N/A"; // Handle missing date

  const dateObj = new Date(isoDate);
  const day = dateObj.getDate();
  const monthNumeric = String(dateObj.getMonth() + 1).padStart(2, "0"); // Numeric month (01-12)
  const monthShort = dateObj.toLocaleString("en-US", { month: "short" }); // "Jan"
  const monthLong = dateObj.toLocaleString("en-US", { month: "long" }); // "January"
  const year = dateObj.getFullYear();

  switch (type) {
    case "numeric": // 10/01/2025
      return `${day}/${monthNumeric}/${year}`;
    case "short": // 10 Jan 2025
      return `${day} ${monthShort} ${year}`;
    case "long": // 10 January 2025
    default:
      return `${day} ${monthLong} ${year}`;
  }
};


export const calculateFinalAmount = ({
  lineItems = [],
  tax = 0,
  discount = 0,
  discountType = "fixed",
  penalty = 0,
  penaltyType = "fixed",
  adjustmentPenalty = 0,
  totalPaidAmount = 0,
  final_amount,
}) => {
  // Ensure all numeric values are correctly parsed
  tax = parseFloat(tax) || 0;
  discount = parseFloat(discount) || 0;
  penalty = parseFloat(penalty) || 0;
  adjustmentPenalty = parseFloat(adjustmentPenalty) || 0;
  totalPaidAmount = parseFloat(totalPaidAmount) || 0;

  // Calculate subtotal from line items
  const subtotal = lineItems.reduce((acc, item) => acc + (parseFloat(item.amount || item.total || 0)), 0);

  // Calculate tax amount
  const taxAmount = (subtotal * tax) / 100;

  // Calculate penalty amount based on type
  const penaltyAmount = penaltyType === "percentage"
    ? (subtotal * penalty) / 100
    : penalty;

  // Calculate discount amount based on type
  const discountAmount = discountType === "percentage"
    ? (subtotal * discount) / 100
    : discount;

  // Final amount calculation
  let calculatedFinalAmount = subtotal + taxAmount + penaltyAmount - discountAmount;

  // If final_amount is passed (Quotation template), use it directly
  if (final_amount) {
    calculatedFinalAmount = parseFloat(final_amount);
  }

  // Round to 2 decimal places
  return calculatedFinalAmount.toFixed(2);
};


export const truncateText = (text, maxLength) => {
  return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};