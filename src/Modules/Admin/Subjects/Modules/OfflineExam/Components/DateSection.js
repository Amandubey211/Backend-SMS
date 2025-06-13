import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCheck, TbEdit } from "react-icons/tb";
import { formatDate } from "../../../../../../Utils/helperFunctions";
import { useTranslation } from "react-i18next";
import { AiFillFileExcel } from "react-icons/ai";
import { Tooltip } from "antd";
import * as XLSX from "xlsx";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import DeleteConfirmatiomModal from "../../../../../../Components/Common/DeleteConfirmationModal";
import { setCellModal } from "../../../../../../Store/Slices/Admin/scoreCard/scoreCard.slice";

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
  examId,
  cid,
}) {
  const dispatch = useDispatch();
  const formatDateForInput = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split("T")[0];
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

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Data");
    XLSX.writeFile(workbook, `${examDetails.examName}_Exam_Report.xlsx`);
  };

  return (
    <div className="flex flex-col text-black text-xs w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-[180px]">
              <IoCalendarOutline className="text-sm text-gray-600" />
              <span className="font-medium text-gray-700">Start Date:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="startDate"
                  value={formatDateForInput(examDetails.startDate)}
                  onChange={handleInputChange}
                  className="border border-gray-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 w-28"
                />
              ) : (
                <span className="text-gray-600">
                  {formatDate(examDetails.startDate)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 min-w-[180px]">
              <IoCalendarOutline className="text-sm text-gray-600" />
              <span className="font-medium text-gray-700">End Date:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="endDate"
                  value={formatDateForInput(examDetails.endDate)}
                  onChange={handleInputChange}
                  className="border border-gray-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 w-28"
                />
              ) : (
                <span className="text-gray-600">
                  {formatDate(examDetails.endDate)}
                </span>
              )}
            </div>
          </div>
          {(examDetails.publishDate || isEditing) && (
            <div className="flex items-center gap-1.5 min-w-[180px]">
              <IoCalendarOutline className="text-sm text-gray-600" />
              <span className="font-medium text-gray-700">Published Date:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="publishDate"
                  value={formatDateForInput(examDetails.publishDate)}
                  onChange={handleInputChange}
                  className="border border-gray-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 w-28"
                />
              ) : (
                <span className="text-gray-600">
                  {formatDate(examDetails.publishDate)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 items-center flex-wrap">
          <Tooltip title="Add to Score Card">
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() =>
                dispatch(
                  setCellModal({
                    modelName: "offline",
                    dataId: examId,
                    classId: cid,
                  })
                )
              }
              className="border-green-500 text-green-500 hover:border-green-600 hover:text-green-600 bg-transparent rounded-md transition-all duration-200 flex items-center justify-center text-sm font-medium px-3 py-1"
            >
              Report Card
            </Button>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <button
              disabled={loading}
              aria-label={t("Export")}
              onClick={handleExport}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-all duration-200"
            >
              <AiFillFileExcel className="w-5 h-5 text-red-500" />
            </button>
          </Tooltip>
          {isEditing ? (
            <Tooltip title="Save">
              <button
                onClick={handleUpdate}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-all duration-200"
              >
                <TbCheck className="w-5 h-5 text-green-500" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <button
                onClick={handleEditClick}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-all duration-200"
              >
                <TbEdit className="w-5 h-5 text-green-500" />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <button
              disabled={loading}
              aria-label={t("Delete")}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-all duration-200"
            >
              <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
            </button>
          </Tooltip>
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