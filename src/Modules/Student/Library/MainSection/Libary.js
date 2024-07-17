

import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import FormField from "../../subClass/component/FormField";
import BookIssue from "./BookIssue";
import TabButton from "../Subclasss/component/TabButton";
// import { books } from "../../studentDummyData/studentDummyData";
import Sidebar from "../../../../Components/Common/Sidebar";

const Library = () => {
  const [filters, setFilters] = useState({
    class: "",
    category: "",
  });
  const [books, setBooks] = useState([]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  useEffect(() => {
    const fetchBooks = async () => {
      console.log("Fetching books...");
      try {
        const token = localStorage.getItem('student:token');
        console.log("token is ",token)
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('http://localhost:8080/admin/all/book', {
          headers: {
            'Authentication': token
          }
        });

        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`Failed to fetch books, status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data parsed:", data);

        if (data.success && data.books) {
          const formattedBooks = data.books.map(book => ({
            ...book,
            classLevel: book.name,
            category: book.name,
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

    fetchBooks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

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
              <div className="flex justify-between items-end space-x-2 w-full">
                <div className="flex gap-6">
                  <FormField
                    id="class"
                    name="class"
                    label="Class"
                    value={filters.class}
                    onChange={handleFilterChange}
                    options={classLevels}
                    placeholder="Select Class"
                  />
                  <FormField
                    id="category"
                    name="category"
                    label="Category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    options={categories}
                    placeholder="Select Category"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4">
                {filteredBooks.map((book) => (
                  // <BookCard
                  //   key={book.id}
                  //   title={book.name}
                  //   author={book.author}
                  //   category={book.name}
                  //   classLevel={book.name}
                  //   copies={book.copies}
                  //   available={book.copies}
                  //   coverImageUrl={book.image}
                  // />
                  
                  <BookCard
                    key={book._id}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    classLevel={book.classLevel}
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

