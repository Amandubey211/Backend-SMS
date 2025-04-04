import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Spin, Table, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaStackOverflow, FaWarehouse } from "react-icons/fa";
import { GiWeight, GiReceiveMoney } from "react-icons/gi";
import { FaPlusCircle } from "react-icons/fa";
import InventoryForm from "./InventoryForm.js";
import { fetchInventory, fetchLowInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk.js";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { MdCancelPresentation, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FiBox } from "react-icons/fi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { CgAddR } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
const Inventory = () => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { inventories, loading, total, totalPages, page, otherData } = useSelector((store) => store.admin.inventory);
  const { lowStock } = useSelector((store) => store.admin.inventory);
const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const [searchText, setSearchText] = useState("");
  const [lowStocksearchText, setSowStockSearchText] = useState("");
  const [inventoryStatus, setInventoryStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lowStockcurrentPage, setlowStockCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lowStockpageSize, setLowStockPageSize] = useState(10);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useNavHeading(role, `Inventory`);

  useEffect(() => {
    dispatch(fetchInventory({ status: inventoryStatus, search: searchText, page: currentPage, limit: pageSize }));

  }, [dispatch, inventoryStatus, searchText, currentPage, pageSize]);
  useEffect(() => {
    dispatch(fetchLowInventory({  search: lowStocksearchText, page: lowStockcurrentPage, limit: lowStockpageSize }));

  }, [  lowStocksearchText, lowStockcurrentPage, lowStockpageSize]);


  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      ellipsis: true,
      width: 100,
    },
    {
      title: "SKU",
      dataIndex: "SKU",
      key: "SKU",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Current Stock",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "inventoryStatus",
      key: "inventoryStatus",
      width: 100,
    },
    {
      title: "Low Stock Alert",
      render: (_, record) =>{
        return(
          <p className={`text-${record.lowStockAlert?"green":"red"}-500 font-bold px-14`}>{record.lowStockAlert?"Yes":"No"}</p>
        )
      },
      width: 100,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex flex-row gap-4">
          <span className="text-xs text-blue-600 cursor-pointer" onClick={() => { setSelectedInventory(record); setIsModalVisible(true); }} title="Edit"><MdEdit size={20} /></span>
          <span className="text-xs text-blue-600 cursor-pointer" onClick={() => { setSelectedInventory({ mode: "view", ...record }); setIsModalVisible(true); }} title="View"><MdRemoveRedEye size={20} /></span>
        </div>

      ),
      width: 80,
    },
  ];
  const lowStockcolumns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      ellipsis: true,
      width: 100,
    },
    {
      title: "SKU",
      dataIndex: "SKU",
      key: "SKU",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "inventoryStatus",
      key: "inventoryStatus",
      width: 100,
    },
    {
      title: "Reorder Level",
       dataIndex: "lowStockNumber",
      key: "lowStockNumber",
      width: 100,
      width: 100,
    },
    {
      title: "Action",
      render: (_, record) => (
        
          <a href="#" className="text-sm text-blue-500">
          Generate Purchase Order
          </a>
      ),
      width: 100,
    },
  ];
  const navigate = useNavigate()

  return (
    <Layout title={`Inventory | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="font-bold">
                Inventory Management
              </h1>

            </div>
            <div className="flex  flex-row items-center gap-4">
              <div className="">
                <button
                  onClick={() => { setSelectedInventory(null); setIsModalVisible(true); }}
                  className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex flex-row items-center p-2 text-sm"
                >
                  <GoPlus /> Add New Item

                </button>
              </div>
            </div>

          </div>
          <div className="flex flex-row gap-4 mb-4">
            {[{ title: "Total Inventory Items", value: `${total || 0} Items`, icon: <FiBox /> },
            { title: "Low-Stock Alerts", value: `${otherData?.totalLowStockItems?.length || 0} Items`, icon: <FaStackOverflow /> },
            { title: "Expiring Soon Item", value: `${otherData?.expiringSoonItems?.length || 0} Items`, icon: <MdCancelPresentation /> },
            { title: "Total Asset Value", value: `${otherData?.totalAssestPrice || 0} ${schoolCurrency}`, icon: <BiMoneyWithdraw /> }
            ].map((item, index) => (
              <>
              <div
        className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
        style={{
          background:
            "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
          borderColor: "#DABDFF",
        }}
      >
        {/* Title and Icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
            {item?.icon}
          </div>
          <h3 className="text-sm font-medium text-gray-800 truncate">{item?.title}</h3>
        </div>
  
        {/* Value and Trend */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-purple-800 truncate">
            {item?.value}
          </h2>
        </div>
      </div>
              </>
            ))}
          </div>

         {otherData?.inventoryCategories?.length > 0 && <>
          <h1 className="font-bold mb-2">
          Inventory Categories
        </h1>
          <div className="flex flex-row item-center flex-wrap bg-gradient-to-t from-purple-100 to-pink-100 text-white p-4 mb-4 gap-2">

            {otherData?.inventoryCategories?.map((category, index) => (
              <>
                <div className="flex items-center flex-col gap-1 p-2 border border-purple-500 border-w-4 rounded-lg w-[10rem]" key={index}>
                  <div className="flex justify-between items-center">
                    <img src={category?.categoryId?.icon} alt="logo" className="w-10 h-10" />
                  </div>
                  <div className="flex justify-between items-center text-purple-900">
                    {category?.categoryId?.categoryName}
                  </div>
                </div>
              </>
            ))}
            <div className="flex items-center flex-col gap-2 p-2 border border-purple-500 border-w-4 rounded-lg w-[10rem] cursor-pointer" onClick={() => { navigate("/finance/categories")}}>
              <div className="flex justify-between items-center">
                <CgAddR size={34} className="text-purple-400" />
              </div>
              <div className="flex justify-between items-center text-purple-900">
                Add New Category
              </div>
            </div>
          </div></>}

          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="font-bold"> Inventory List</h1>

            </div>
            <div className="flex  flex-row items-center gap-4">
              <Input
                placeholder="Search by name, SKU..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-60 py-2"
              />
              <button className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex flex-row items-center p-2 text-sm" onClick={()=>navigate("/finance/Inventory/list")}>View More</button>
            </div>

          </div>

          <Table
            dataSource={inventories}
            columns={columns}
            size="small"
            pagination={{
              current: currentPage,
              total: total,
              pageSize: pageSize,
              showSizeChanger: true,
            }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            bordered
          />
        </div>
     <div className="p-4">
     <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="font-bold">Low Inventory List</h1>

            </div>
            <div className="flex  flex-row items-center gap-4">
              <Input
                placeholder="Search by name, SKU..."
                prefix={<SearchOutlined />}
                value={lowStocksearchText}
                onChange={(e) => setSowStockSearchText(e.target.value)}
                allowClear
                className="w-60 py-2"
              />
              {/* <button className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex flex-row items-center p-2 text-sm">View More</button> */}
            </div>

          </div>

          <Table
            dataSource={lowStock.inventories}
            columns={lowStockcolumns}
            size="small"
            pagination={{
              current: lowStockcurrentPage,
              total: lowStock.total,
              pageSize: lowStockpageSize,
              showSizeChanger: true,
            }}
            loading={{ spinning: lowStock.loading, indicator: <Spin size="large" /> }}
            bordered
          />
     </div>
        <Sidebar
          title={selectedInventory ? "Item Full Information" : "Add Inventory"}
          width="50%"
          isOpen={isModalVisible}
          onClose={handleModalClose}
        >
          <InventoryForm visible={isModalVisible} onClose={handleModalClose} editData={selectedInventory} />
        </Sidebar>
      </DashLayout>
    </Layout>
  );
};

export default Inventory;
