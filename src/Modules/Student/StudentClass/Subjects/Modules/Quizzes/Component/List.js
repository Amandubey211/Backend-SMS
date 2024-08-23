import React, { useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { BsPatchCheckFill } from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";
import NoDataFound from "../../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../../Components/Common/Spinner";

const List = ({ data, icon, title, type, loading, error }) => {
  const { cid, sid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getItemName = (item) => {
    return type === "Assignment" ? item.title : item.name;
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      getItemName(item)
        ? getItemName(item).toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
  }, [data, searchQuery, type]);

  if (loading) {
    return <Spinner />;
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  //       <FaExclamationTriangle className="w-12 h-12 mb-3" />
  //       <p className="text-lg font-semibold">{error}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white p-5 w-full">
      {filteredData.length > 0 && (
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
      )}
      {filteredData.length > 0 ? (
        <ul className="border-t p-4">
          {filteredData.map((item) => (
            <NavLink
              to={`/student_class/${cid}/${sid}/quizzes/${item._id}/view`}
              key={item._id}
              state={{ quiz: item }} // Passing the selected quiz as state
              className="flex items-center mb-3 gap-3 p-1 rounded-lg"
            >
              <div className="text-green-600 p-2 border rounded-full ">
                {icon}
              </div>
              <div className="flex justify-between w-full px-2 items-start">
                <div className="flex flex-col gap-1 justify-center flex-grow">
                  <div>
                    <h3 className="text-md font-semibold mb-1">
                      {getItemName(item)}
                    </h3>
                    {type === "Assignment" ? (
                      <p className="text-sm text-gray-500">
                        Module: {item.module} | Chapter: {item.chapter}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Total Points: {item.totalPoints} | Type: {item.quizType}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                </div>
              </div>
            </NavLink>
          ))}
        </ul>
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default List;
