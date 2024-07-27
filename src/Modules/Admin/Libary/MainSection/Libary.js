import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../SubClass/component/FormField";
import Sidebar from "../../../../Components/Common/Sidebar";
import BookIssue from "./BookIssue";
import AddBook from "../SubClass/component/AddBook";
import TabButton from "../Subclasss/component/TabButton";
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";

const Library = () => {
  const [filters, setFilters] = useState({ class: "", category: "" });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Library");
  const [books, setBooks] = useState([]);
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin/all/book`, {
          headers: {
            Authentication: `${token}`,
          },
        });
        if (response.data.success) {
          setBooks(response.data.books);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const classLevels = useMemo(() => {
    const levels = books.map((book) => book.classId.className);
    return Array.from(new Set(levels));
  }, [books]);

  const categories = useMemo(() => {
    const cats = books.map((book) => book.category);
    return Array.from(new Set(cats));
  }, [books]);

  const filteredBooks = books.filter((book) => {
    return (
      (filters.class === "" || book.classId.className === filters.class) &&
      (filters.category === "" || book.category === filters.category)
    );
  });

  return (
    <Layout title="Library | Student Diwan">
      <DashLayout>
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
                  />
                  <FormField
                    id="category"
                    name="category"
                    label="Category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    options={categories}
                  />
                </div>
                <button
                  onClick={handleSidebarOpen}
                  className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  Add Books
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    title={book.name}
                    author={book.author}
                    category={book.category}
                    classLevel={book.classId.className}
                    copies={book.copies}
                    available={book.copies}
                    coverImageUrl={book.image}
                  />
                ))}
              </div>
            </>
          )}
          {activeTab === "BookIssue" && <BookIssue />}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Book"
          >
            <AddBook />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Library;
