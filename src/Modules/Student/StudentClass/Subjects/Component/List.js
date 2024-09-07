import React, { useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { BsPatchCheckFill } from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";

// Reusable List Component
const List = ({
  data,
  icon,
  title,
  type, // Can be "Quiz" or "Assignment"
  loading,
  error,
  getItemName, // Function to get item name (assignment title or quiz name)
  getItemDetails, // Function to get additional details like module, chapter, or points
  navLinkPath, // Function to create the navigation path
}) => {
  const { cid, sid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the data based on the search query
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      getItemName(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery, getItemName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gradient">
          {title}
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {filteredData.length}
          </span>
        </h2>
        <div className="relative">
          <div className="relative flex items-center max-w-xs w-full mr-4">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
            />
            <button className="absolute right-3">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {error || filteredData.length === 0 ? (
        <div className="h-full w-full flex justify-center items-center py-10">
          <NoDataFound title={type === "Assignment" ? "Assignment" : "Quiz"} />
        </div>
      ) : (
        <ul className="border-t p-4">
          {filteredData.map((item) => (
            <NavLink
              to={navLinkPath(cid, sid, item)}
              key={item._id || item.assignmentId}
              className="flex items-center mb-3 gap-3 p-1 rounded-lg"
            >
              <div className="text-green-600 p-2 border rounded-full">
                {icon}
              </div>
              <div className="flex justify-between w-full px-2 items-start">
                <div className="flex flex-col gap-1 justify-center flex-grow">
                  <div>
                    <h3 className="text-md font-semibold mb-1">
                      {getItemName(item)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getItemDetails(item)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                </div>
              </div>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
};

export default List;
