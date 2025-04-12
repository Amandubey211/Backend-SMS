import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteAssignmentThunk } from "../../../../../../Store/Slices/Admin/Class/Assignment/assignmentThunks";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import { deleteQuizThunk } from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { Button, Popover, Empty, Skeleton } from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaEllipsisV } from "react-icons/fa";

const List = ({
  data,
  icon,
  title,
  type,
  loading,
  error,
  requiredPermission,
}) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [currentDeleteTitle, setCurrentDeleteTitle] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = (id, name) => {
    setCurrentDeleteId(id);
    setCurrentDeleteTitle(name);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (type === "Quiz") {
      dispatch(deleteQuizThunk(currentDeleteId));
    } else {
      dispatch(deleteAssignmentThunk(currentDeleteId));
    }
    setIsModalOpen(false);
  };

  const filteredData = data?.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gradient">
          {title}
          <span className="border rounded-full text-sm p-1 px-2 ml-1 text-gray-500">
            {filteredData?.length}
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
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-3">
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Empty
              description={
                type === "Assignment" ? "No Assignments" : "No Quizzes"
              }
            />
          </div>
        ) : filteredData?.length > 0 ? (
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
                    <p className="text-sm text-gray-500 capitalize truncate">
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
                    <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-8 w-8" />
                  ) : (
                    <MdOutlineBlock className="text-gray-600 p-1 h-8 w-8" />
                  )}
                  <Popover
                    content={
                      <ProtectedAction requiredPermission={requiredPermission}>
                        <Button
                          danger
                          block
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item._id, item.name)}
                        >
                          Delete
                        </Button>
                      </ProtectedAction>
                    }
                    trigger="click"
                    placement="bottomRight"
                    overlayStyle={{ padding: "3px", minHeight: "0" }}
                  >
                    <Button
                      shape="circle"
                      type="default"
                      icon={<FaEllipsisV />}
                    />
                  </Popover>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <Empty
              description={
                type === "Assignment" ? "No Assignments" : "No Quizzes"
              }
            />
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
