import React, { useState } from "react";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
const BookIssue = ({ student }) => {
  const [selectedFilter, setSelectedFilter] = useState("All Expenses");
  if (!student) {
    // Check if teacher is null
    return <div>Loading...</div>;
  }
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
  //   const filteredData = data.filter(
  //     (item) => item.salaryMonth === selectedMonth || selectedMonth === "All"
  //   );
  return (
    <>
      <div>
        <label>BookIssue</label>
        <div className="flex items-center space-x-4">
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
            {/* {filteredData.map((item, index) => ( */}
            <tr className="bg-white">
              <td className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <img
                    src={student?.imageUrl || profileIcon}
                    alt="Profile"
                    className="h-8 w-8 mr-2 rounded-full "
                  />
                  <div className="flex flex-col">
                    <span>{student.name}</span>
                    <span className="text-[12px] text-green-600">
                      {student.name}
                    </span>
                  </div>
                </div>
              </td>{" "}
              <td className="px-5 py-2 border-b border-gray-200">
                {student.name}
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {student.name}
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {student.name}
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {student.name}
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    student.grades[0].evaluations[0].status=== "Completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {student.grades[0].evaluations[0].status}
                </span>
              </td>
              {/* <td className="px-5 py-2 border-b border-gray-200">
                {item.status === "Paid" ? (
                  <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800  py-1 px-2 rounded-md ">
                    Complete
                  </span>
                ) : (
                  <button
                    className=" inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
                    onClick={() => {
                    //   handlePayClick(item);
                    }}
                  >
                    Pay Now
                  </button>
                )}
              </td> */}
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookIssue;
