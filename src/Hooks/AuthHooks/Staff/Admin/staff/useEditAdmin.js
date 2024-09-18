import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { baseUrl } from "../../../../../config/Common";

const useEditAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminRole = useSelector((store) => store.common.auth.role);
  const EditAdmin = useCallback(
    async (AdminData) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${adminRole}:token`);
        const formData = new FormData();
        Object.keys(AdminData).forEach((key) => {
          formData.append(key, AdminData[key]);
        });
        const response = await axios.put(
          `${baseUrl}/admin/update/admin_profile`,
          formData,
          {
            headers: {
              Authentication: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("Admin Updated successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to Update Admin";
        toast.error("Failed to Edit Admin");
        console.log(err);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [adminRole]
  );

  return { EditAdmin, loading, error };
};

export default useEditAdmin;
