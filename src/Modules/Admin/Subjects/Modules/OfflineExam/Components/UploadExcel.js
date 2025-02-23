import React, { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Button } from "antd";

const UploadExcel = ({
  data = [],
  handleCreateExam,
  isCreateLoading,
  setIsOpen,
  setIsCreateLoading,
  isOpen,
}) => {
  const hotRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // ✅ Add state to manage table data
  const [tableData, setTableData] = useState([]);
  const [isTableDataFilled, setIsTableDataFilled] = useState(false); // New state

  useEffect(() => {
    const headers =
      data.length > 0
        ? data[0]
        : [
            "Name",
            "AdmissionNumber",
            "Quiz 1",
            "Exam 1",
            "Quiz 2",
            "Exam 2",
            "Project",
          ];

    const formattedData =
      data.length > 1 ? data.slice(1) : [["", "", "", "", "", "", ""]];
    setTableData(formattedData); // ✅ Update state

    if (hotInstanceRef.current) {
      hotInstanceRef.current.updateSettings({
        data: formattedData,
        colHeaders: headers,
        readOnly: true,
        columns: headers.map(() => ({ readOnly: true })),
      });
    } else {
      hotInstanceRef.current = new Handsontable(hotRef.current, {
        data: formattedData,
        colHeaders: headers,
        rowHeaders: true,
        width: "100%",
        height: "auto",
        stretchH: "all",
        contextMenu: true,
        readOnly: true,
        licenseKey: "non-commercial-and-evaluation",
        columns: headers.map(() => ({ readOnly: true })),
        afterChange: (changes) => {
          // Listen for changes
          if (changes) {
            checkTableDataFilled();
          }
        },
      });
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, [data]); // ✅ Update when data changes

  const checkTableDataFilled = () => {
    // Function to check if table is filled
    const isFilled = tableData.some((row) => row.some((cell) => cell !== ""));
    setIsTableDataFilled(isFilled);
  };
  const handleCancel = () => {
    // ✅ Clear table data
    setTableData([]);
    setIsTableDataFilled(false);
    // ✅ Reset Handsontable manually
    if (hotInstanceRef.current) {
      hotInstanceRef.current.loadData([["", "", "", "", "", "", ""]]);
    }
    setIsOpen(false);
  };

  console.log("asdasd", isCreateLoading);

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2 ">
      <div
        ref={hotRef}
        className="h-full w-[60%] border rounded-sm shadow-sm bg-gray-50 overflow-x-scroll"
      ></div>

      <div className="flex justify-end space-x-4 items-end w-[20%] fixed bottom-5 right-5">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          disabled={isTableDataFilled || isCreateLoading}
          loading={isCreateLoading}
          type="primary"
          htmlType="submit"
          onClick={handleCreateExam}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default UploadExcel;
