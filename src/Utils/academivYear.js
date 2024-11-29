// function for get academic year
import Cookies from 'js-cookie';

export const getAY = () => {
  return Cookies.get("say");
};
export const getIsAYA = () => {
  return Cookies.get('isAcademicYearActive');
};

export const setLocalCookies = (name, id) => {
  const isProduction = true;

  return Cookies.set(name, id, {
    // Set cookie options dynamically based on environment
    httpOnly: true, // Note: 'js-cookie' does not support httpOnly as it's a server-side option
    secure: isProduction, // Secure in production
    sameSite: isProduction ? 'Strict' : 'Lax', // Relaxed for localhost
    expires: 7, // 7 days, equivalent to maxAge in days
  });
}
