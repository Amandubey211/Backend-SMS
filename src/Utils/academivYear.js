// function for get academic year
import Cookies from 'js-cookie';

export const getAY = () => {
  return Cookies.get("say");
};
