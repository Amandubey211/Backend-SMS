import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";

const HandsontableComp = (fileData = []) => {
  const hotRef = useRef(null);
  const hotInstanceRef = useRef(null); // Store table instance
  const data = fileData.data;
  console.log("dsad", data);

  useEffect(() => {
    // Default empty table structure
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
    const tableData =
      data.length > 1 ? data.slice(1) : [["", "", "", "", "", "", ""]];
    console.log("Headers:", headers);

    if (hotInstanceRef.current) {
      hotInstanceRef.current.updateSettings({
        data: tableData,
        colHeaders: headers,
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
        licenseKey: "non-commercial-and-evaluation",
      });
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="w-full p-4 bg-white border shadow-md mt-2 ">
      <div
        ref={hotRef}
        className="h-full w-[60%] border rounded-sm shadow-sm bg-gray-50 overflow-x-scroll"
      ></div>
    </div>
  );
};

export default HandsontableComp;
