import React from "react";
import { Modal, Button } from "antd";
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

/**
 * @component ExportModalNew
 * @description A reusable export modal to handle exporting data in PDF & Excel formats.
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {Array} dataToExport - The data array to be exported
 * @param {Array} columns - Column headers for export
 * @param {string} fileName - File name prefix for exports
 */
const ExportModalNew = ({ visible, onClose, dataToExport, columns, fileName = "Export" }) => {
  if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
    return null;
  }

  /**
   * Export data as a formatted PDF file
   */
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Extract headers and data for the table
    const headers = columns.map(col => col.header);
    const body = dataToExport.map(row => columns.map(col => row[col.dataKey] || "N/A"));

    doc.autoTable({
      head: [headers],
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 58, 64] },
    });

    doc.save(`${fileName}.pdf`);
    onClose();
  };

  /**
   * Export data as an Excel file
   */
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    onClose();
  };

  return (
    <Modal visible={visible} title="Export Data" onCancel={onClose} footer={null}>
      <div className="flex justify-around">
        <Button type="primary" icon={<FilePdfOutlined />} onClick={exportPDF}>
          Export as PDF
        </Button>
        <Button type="primary" icon={<FileExcelOutlined />} onClick={exportExcel}>
          Export as Excel
        </Button>
      </div>
    </Modal>
  );
};

export default ExportModalNew;
