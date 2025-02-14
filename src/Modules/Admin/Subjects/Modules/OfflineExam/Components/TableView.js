import React, { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Button } from "antd";
import { ImSpinner3 } from "react-icons/im";

const TableView = ({ data = [], handleData, loading, setIsOpen, isOpen }) => {
  const hotRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // ✅ Add state to manage table data
  const [tableData, setTableData] = useState([]);

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
      });
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, [data]); // ✅ Update when data changes

  const handleCancel = () => {
    // ✅ Clear table data
    setTableData([]);

    // ✅ Reset Handsontable manually
    if (hotInstanceRef.current) {
      hotInstanceRef.current.loadData([["", "", "", "", "", "", ""]]);
    }

    setIsOpen(false);
  };

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2">
      <div
        ref={hotRef}
        className="h-full w-[60%] border rounded-sm shadow-sm bg-gray-50 overflow-x-scroll"
      ></div>

      <div className="flex justify-end space-x-4 items-end w-[20%] fixed bottom-5 right-5">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          className={`${loading ? "cursor-not-allowed" : ""}`}
          disabled={loading}
          type="primary"
          htmlType="submit"
          onClick={handleData}
        >
          {loading ? (
            <ImSpinner3 className="w-6 h-6 animate-spin text-white" />
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TableView;
