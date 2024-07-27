import React from "react";
import { useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import useGetBooks from "../../../../Hooks/AuthHooks/Staff/Admin/LibraryBooks/useGetBooks";
import Fallback from "../../../../Components/Common/Fallback";

const Library = () => {
  const { loading, error, books } = useGetBooks();
  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate("/library");
  };

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Display only the top 5 latest books
  const latestBooks = books.slice(0, 5);

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library</h2>
        <button className="text-blue-600" onClick={handleViewAllClick}>View all</button>
      </div>
      {latestBooks.map((book) => (
        <BookItem
          key={book._id}
          image={book.image || "https://via.placeholder.com/50"}
          title={book.name}
          category={book.category}
          copies={book.copies}
        />
      ))}
    </div>
  );
};

export default Library;
