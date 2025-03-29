import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Spin, Table, Button, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { fetchEntity } from "../../../../Store/Slices/Finance/entitie/entity.thunk.js";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import EntityAddForm from "./EnitityForm.js";
import { FaPlusCircle } from "react-icons/fa";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";



const Entities = () => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { entities, loading, total, totalPages, page } = useSelector((store) => store.admin.entity);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [editEntity, setEditEntity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false)
  }
  useNavHeading(role, `Entities`);

  useEffect(() => {
    dispatch(fetchEntity({ search: searchText, page: currentPage, limit: pageSize }));
  }, [dispatch,  searchText, currentPage, pageSize]);


  const columns = [
    {
      title: "Entity Name",
      dataIndex: "entityName",
      key: "entityName",
      render: (value) => <span className="text-md">{value || "N/A"}</span>,
      ellipsis: true,
    },
    {
      title: "Entity Type",
      dataIndex: "entityType",
      key: "entityType",
      render: (value) => <span className="text-md">{value || "N/A"}</span>,
      ellipsis: true,
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (value) => <span className="text-md">{value || "N/A"}</span>,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value) => <span className="text-md">{value || "N/A"}</span>,
      ellipsis: true,
    },
    {
      title: "Action",

      render: (_,record) => (
        <>
         <Button
          type="link"
          onClick={() => {
            setEditEntity(record);
            setIsModalVisible(true)
          }}
        >
          <MdEdit size={20}/>
        </Button>
         <Button
          type="link"
          onClick={() => {
            setEditEntity({mode:"view",...record});
            setIsModalVisible(true)
          }}
        >
          <MdRemoveRedEye size={20}/>
        </Button>
        </>
       
      ),
    },
  ];

  return (
    <Layout title={`Finance | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search by name, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="w-80"
            />
           <div className="w-[10rem]">
                         <button
                           onClick={() => { setEditEntity(null); setIsModalVisible(true) }}
                           className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2 "
                         >
                           <span className="text-gray-800 font-medium">Add Entity</span>
                           <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                             <FaPlusCircle size={16} />
                           </div>
                         </button>
                       </div>
          </div>

          <Table
            dataSource={entities}
            columns={columns}
            size="small"
            pagination={{
              current: currentPage,
              total: total,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total) => `Total ${total} records`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                dispatch(fetchEntity({ search: searchText, page, limit: size }));
              },
            }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            bordered
          />
        </div>
        <Sidebar
          title={editEntity ? "Entity Full Information" : "Add Entity"}
          width="50%"
          isOpen={isModalVisible}
          onClose={handleModalClose}
        >
          <EntityAddForm visible={isModalVisible} onClose={handleModalClose} editData={editEntity} />
        </Sidebar>

      </DashLayout>
    </Layout>
  );
};

export default Entities;
