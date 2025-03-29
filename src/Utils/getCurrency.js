
import Cookies from "js-cookie";
export const getSC = ()=>{
    return Cookies.get("currency");
}