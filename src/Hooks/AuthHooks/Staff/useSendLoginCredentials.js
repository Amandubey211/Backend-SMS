import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../../../config/Common";



const useSendLoginCredentials = () => {
  const [loading, setLoading] = useState(false);

  const sendCredentials = async (mailConfiguration) => {
    setLoading(true);

    try {
      const token = localStorage.getItem(
        process.env.REACT_APP_ADMIN_TOKEN_STORAGE_KEY
      );
      const { data } = await axios.post(
        `${baseUrl}/admin/send_login_credential`,
        mailConfiguration,
        { headers: { Authentication: token } }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.msg || "Credentials send successfully");
      } else {
        toast.error(data.msg || "Document verification failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendCredentials,
  };
};

export default useSendLoginCredentials;
