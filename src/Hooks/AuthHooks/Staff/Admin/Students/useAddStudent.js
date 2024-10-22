import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useAddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = useSelector((store) => store.common.auth.role);

  const addStudent = useCallback(
    async (studentData) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const formData = new FormData();
        Object.keys(studentData).forEach((key) => {
          formData.append(key, studentData[key]);
        });
        console.log(studentData);
        // const response = await axios.post(
        //   `${baseUrl}/register-student`,
        //   formData,
        //   {
        //     headers: {
        //       Authentication: token,
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );

        // toast.success(response.data.msg);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Failed to register student";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, addStudent };
};

export default useAddStudent;
