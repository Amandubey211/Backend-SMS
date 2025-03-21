// function for get academic year
import Cookies from "js-cookie";

export const getAY = () => {
  return Cookies.get("say");
};
export const getIsAYA = () => {
  return Cookies.get("isAcademicYearActive") === "true";
};

export const setLocalCookies = (name, id) => {
  const isProduction = true;

  return Cookies.set(name, id, {
    // Set cookie options dynamically based on environment
    httpOnly: false, // Note: 'js-cookie' does not support httpOnly as it's a server-side option
    secure: isProduction, // Secure in production
    sameSite: isProduction ? "Strict" : "Lax", // Relaxed for localhost
    expires: 7, // 7 days, equivalent to maxAge in days
  });
};



// src/Utils/academicYearUtils.js

export function getDistinctYears(academicYearArr = []) {
  const yearSet = new Set();

  academicYearArr.forEach((item) => {
    // each "item" looks like { _id, year: "2024-2025", ... }
    if (item.year) {
      // Split at the dash -> ["2024", "2025"]
      const splitted = item.year.split("-");
      splitted.forEach((yStr) => {
        const parsed = parseInt(yStr, 10);
        if (!isNaN(parsed)) {
          yearSet.add(parsed);
        }
      });
    }
  });

  // Convert the Set to an array and sort ascending
  return Array.from(yearSet).sort((a, b) => a - b);
}
