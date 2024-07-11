import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEllipsisV, FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { MdOutlineBlock } from "react-icons/md";
import useDeleteQuiz from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuiz";

const List = ({ data, icon, title, type, loading, error, refetchQuizzes }) => {
  const { cid, sid } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, deleteQuiz } = useDeleteQuiz();

  useEffect(() => {
    if (deleteSuccess) {
      refetchQuizzes();
    }
  }, [deleteSuccess, refetchQuizzes]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuToggle = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = (quizId) => {
    deleteQuiz(quizId);
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <ul className="border-t p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">No Data Found</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item._id} className="relative mb-3">
              <div className="flex items-center gap-3 p-1 rounded-lg">
                <NavLink
                  to={
                    type === "Assignment"
                      ? `/class/${cid}/${sid}/assignment/${item._id}/view`
                      : `/class/${cid}/${sid}/quiz/${item._id}/view`
                  }
                  className="text-green-600 p-2 border rounded-full"
                >
                  {icon}
                </NavLink>
                <div className="flex justify-between w-full px-2 items-center">
                  <div className="flex flex-col gap-1 justify-center flex-grow">
                    <NavLink
                      to={
                        type === "Assignment"
                          ? `/class/${cid}/${sid}/assignment/${item._id}/view`
                          : `/class/${cid}/${sid}/quiz/${item._id}/view`
                      }
                    >
                      <h3 className="text-md font-semibold mb-1">
                        {item.name || "No Title"}
                      </h3>
                    </NavLink>
                    <p className="text-sm text-gray-500 capitalize">
                      {type === "Assignment" ? (
                        <>
                          Module : {item.moduleName || "N/A"} | Chapter :{" "}
                          {item.chapterName || "N/A"}
                        </>
                      ) : (
                        <>
                          Total Points : {item.totalPoints} | Type :{" "}
                          {item.quizType}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.publish ? (
                    <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-7 w-7" />
                  ) : (
                    <MdOutlineBlock className="text-gray-600 p-1 h-7 w-7" />
                  )}
                  <div className="relative">
                    <FaEllipsisV
                      className="text-green-600 p-1 border rounded-full h-7 w-7 cursor-pointer"
                      onClick={() => handleMenuToggle(item._id)}
                    />
                    {activeMenu === item._id && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-red-100 w-full text-left"
                          aria-label="Delete Quiz"
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <ImSpinner3 className="w-5 h-5 animate-spin text-red-600" />
                          ) : (
                            <>
                              <FaTrashAlt aria-hidden="true" className="text-red-600" />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                        {deleteError && (
                          <div className="text-red-600 text-sm px-4 py-2">
                            {deleteError}
                          </div>
                        )}
                        {deleteSuccess && (
                          <div className="text-green-600 text-sm px-4 py-2">
                            {deleteSuccess}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">No data found</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default List;
