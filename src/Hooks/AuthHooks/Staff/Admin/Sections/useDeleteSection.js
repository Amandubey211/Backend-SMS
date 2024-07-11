import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useFetchSection from "./useFetchSection";
import { useParams } from "react-router-dom";

const useDeleteSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const { fetchSection } = useFetchSection();
  const { cid } = useParams();
  const deleteSection = async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.delete(
        `${API_URL}/admin/section/${sectionId}`,
        {
          headers: { Authentication: token },
        }
      );
      console.log(response.data);

      if (response.data.status) {
        toast.success("Section deleted successfully");
        await fetchSection(cid);
        return true;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to delete section: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSection, loading, error };
};

export default useDeleteSection;
