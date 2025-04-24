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
import { render } from "react-dom";

const InventoryLowStockList = () => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const {  loading, total, totalPages, page,lowStock } = useSelector((store) => store.admin.inventory);

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
    // {
    //   title: "Action",
    //   render: (_, record) => (

    //       <a href="#" className="text-sm text-blue-500">
    //       Generate Purchase Order
    //       </a>
    //   ),
    //   width: 100,
    // },
  ];

  return (
    <Layout title={`Inventory | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div className="flex w-full flex-row items-center gap-4 font-bold">
            Low Stock Items
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
            dataSource={lowStock.inventories}
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

export default InventoryLowStockList;
