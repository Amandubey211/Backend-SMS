import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Spin, Table, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import InventoryForm from "./InventoryForm.js";
import { fetchInventory } from "../../../../Store/Slices/Finance/inventory/inventory.thunk.js";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { GoPlus } from "react-icons/go";

const InventoryList = () => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { inventories, loading, total, totalPages, page } = useSelector((store) => store.admin.inventory);

  const [searchText, setSearchText] = useState("");
  const [inventoryStatus, setInventoryStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useNavHeading(role, `Inventory`);

  useEffect(() => {
    dispatch(fetchInventory({ status: inventoryStatus, search: searchText, page: currentPage, limit: pageSize }));
  }, [dispatch, inventoryStatus, searchText, currentPage, pageSize]);

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
      render: (_, record) => {
        return (
          <p className={`text-${record.lowStockAlert ? "green" : "red"}-500 font-bold px-14`}>{record.lowStockAlert ? "Yes" : "No"}</p>
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

  return (
    <Layout title={`Inventory | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div className="flex w-full flex-row items-center gap-4">
              <Input
                placeholder="Search by name, SKU..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-80 py-2"
              />
              <Select
                className=" px-1  w-[10rem]"
                value={inventoryStatus}
                onChange={(value) => setInventoryStatus(value)}
                placeholder="Select Status"
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="Available">Available</Select.Option>
                <Select.Option value="Out Of Stock">Out Of Stock</Select.Option>
                <Select.Option value="Damaged">Damaged</Select.Option>
              </Select>
            </div>
            <div className="w-[10rem]">
              <button
                onClick={() => { setSelectedInventory(null); setIsModalVisible(true); }}
                className="rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white flex flex-row items-center p-2 text-sm "
              >
                <GoPlus /> Add New Item

              </button>
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
              pageSizeOptions: ["5", "10", "20", "50"],
              size: "small",
              showTotal: (total) => `Page ${currentPage} of ${totalPages} | Total ${total} records`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                dispatch(fetchInventory({ inventoryStatus, search: searchText, page, limit: size }));
              },
            }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
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

export default InventoryList;
