import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import { useSelector } from "react-redux";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../Components/Common/Spinner";



const RecentInvoice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const {loading,error,invoices} = useSelector((store)=>store.admin.invoices)
  // Filter data based on search query
  const filteredData = invoices.filter(
    (item) =>
      item?.invoiceNumber?.toLowerCase()?.includes(searchQuery.toLowerCase()) 
      // item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // item.class.toString().includes(searchQuery) ||
      // item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // item.dueDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // item.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const StatusBadge = (i) => {
    let style = {};
    let text = 'Active'
    if (i.isReturn) {
        style = { backgroundColor: "#F3EAFF", color: "#3F2FF2" };
        text = 'Return'
    } else if (i.isCancel) {
        style = { backgroundColor: "#FFE6E5", color: "#E70F00" };
        text = 'Cancel'
    } else {
        style = { backgroundColor: "#cfe3d3", color: "#297538" };
        text = 'Active'
    }
    return (
        <span className="px-4 py-2 rounded-md text-sm font-semibold " style={style}>
            {text}
        </span>
    );
};
  return (
    <div className="border-2 rounded-lg p-4" style={{ borderColor: "#FFCEDB" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Invoice List</h2>
        <div className="flex gap-4">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-[0.825rem] text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full pl-10 pr-4 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/finance/invoices/dashboard/recent-invoices")}
            className="px-4 py-2 rounded-md border border-gray-400 shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-200 text-transparent bg-gradient-text bg-clip-text"
          >
            View More ({invoices?.length})
          </button>

        </div>
      </div>

     {
     loading?<Spinner/>:error || invoices.length == 0 ?<NoDataFound/>:
     <>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "#FFCEDB" }} className="text-left text-gray-800">
            <th className="py-3 px-4 font-medium">Invoice NO.</th>
            <th className="py-3 px-4 font-medium">Recipient Name</th>
            <th className="py-3 px-4 font-medium">Due Date</th>
            <th className="py-3 px-4 font-medium">Final Amount</th>
            <th className="py-3 px-4 font-medium">Sub-Category</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.slice(0,5).map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-4 px-4">-{item?.invoiceNumber.slice((item?.invoiceNumber?.length)-5,item?.invoiceNumber?.length)}</td>
              <td className="py-4 px-4">{item?.receiver?.name}</td>
              <td className="py-4 px-4">{item?.dueDate?.slice(0,10)}</td>
              <td className="py-4 px-4">{item?.finalAmount?.toFixed(2)}</td>
              <td className="py-4 px-4 flex flex-col">{item?.lineItems[0].revenueType} <span>{item?.lineItems[1]?.revenueType|| ' ' } </span></td>
              <td className="py-3 px-4 font-medium">
              <StatusBadge i={item}/>
              </td>
              <td className="py-4 px-4">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                >
                  <MoreOutlined style={{ fontSize: "16px", color: "#808080" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></>
      }
    </div>
  );
};

export default RecentInvoice;
