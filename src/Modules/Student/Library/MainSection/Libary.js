import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import TabButton from "../../../Admin/Libary/Subclasss/component/TabButton";
import Spinner from "../../../../Components/Common/Spinner";

const Library = () => {
  const [filters, setFilters] = useState({
    class: "",
    category: "",
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [activeTab, setActiveTab] = useState("Library");

  const fetchBooks = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const token = localStorage.getItem("student:token");
      const selectedClass = localStorage.getItem("classId");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${baseUrl}/admin/all/book`, {
        headers: { Authentication: token },
        params: { classId: selectedClass },
      });

      const data = response.data;
      if (data.success && data.books) {
        const formattedBooks = data.books.reverse().map((book) => ({
          ...book,
          classLevel: book.classId,
          title: book.name,
          available: book.copies,
        }));
        setBooks(formattedBooks);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Memoized class levels and categories
  const classLevels = useMemo(() => {
    return Array.from(
      new Set(books.map((book) => book.classLevel.toString()))
    ).map((value) => ({
      label: value,
      value: value,
    }));
  }, [books]);

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.category))).map(
      (value) => ({
        label: value,
        value: value,
      })
    );
  }, [books]);

  const filteredBooks = books.filter(
    (book) =>
      (filters.class === "" || book.classLevel.toString() === filters.class) &&
      (filters.category === "" || book.category === filters.category)
  );

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div className="min-h-screen">
          <div className="flex items-center gap-5 p-5">
            <TabButton
              isActive={activeTab === "Library"}
              onClick={() => setActiveTab("Library")}
              aria-label="Library tab"
            >
              Library
            </TabButton>
            <TabButton
              isActive={activeTab === "BookIssue"}
              onClick={() => setActiveTab("BookIssue")}
              aria-label="Book Issue tab"
            >
              Book Issue
            </TabButton>
          </div>

          {/* Show spinner while loading */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Spinner />
            </div>
          ) : activeTab === "Library" ? (
            <div className="grid grid-cols-4 gap-3 px-5">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    classLevel={book.classLevel.className}
                    copies={book.copies}
                    available={book.available}
                    coverImageUrl={book.image}
                  />
                ))
              ) : (
                <p className="text-gray-600">No books available.</p>
              )}
            </div>
          ) : (
            <BookIssue />
          )}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};

export default Library;
