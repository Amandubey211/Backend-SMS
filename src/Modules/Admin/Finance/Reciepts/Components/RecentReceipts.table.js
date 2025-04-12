import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Input, Dropdown, Tag, Spin } from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../../../../../Components/Common/DeleteConfirmationModal";
import Spinner from "../../../../../Components/Common/Spinner";
import {
  fetchAllReceipts,
  cancelReceipt,
} from "../../../../../Store/Slices/Finance/Receipts/receiptsThunks";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
// Import jsPDF and html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";

// Your renamed Receipt component
import Receipt from "../../../../../Utils/FinanceTemplate/Receipt";

const RecentReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const currency = useSelector((store) => store.common.user.userDetails.currency);
  const { receipts = [], loading, error, pagination = {} } = useSelector(
    (state) => state.admin.receipts || {}
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [fetching, setFetching] = useState(true);
  // For canceling a receipt
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // For previewing a receipt in a custom modal
  const [isReceiptVisible, setReceiptVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Detect outside clicks to close the popup
  const popupRef = useRef(null);

  useEffect(() => {

   dispatch(fetchAllReceipts({ page: 1, limit:5,isCancel:false }));
 
  }, [dispatch]);

  

  

  

  const handleDownloadPDF = async () => {
    if (!selectedReceipt) return;
    try {
      const pdfTitle = selectedReceipt.receiptNumber
        ? `${selectedReceipt.receiptNumber}.pdf`
        : "receipt.pdf";

      const canvas = await html2canvas(popupRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);
      pdf.save(pdfTitle);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  


  const columns = [
      {
        title: 'Reciept Number',
        dataIndex: '_id',
        render: (text) => text?.toUpperCase(),
      },
      {
        title: 'Invoice Number',
        dataIndex: 'invoiceNumber',
        render: (text) => text,
      },
     
      {
        title: `Total Amount ${currency}`,
        render: (_,record) => {
          let total = 0;
          record.paidItems.map((i)=>{
           total += i.amountPaid
          })
          return total
        },
      },
      {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        render: (status) => {
          const color = status === 'paid' ? 'green' : status === 'partial' ? 'orange' : 'red';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Payment Method',
        dataIndex: 'paymentType',
      },
      {
        title: 'Date',
        dataIndex: 'paymentDate',
        render: (paymentDate) => `${paymentDate?.slice(0,10)}`,
      },
    ];

  // -------------------- Render --------------------
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 mt-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        {/* Title with counts */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          Recent Receipts List 
        </h2>

        {/* View More Button with counts */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <ProtectedAction requiredPermission={PERMISSIONS.SHOWS_ALL_RECEIPTS}>
            <button
              onClick={() => navigate("/finance/receipts/receipt-list")}
              className="px-3 py-1 rounded-md border border-gray-400 shadow-md hover:shadow-md hover:shadow-gray-300 transition duration-200 text-white bg-gradient-to-r from-pink-500 to-purple-500"
            >
              View More 
            </button>
          </ProtectedAction>

        </div>
      </div>
      <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_ALL_RECEIPTS} title={"Recent Receipts"}>
        {/* Loading Indicator */}
        

          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={receipts}
        
            size="small"
            pagination={false} 
            loading={{
              spinning: loading,
              indicator: <Spin size="large" />,
              tip: "Loading...",
            }}
          />


       
      </ProtectedSection>
    </div>
  );
};

export default RecentReceipts;
