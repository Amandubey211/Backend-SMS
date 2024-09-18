import React from "react";
import { useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import useGetBooks from "../../../../Hooks/AuthHooks/Staff/Admin/LibraryBooks/useGetBooks";
import { FaBook } from "react-icons/fa"; // For "No data found" icon
import Spinner from "../../../../Components/Common/Spinner";
import { useSelector } from "react-redux";
import useGetFilteredIssueBooks from "../../../../Hooks/AuthHooks/Staff/Admin/LibraryBooks/useGetFilteredIssueBooks";

const Library = () => {
  const role = useSelector((store) => store.common.auth.role);

  const { loading: booksLoading, error: booksError, books } = useGetBooks();
  const {
    loading: issueBooksLoading,
    error: issueBooksError,
    books: issueBooks,
  } = useGetFilteredIssueBooks();

  const loading = role === "teacher" ? issueBooksLoading : booksLoading;
  const error = role === "teacher" ? issueBooksError : booksError;
  const booksData = role === "teacher" ? issueBooks : books;

  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate("/library");
  };

  if (loading) {
    <Spinner />;
    return;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Display only the top 5 latest books
  const latestBooks = booksData.slice(0, 5);
  console.log("latestbooks--", latestBooks);

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library</h2>
        <button className="text-blue-600" onClick={handleViewAllClick}>
          View all
        </button>
      </div>
      {latestBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-10">
          <FaBook className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">No library data found</p>
        </div>
      ) : (
        latestBooks.map((book) => (
          <BookItem
            key={book._id}
            image={
              role === "teacher"
                ? book.bookId?.image
                : book.image || "https://via.placeholder.com/50"
            }
            title={role === "teacher" ? book.bookId?.name : book.name}
            category={
              role === "teacher" ? book.bookId?.category : book.category
            }
            copies={role !== "teacher" ? book.copies : undefined}
            available={role !== "teacher" ? 350 : undefined}
            studentName={
              role === "teacher"
                ? book.studentId
                  ? book.studentId.fullName
                  : null
                : undefined
            }
            status={role === "teacher" ? book.status : undefined}
            issueDate={role === "teacher" ? book.issueDate : undefined}
            role={role}
          />
        ))
      )}
    </div>
  );
};

export default Library;
