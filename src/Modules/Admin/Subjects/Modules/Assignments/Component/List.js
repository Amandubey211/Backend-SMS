import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEllipsisV, FaTrashAlt } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteAssignmentThunk } from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import { deleteQuizThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";

const List = ({ data, icon, title, type, loading, error }) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch(); // Hook to dispatch actions
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [currentDeleteTitle, setCurrentDeleteTitle] = useState("");
  const menuRef = useRef(null);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuToggle = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = (id, name) => {
    setCurrentDeleteId(id);
    setCurrentDeleteTitle(name);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    // Call delete assignment thunk directly
    if (type === "Quiz") {
      dispatch(deleteQuizThunk(currentDeleteId));
    } else {
      dispatch(deleteAssignmentThunk(currentDeleteId));
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gradient">
          {title}
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {filteredData.length}
          </span>
        </h2>
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

      <ul className="border-t p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Spinner />
          </div>
        ) : error ? (
          <NoDataFound />
        ) : filteredData.length > 0 ? (
          filteredData.reverse().map((item) => (
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
                          Module: {item.moduleName || "N/A"} | Chapter:{" "}
                          {item.chapterName || "N/A"}
                        </>
                      ) : (
                        <>
                          Total Points: {item.totalPoints} | Type:{" "}
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
                      <div
                        ref={menuRef}
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg"
                      >
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-red-100 w-full text-left"
                        >
                          <FaTrashAlt className="text-red-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <NoDataFound />
          </div>
        )}
      </ul>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={currentDeleteTitle}
      />
    </div>
  );
};

export default List;
