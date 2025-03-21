import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCheck, TbEdit } from "react-icons/tb";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import { useTranslation } from "react-i18next";
import { AiFillFileExcel } from "react-icons/ai";
import { Tooltip } from "antd";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import DeleteConfirmatiomModal from "../../../../../../Components/Common/DeleteConfirmationModal";

function DateSection({
  isEditing,
  examDetails,
  handleInputChange,
  handleUpdate,
  handleEditClick,
  loading,
  handleDeleteClick,
  isModalOpen,
  setIsModalOpen,
}) {
  // const dispatch = useDispatch();
  const formatDateForInput = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
  };

  const { t } = useTranslation("admClass");
  const { allStudents } = useSelector((store) => store.admin.all_students);
  const handleExport = () => {
    if (
      !examDetails ||
      !examDetails.students ||
      examDetails.students.length === 0
    ) {
      alert("No student data available for export!");
      return;
    }

    // Prepare student data for export
    const exportData = examDetails.students.map((student) => {
      const matchedStudent = allStudents.find(
        (s) => s._id === student.studentId._id
      );

      return {
        Name: `${student.studentId.firstName} ${student.studentId.lastName}`,
        AdmissionNumber: matchedStudent?.admissionNumber || "N/A",
        [examDetails.examName]:
          student.status === "absent" || student.status === "excused"
            ? `${student.status}/${student.maxMarks}`
            : `${student.score}/${student.maxMarks}`,
      };
    });

    console.log("Exporting Data:", exportData);

    // Convert data to Excel format
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Data");

    // Download Excel file
    XLSX.writeFile(workbook, `${examDetails.examName}_Exam_Report.xlsx`);
  };
  return (
    <div className="flex flex-col text-black text-xs ">
      {/* row-1 */}
      <div className="flex items-center justify-between h-auto">
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <IoCalendarOutline className="text-sm" />
              <span>Start Date:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="startDate"
                  value={formatDateForInput(examDetails.startDate)}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded-md"
                />
              ) : (
                <span>{formatDate(examDetails.startDate)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 pl-2">
              <IoCalendarOutline className="text-sm " />
              <span>End Date:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="endDate"
                  value={formatDateForInput(examDetails.endDate)}
                  onChange={handleInputChange}
                  className="border px-2 py-1 rounded-md"
                />
              ) : (
                <span>{formatDate(examDetails.endDate)}</span>
              )}
            </div>
          </div>
          {examDetails.publishDate && !isEditing && (
            <div className="flex items-center gap-1">
              <IoCalendarOutline className="text-sm" />
              <span>Published Date:</span>
              <span>{formatDate(examDetails.publishDate)}</span>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-1 w-full md:w-auto">
              <IoCalendarOutline className="text-sm" />
              <span>Published Date:</span>
              <input
                type="date"
                name="publishDate"
                value={formatDateForInput(examDetails.publishDate)} // Set to empty if no date is set
                onChange={handleInputChange}
                className="border px-2 py-1 rounded-md w-full md:w-36"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-y-2 cursor-pointer items-end h-full  gap-1">
          <div className="flex flex-col">
            <Tooltip title="Export">
              <button
                disabled={loading}
                aria-label={t("Delete")}
                onClick={handleExport}
                className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              >
                <AiFillFileExcel className="w-5 h-5 text-red-500" />
              </button>
            </Tooltip>
          </div>
          {isEditing ? (
            <Tooltip title="Save">
              <button
                onClick={handleUpdate}
                className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              >
                <TbCheck className="w-4 h-4 text-green-500" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <button
                onClick={handleEditClick}
                className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              >
                <TbEdit className="w-5 h-5 text-green-500" />
              </button>
            </Tooltip>
          )}

          <div className="flex flex-col">
            <Tooltip title="Delete">
              <button
                disabled={loading}
                aria-label={t("Delete")}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
              >
                <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
              </button>
            </Tooltip>
          </div>
          <DeleteConfirmatiomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDeleteClick}

          />
        </div>
      </div>
    </div>
  );
}

export default DateSection;
