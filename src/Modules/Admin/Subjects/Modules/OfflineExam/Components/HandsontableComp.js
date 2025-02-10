import React, { useRef, useState } from "react";
import "handsontable/dist/handsontable.full.min.css";
import { HotTable } from "@handsontable/react";

const HandsontableComp = () => {
  const hotRef = useRef(null);
  const [data, setData] = useState([
    ["Student ID", "Name", "Score", "Max Marks", "Status"],
    ["6731aabae94bad3d036d9de0", "John Doe", 40, 50, "Present"],
    ["6731aabae94bad3d036d9de1", "Jane Smith", 45, 50, "Present"],
    ["6731aabae94bad3d036d9de2", "Robert Brown", 30, 50, "Absent"],
  ]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Upload Sample Excel Data</h2>
      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={true}
        rowHeaders={true}
        width="100%"
        height="auto"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        className="border"
      />
    </div>
  );
};

export default HandsontableComp;
