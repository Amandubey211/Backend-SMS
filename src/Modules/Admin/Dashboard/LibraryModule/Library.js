// src/Library.js
import React from "react";
import BookItem from "./BookItem";

const Library = () => {
  const books = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      title: "Math Management",
      category: "Math",
      copies: 500,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      title: "Science Management",
      category: "Science",
      copies: 500,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/50",
      title: "Bangla Management",
      category: "Bangla",
      copies: 500,
    },
    {
      id: 4,
      image: "https://via.placeholder.com/50",
      title: "Business Management",
      category: "Business",
      copies: 500,
    },
    {
      id: 5,
      image: "https://via.placeholder.com/50",
      title: "English Management",
      category: "English",
      copies: 500,
    },
  ];

  return (
    <div className="  p-4   bg-white  ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library</h2>
        <button className="text-blue-600">View all</button>
      </div>
      {books.map((book) => (
        <BookItem
          key={book.id}
          image={book.image}
          title={book.title}
          category={book.category}
          copies={book.copies}
        />
      ))}
    </div>
  );
};

export default Library;
