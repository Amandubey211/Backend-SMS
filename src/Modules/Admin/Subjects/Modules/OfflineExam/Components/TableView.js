import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const TableView = ({ data = [], handleData, setIsOpen, isOpen }) => {
  const hotRef = useRef(null);
  const hotInstanceRef = useRef(null); // Store table instance
  const fileData = data;
  const navigate = useNavigate();
  const { cid, sid } = useParams();

  useEffect(() => {
    // Default empty table structure
    const headers =
      fileData.length > 0
        ? fileData[0]
        : [
            "Name",
            "AdmissionNumber",
            "Quiz 1",
            "Exam 1",
            "Quiz 2",
            "Exam 2",
            "Project",
          ];
    const tableData =
      fileData.length > 1 ? fileData.slice(1) : [["", "", "", "", "", "", ""]];

    if (hotInstanceRef.current) {
      hotInstanceRef.current.updateSettings({
        data: tableData,
        colHeaders: headers,
        readOnly: true,
      });
    } else {
      hotInstanceRef.current = new Handsontable(hotRef.current, {
        data: tableData,
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
  }, [fileData]);

  const handleCancel = () => {
    navigate(-2);
  };

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2 ">
      <div
        ref={hotRef}
        className="h-full w-[60%] border rounded-sm shadow-sm bg-gray-50 overflow-x-scroll"
      ></div>
      <div className="flex justify-end space-x-4 items-end w-[20%] fixed bottom-5 right-5">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button disabled type="primary" htmlType="submit" onClick={handleData}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default TableView;
