import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Spin, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { MdDeleteOutline, MdPostAdd } from "react-icons/md";
import { fetchConfiguration } from "../../../../Store/Slices/Finance/Configuration/configuration.thunk.js";


const ConfigurationMain = () => {
    const role = useSelector((store) => store.common.auth.role);
    useNavHeading(role, `Configuration`);
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const dispatch = useDispatch();
 
  const [searchText, setSearchText] = useState("");
  const [configurationType, setConfigurationType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

const { configurations, loading, total,
    totalPages,
    page,
     } = useSelector((store) => store.admin.configuration);


  useEffect(() => {
    dispatch(fetchConfiguration({ configurationType, search: searchText, page: currentPage, limit: pageSize }));
  }, [dispatch, configurationType, searchText, currentPage, pageSize]);

 

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (val) => <span>{val}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
     {
          title: "Action",
          key: "action",
          render: (_,record) => {
         
            return (
            <div className="flex items-center flex-row gap-2">
             <button title="Apply" onClick={()=>{}}>Apply <MdPostAdd size={20}/> </button>
             <button title="Delete" onClick={()=>{}}><MdDeleteOutline  size={20}/> </button>
            </div>
            );
          },
        },
  ];

  return (
    <Layout title={`Finance | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          {/* Filters */}
          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div className="flex w-full flex-row items-center gap-4">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-80 py-2"
              />
              <Select
                className="px-1 w-[10rem]"
                value={configurationType}
                onChange={(value) => setConfigurationType(value)}
                placeholder="Select Type"
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="revenue">Revenue</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table
            dataSource={configurations}
            columns={columns}
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
                           dispatch(fetchConfiguration({ configurationType, search: searchText, page, limit: size }));
                         },
                       }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            bordered
            rowKey={(record, idx) => idx}
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ConfigurationMain;
