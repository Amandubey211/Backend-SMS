

import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import TabButton from "../Subclasss/component/TabButton";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";

const Library = () => {
  const [filters, setFilters] = useState({
    class: "",
    category: "",
  });
  const [books, setBooks] = useState([]);


  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");

  const fetchBooks = async () => {
    console.log("Fetching books...");
    try {
      const token = localStorage.getItem('student:token');
      const selectedClass = localStorage.getItem('classId');
      console.log("Token is:", token);

      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log("classId:", selectedClass);

      const response = await axios.get(`${baseUrl}/admin/all/book`, {
        headers: {
          'Authentication': token,
        },
        params: {
          classId: selectedClass,
        },
      });

      console.log("Response received:", response);

      const data = response.data;
      console.log("Data parsed:", data);

      if (data.success && data.books) {
        const formattedBooks = data.books.reverse().map(book => ({
          ...book,
          classLevel: book.classId,
          title: book.name,
          available: book.copies,
        }));
        console.log("Formatted books:", formattedBooks);
        setBooks(formattedBooks);
      } else {
        console.log("No books data or unsuccessful response");
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Extract unique class levels and categories
  const classLevels = useMemo(() => {
    const levels = books.map((book) => ({
      label: book.classLevel.toString(),
      value: book.classLevel.toString(),
    }));
    return Array.from(new Set(levels.map(level => level.value))).map(value => levels.find(level => level.value === value));
  }, []);

  const categories = useMemo(() => {
    const cats = books.map((book) => ({
      label: book.category,
      value: book.category,
    }));
    return Array.from(new Set(cats.map(cat => cat.value))).map(value => cats.find(cat => cat.value === value));
  }, []);

  const filteredBooks = books.filter((book) => {
    return (
      (filters.class === "" || book.classLevel.toString() === filters.class) &&
      (filters.category === "" || book.category === filters.category)
    );
  });

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div className="min-h-screen p-4 bg-gray-50">
          <div className="flex flex-col items-start mb-4 gap-5">
            <div className="flex gap-7">
              <div className="flex gap-4">
                <TabButton
                  isActive={activeTab === "Library"}
                  onClick={() => setActiveTab("Library")}
                >
                  Library
                </TabButton>
                <TabButton
                  isActive={activeTab === "BookIssue"}
                  onClick={() => setActiveTab("BookIssue")}
                >
                  Book Issue
                </TabButton>
              </div>
            </div>
          </div>
          {activeTab === "Library" && (
            <>
              <div className="grid grid-cols-3 gap-4 p-4">
                {filteredBooks.map((book) => (

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
                ))}
              </div>
            </>
          )}
          {activeTab === "BookIssue" && <BookIssue />}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};

export default Library;

