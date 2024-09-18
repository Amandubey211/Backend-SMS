import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useGetBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  const role = useSelector((store) => store.common.auth.role);
  

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/all/book`, {
        headers: { Authentication: token },
      });

      console.log('Fetched Books:', response.data.books); // Log the fetched books data
      setBooks(response.data.books);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch books";
      toast.error(errorMessage);
      setLoading(false);
      setError(errorMessage);
    }
  }, [role, baseUrl]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { loading, error, books };
};

export default useGetBooks;
