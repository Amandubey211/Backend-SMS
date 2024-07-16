import React, { useState } from "react";

const BookIssue = ({ student }) => {
  const [selectedFilter, setSelectedFilter] = useState("All Book");

  if (!student) {
    return <div>Loading...</div>; // Show loading state if no student data
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const filteredData = student?.bookIssues?.filter((book) => {
    return selectedFilter === "All Book" || book.status === selectedFilter;
  });

  return (
    <>
      <div className="border p-4 h-full w-full">
        <label className="font-semibold">Book Issue</label>
        <div className="flex  py-3 gap-3   ">
          {["All Book", "Return", "Pending"].map((status) => (
            <label key={status} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={selectedFilter === status}
                onChange={() => handleFilterChange(status)}
                className="hidden"
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                  selectedFilter === status
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {selectedFilter === status && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`transition-colors duration-200 ${
                  selectedFilter === status ? "text-red-700" : "text-gray-700"
                }`}
              >
                {status}
              </span>
            </label>
          ))}
        </div>
        <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Issue Book
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Author</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Category</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Issue Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Return Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((book, index) => (
              <tr key={index} className="bg-white">
                {/* <td className="px-5 py-2 border-b border-gray-200">{book.bookTitle}</td> */}
                <td className="px-5 py-2 border-b border-gray-200">
                  {" "}
                  <div className="flex items-center">
                    <img
                      src={student.imageUrl}
                      alt="Profile"
                      className="h-8 w-8 mr-2 rounded-full "
                    />
                    <div className="flex flex-col">
                      <span>{book.bookTitle}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  {book.author}
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  {book.category}
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  {book.issueDate}
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  {book.returnDate}
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      book.status === "Return"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookIssue;
