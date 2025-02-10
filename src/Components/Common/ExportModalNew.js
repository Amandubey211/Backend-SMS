import React from "react";
import { Modal, Button } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ExportModalNew = ({
  visible,
  onClose,
  dataToExport,
  columns,
  fileName = "Export",
  alwaysRender = false, // new optional prop
}) => {
  // If alwaysRender is false and data is empty, don't render the modal.
  if (!alwaysRender && (!Array.isArray(dataToExport) || dataToExport.length === 0)) {
    return null;
  }

  const exportData = Array.isArray(dataToExport) ? dataToExport : [];

  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = columns.map((col) => col.header);
    const body = exportData.map((row) =>
      columns.map((col) => row[col.dataKey] || "N/A")
    );
    doc.autoTable({
      head: [headers],
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 58, 64] },
    });
    doc.save(`${fileName}.pdf`);
    onClose();
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    onClose();
  };

  return (
    <Modal open={visible} title="Export Data" onCancel={onClose} footer={null}>
      {exportData.length === 0 ? (
        <div className="text-center text-gray-500">No data available for export</div>
      ) : (
        <div className="flex justify-around">
          <Button type="primary" icon={<FilePdfOutlined />} onClick={exportPDF}>
            Export as PDF
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} onClick={exportExcel}>
            Export as Excel
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ExportModalNew;
