import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import useFetchSection from "./useFetchSection";
import { baseUrl } from "../../../../../config/Common";



const useCreateSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const {fetchSection} = useFetchSection()
  const createSection = async (sectionData) => {
    setLoading(true);
    setError(null); // Reset error state before new request
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.post(
        `${baseUrl}/admin/section`,
        sectionData,
        {
          headers: { Authentication: token },
        }
      );
      if(data.success){
        toast.success("Section Created ")
      }
      fetchSection(sectionData.classId)
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createSection, loading, error };
};

export default useCreateSection;
