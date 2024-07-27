import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common"; // Adjust the import according to your project structure

const useFetchPageById = (pageId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const fetchPageById = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/student/pages/${pageId}`, {
        headers: { Authentication: token },
      });

      if (response.status === 200) {
        const formattedPage = {
          _id: response.data._id,
          title: response.data.title,
          content: response.data.content,
          author: response.data.author.name, // Adjust based on actual response structure
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          publishDate: response.data.createdAt.split("T")[0], // Format the date as YYYY-MM-DD
          updateDate: response.data.updatedAt.split("T")[0], // Format the date as YYYY-MM-DD
        };
        setPage(formattedPage);
      } else {
        toast.error("Failed to fetch page");
        setError("Failed to fetch page");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error fetching page";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, pageId]);

  return { loading, error, fetchPageById, page };
};

export default useFetchPageById;
