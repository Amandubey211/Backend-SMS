import React, { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import { FaBook } from "react-icons/fa"; // For "No data found" icon
import Spinner from "../../../../Components/Common/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilteredIssueBooks } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";

const Library = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state?.common?.auth?.role);

  // Extracting books, loading, and error from Redux state
  const { books, loading, error } = useSelector((state) => state?.admin?.adminDashboard);

  // Fetch Books based on role
  useEffect(() => {
    dispatch(fetchFilteredIssueBooks());
  }, [dispatch, role]);

  const handleViewAllClick = () => {
    navigate("/library");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]"> {/* Centered Spinner */}
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <FaBook className="text-red-400 text-6xl mb-4" />
        <p className="text-gray-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  // Ensure only the top 5 latest books are displayed
  const latestBooks = books?.slice(0, 5) || []; // Slicing to get only the top 5 books

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Library</h2>
        

        <button
          className="text-black border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300 ease-in-out"
          onClick={handleViewAllClick}
        >
          View All
        </button>


      </div>
      {latestBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <FaBook className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">No library data found</p>
        </div>
      ) : (
        latestBooks.map((book) => (
          <BookItem
            key={book?._id}
            image={book?.image || "https://via.placeholder.com/50"} // Updated to match API structure
            title={book?.name || "Untitled Book"} // Updated to match API structure
            category={book?.category || "Uncategorized"} // Updated to match API structure
            copies={book?.copies || 0} // Updated to match API structure
            available={book?.available || 0} // Assuming availability data is missing in this response
            role={role}
          />
        ))
      )}
    </div>
  );
};

export default memo(Library);
