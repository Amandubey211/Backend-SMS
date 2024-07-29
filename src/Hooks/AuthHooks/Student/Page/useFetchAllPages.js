import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common"; // Adjust the import according to your project structure

const useFetchAllPages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pages, setPages] = useState([]);

  const { role } = useSelector((store) => store.Auth);

  const fetchAllPages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/student/pages`, {
        headers: { Authentication: token },
      });
      console.log(response.data);
      if (response.status === 200) {
        const formattedPages = response.data.map((page) => ({
          _id: page._id,
          title: page.title,
          content: page.content,
          author: page.author.name, // Adjust based on actual response structure
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
          publishDate: page.createdAt.split("T")[0], // Format the date as YYYY-MM-DD
          updateDate: page.updatedAt.split("T")[0], // Format the date as YYYY-MM-DD
          url: `${baseUrl}/student/api/pages/${page._id}`,
        }));
        setPages(formattedPages);
      } else {
        toast.error("Failed to fetch pages");
        setError("Failed to fetch pages");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching pages";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role]);

  return { loading, error, fetchAllPages, pages };
};

export default useFetchAllPages;
