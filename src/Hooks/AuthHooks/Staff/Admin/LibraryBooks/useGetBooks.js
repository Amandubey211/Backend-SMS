import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common"; // Adjust the path as needed

const useGetBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const role = useSelector((store) => store.Auth.role);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(`${baseUrl}/admin/all/book`, {
        headers: { Authentication: token },
      });
      setBooks(response.data.books);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Failed to fetch books";
      setError(errorMessage);
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { loading, error, books, fetchBooks };
};

export default useGetBooks;
