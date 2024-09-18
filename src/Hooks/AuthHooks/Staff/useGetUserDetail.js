import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuth,
  setRole,
  setUserDetails,
} from "../../../Redux/Slices/Auth/AuthSlice.js";
import axios from "axios";
import { baseUrl } from "../../../config/Common.js";

const useGetUserDetail = () => {
  const [loading, setLoading] = useState(false);
  const role = useSelector((store) => store.common.auth.role);
  const dispatch = useDispatch();
  const userDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.get(`${baseUrl}/auth/user/detail`, {
        headers: { Authentication: token },
      });
      if (data.token) {
        console.log(data);
        localStorage.setItem(`${data.user.role}:token`, `Bearer ${data.token}`);
        dispatch(setAuth(true));
        dispatch(setRole(data.user.role));

        dispatch(setUserDetails(data.user));
      } else {
        toast.error("Something is wrong");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error("Error during get user datat:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    userDetail,
  };
};

export default useGetUserDetail;
