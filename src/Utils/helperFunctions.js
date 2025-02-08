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
