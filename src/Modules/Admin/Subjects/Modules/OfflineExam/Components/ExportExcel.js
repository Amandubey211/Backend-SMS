import { DatePicker, Select } from "antd";
import React, { useState } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import { useSelector } from "react-redux";

function ExportExcel({
  isExportModelOpen,
  setIsExportModelOpen,
  handleExportExcel,
  selectedExportExamTypes,
  setSelectedExportExamTypes,
  startDate,
  setEndDate,
  endDate,
  setStartDate,
  handleCancel,
}) {
  // const [isExportModelOpen, setIsExportModelOpen] = useState(false);
  const { offlineExamData } = useSelector((store) => store.admin.offlineExam);
  return (
    <div>
      <div className=" w-full">
        <button
          onClick={() => setIsExportModelOpen(true)}
          className="flex justify-center items-center gap-x-2 px-4 py-2 w-full rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
        >
          <span>
            <AiFillFileExcel className="text-lg text-red-600" />
          </span>
          <span className="text-gradient">Export Excel</span>
        </button>
      </div>
      {/* Export Excel */}
      {isExportModelOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] relative">
            <h2 className="text-lg font-semibold mb-4">
              Export Offline Exam Data
            </h2>
            <form onSubmit={handleExportExcel} className="space-y-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium text-sm"
                  htmlFor="module-select"
                >
                  Exam Type
                </label>

                <Select
                  mode="multiple" // ✅ Enables multi-selection with tags
                  allowClear
                  placeholder="Select Exam Type"
                  className="w-full"
                  value={selectedExportExamTypes}
                  onChange={(values) => setSelectedExportExamTypes(values)} // ✅ Updates state with selected values
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md m-1 flex items-center gap-1 text-xs capitalize">
                        {label}
                        {closable && (
                          <span
                            onClick={onClose}
                            className="cursor-pointer text-red-500 ml-1 hover:text-red-700"
                          >
                            ✕
                          </span>
                        )}
                      </span>
                    );
                  }}
                  options={[
                    ...Array.from(
                      new Set(
                        offlineExamData.map((exam) =>
                          exam.examType?.trim().toLowerCase()
                        )
                      )
                    ),
                  ].map((examType) => ({
                    label: <span className="capitalize">{examType}</span>,
                    value: examType,
                  }))}
                />
              </div>

              <div>
                <label className=" text-gray-700 font-medium text-sm">
                  Start Date:
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border p-2 rounded-md w-full"
                  placeholderText="Select Start Date"
                />
              </div>

              <div>
                <label className=" text-gray-700 font-medium text-sm">
                  End Date:
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border p-2 rounded-md w-full"
                  placeholderText="Select End Date"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white px-4 py-2 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md"
                >
                  Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportExcel;
