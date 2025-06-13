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
import {
  EllipsisOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { FaEllipsisV } from "react-icons/fa";
import { setCellModal } from "../../../../../../Store/Slices/Admin/scoreCard/scoreCard.slice";

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
  //  console.log("filteredData", filteredData);
  return (
    <div className="bg-white p-4 rounded-lg  w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center pb-4 gap-4 border-b">
        <h2 className="text-xl font-bold text-gradient">
          {title} ({filteredData?.length || 0})
        </h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CiSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <li key={i} className="py-4">
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </li>
            ))}
          </>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Empty
              description={
                type === "Assignment" ? "No Assignments" : "No Quizzes"
              }
            />
          </div>
        ) : filteredData?.length > 0 ? (
          filteredData.reverse().map((item) => (
            <li
              key={item._id}
              className="p-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition-all duration-200 rounded-lg"
            >
              <div className="flex items-center gap-4 w-full">
                <NavLink
                  to={
                    type === "Assignment"
                      ? `/class/${cid}/${sid}/assignment/${item._id}/view`
                      : `/class/${cid}/${sid}/quiz/${item._id}/view`
                  }
                  className="text-green-500 p-2 border border-green-100 rounded-full hover:bg-green-50 transition-all duration-200 flex-shrink-0"
                >
                  {icon || <BsPatchCheckFill className="w-5 h-5" />}
                </NavLink>
                <div className="flex flex-col flex-grow min-w-0">
                  <NavLink
                    to={
                      type === "Assignment"
                        ? `/class/${cid}/${sid}/assignment/${item._id}/view`
                        : `/class/${cid}/${sid}/quiz/${item._id}/view`
                    }
                  >
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-all duration-200 truncate">
                      {item.name || "No Title"}
                    </h3>
                  </NavLink>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {type === "Assignment" ? (
                      <>
                        Module: {item.moduleName || "N/A"}
                      </>
                    ) : (
                      <>
                        Total Points: {item.totalPoints} | Type: {item.quizType}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end flex-shrink-0">
                {item.publish ? (
                  <BsPatchCheckFill className="text-green-500 p-1 border border-green-100 rounded-full h-8 w-8 flex-shrink-0" />
                ) : (
                  <MdOutlineBlock className="text-gray-500 p-1 h-8 w-8 flex-shrink-0" />
                )}
                <Popover
                  content={
                    <div className="flex flex-col gap-2">
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
                      <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          dispatch(
                            setCellModal({
                              modelName:
                                type === "Assignment" ? "assignment" : "quizz",
                              dataId: item._id,
                              classId: cid,
                            })
                          )
                        }
                        className="border-green-500 text-green-500 hover:border-green-600 hover:text-green-600 bg-transparent rounded-md transition-all duration-200 flex items-center justify-center text-sm font-medium px-3 py-1"
                      >
                        Report Card
                      </Button>
                    </div>
                  }
                  trigger="click"
                  placement="bottomRight"
                  overlayStyle={{ padding: "3px", minHeight: "0" }}
                >
                  <Button
                    shape="circle"
                    type="default"
                    icon={<FaEllipsisV />}
                    className="text-gray-500 hover:text-gray-700 transition-all duration-200 flex-shrink-0"
                  />
                </Popover>
              </div>
            </li>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
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
