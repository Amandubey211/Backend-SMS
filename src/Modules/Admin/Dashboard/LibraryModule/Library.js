import React from "react";
import BookItem from "./BookItem";
import useGetBooks from "../../../../Hooks/AuthHooks/Staff/Admin/LibraryBooks/useGetBooks";
import Fallback from "../../../../Components/Common/Fallback";

const Library = () => {
  const { loading, error, books } = useGetBooks();

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library</h2>
        <button className="text-blue-600">View all</button>
      </div>
      {books.map((book) => (
        <BookItem
          key={book._id}
          image={book.image || "https://via.placeholder.com/50"}
          title={book.className || book.title}
          category={book.name || book.category}
          copies={book.copies}
        />
      ))}
    </div>
  );
};

export default Library;
