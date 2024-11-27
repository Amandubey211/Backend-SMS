// function for get academic year
import Cookies from 'js-cookie';

export const getAY = () => {
  return Cookies.get("say");
};
export const getIsAYA = () => {
  return Cookies.get('isAcademicYearActive');
};

export const setLocalCookies = (name,id) => {
  return Cookies.set(name,id);
};
