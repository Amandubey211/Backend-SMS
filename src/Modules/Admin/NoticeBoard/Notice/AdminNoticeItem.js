import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { BsPencilSquare, BsTrash } from "react-icons/bs"; // New icons
import { useDispatch, useSelector } from "react-redux";
import { setTitleToDelete } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeSlice"; // Redux action to set title for delete

const AdminNoticeItem = ({
  notice,
  index,
  activeIndex,
  toggleAccordion,
  handleEditNotice,
  setDeleteModalOpen,
  setNoticeToDelete,
}) => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);

  const handleDelete = () => {
    setDeleteModalOpen(true);
    setNoticeToDelete(notice._id);
    dispatch(setTitleToDelete(notice.title)); // Set title in Redux
  };

  return (
    <div className="border-t">
      <div
        className="cursor-pointer p-2 flex flex-col bg-white"
        onClick={() => toggleAccordion(index)} // Toggle accordion on click
      >
        <div className="flex gap-6 px-3 py-2 items-center">
          {/* Icon */}
          <div className="border bg-blue-300 rounded-md flex items-center justify-center h-16 w-16">
            <img
              className="h-12 w-12"
              src={
                notice.imageUrl ||
                "https://cdn-icons-png.freepik.com/512/1060/1060360.png"
              }
              alt="Announcement Icon"
            />
          </div>

          {/* Title and Date */}
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="font-semibold text-lg">{notice.title}</h2>
            <div className="flex items-center text-xs">
              <IoCalendarOutline className="text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">
                {new Date(notice.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <div
                className={`ml-3 px-3 py-1 bg-gray-100 rounded-full ${notice.priority === "High priority"
                  ? "text-pink-500 bg-pink-100"
                  : "text-gray-500"
                  }`}
              >
                {notice.priority}
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {role === "admin" && (
              <div>
                <BsPencilSquare
                  className="text-blue-500 cursor-pointer"
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion toggle on edit
                    handleEditNotice(notice);
                  }}
                />
                <BsTrash
                  className="text-red-500 cursor-pointer"
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion toggle on delete
                    handleDelete(); // Use local handleDelete
                  }}
                />
              </div>
            )}
            {activeIndex === index ? (
              <MdExpandLess className="text-xl" />
            ) : (
              <MdExpandMore className="text-xl" />
            )}
          </div>
        </div>

        {/* Description */}
        {activeIndex === index && (
          <div className="p-4 text-sm text-gray-700">
            <p>{notice.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNoticeItem;
