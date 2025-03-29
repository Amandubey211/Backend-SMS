import React from "react";
import { Table, Skeleton, Space } from "antd";

const SyllabusListSkeleton = () => {
  const columns = [
    {
      title: "S.N",
      key: "index",
      width: 10,
      render: () => (
        <Skeleton.Input active size="small" style={{ width: 10 }} />
      ),
    },
    {
      title: "Title",
      key: "title",
      render: () => (
        <Skeleton.Input active size="small" style={{ width: 200 }} />
      ),
    },

    {
      title: "Sections",
      key: "sections",
      width: 100,
      render: () => (
        <Space>
          <Skeleton.Input active size="small" style={{ width: 60 }} />
        </Space>
      ),
    },
    {
      title: "Groups",
      key: "groups",
      width: 100,
      render: () => (
        <Space>
          <Skeleton.Input active size="small" style={{ width: 60 }} />
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: () => (
        <Space>
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Button active size="small" shape="circle" />
          <Skeleton.Button active size="small" shape="circle" />
        </Space>
      ),
    },
  ];

  const data = Array(3).fill({ key: "1" });

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
};

export default SyllabusListSkeleton;
