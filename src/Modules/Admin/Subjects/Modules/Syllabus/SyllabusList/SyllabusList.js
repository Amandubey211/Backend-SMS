import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSyllabus } from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusSlice";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Tag,
  Button,
  Typography,
  Popover,
  Badge,
  Space,
  Empty,
  Skeleton,
} from "antd";
import { stripHtml } from "../../../../../../Utils/stringUtils";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";

const { Text } = Typography;

const SyllabusList = ({
  syllabi = [],
  onEditClick,
  onDeleteClick,
  loading = false,
}) => {
  const dispatch = useDispatch();
  const { cid, sid } = useParams();
  const navigate = useNavigate();
  const { selectedSyllabus, filters = {} } = useSelector(
    (state) => state.admin?.syllabus || {}
  );
  const sectionsList = useSelector(
    (state) => state.admin?.group_section?.sectionsList || []
  );
  const groupsList = useSelector(
    (state) => state.admin?.group_section?.groupsList || []
  );
  const { searchQuery = "", sectionIds = [], groupIds = [] } = filters || {};

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [syllabusToDelete, setSyllabusToDelete] = useState(null);

  const getAudienceInfo = (syllabus) => {
    const sections = Array.isArray(syllabus?.sectionIds)
      ? syllabus.sectionIds.map(
          (section) => section?.sectionName || section?._id || ""
        )
      : [];

    const groups = Array.isArray(syllabus?.groupIds)
      ? syllabus.groupIds.map((group) => group?.groupName || group?._id || "")
      : [];

    return {
      sections: sections.filter(Boolean),
      groups: groups.filter(Boolean),
    };
  };

  const handleRowClick = (syllabus) => {
    if (!syllabus?._id) return;
    dispatch(setSelectedSyllabus(syllabus));
    navigate(`/class/${cid}/${sid}/syllabus/view`);
  };

  const handleEdit = (e, syllabus) => {
    e?.stopPropagation();
    if (!syllabus?._id) return;
    dispatch(setSelectedSyllabus(syllabus));
    onEditClick?.(syllabus);
  };

  const handleDeleteClick = (e, syllabus) => {
    e?.stopPropagation();
    if (!syllabus?._id) return;
    setSyllabusToDelete(syllabus);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (syllabusToDelete?._id) {
      await onDeleteClick?.(syllabusToDelete._id);
      setDeleteModalVisible(false);
    }
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const renderGroups = (groups = []) => {
    if (!groups?.length) return <Tag>All Groups</Tag>;

    const visibleGroups = groups.slice(0, 2);
    const remainingCount = groups.length - 2;

    const content = (
      <div style={{ maxWidth: 300 }}>
        {groups.map((group, index) => (
          <Tag key={index} color="green" style={{ marginBottom: 4 }}>
            {group}
          </Tag>
        ))}
      </div>
    );

    return (
      <Popover content={content} title="Groups" trigger="hover">
        <Space size={4}>
          {visibleGroups.map((group, index) => (
            <Tag key={index} color="green">
              {group || "N/A"}
            </Tag>
          ))}
          {remainingCount > 0 && (
            <Badge
              count={`+${remainingCount}`}
              style={{ backgroundColor: "#52c41a" }}
            />
          )}
        </Space>
      </Popover>
    );
  };

  const renderSections = (sections = []) => {
    if (!sections?.length) return <Tag>All Sections</Tag>;

    const visibleSections = sections.slice(0, 2);
    const remainingCount = sections.length - 2;

    const content = (
      <div style={{ maxWidth: 200 }}>
        {sections.map((section, index) => (
          <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
            {section}
          </Tag>
        ))}
      </div>
    );

    return (
      <Popover content={content} title="Sections" trigger="hover">
        <Space size={4}>
          {visibleSections.map((section, index) => (
            <Tag key={index} color="blue">
              {section || "N/A"}
            </Tag>
          ))}
          {remainingCount > 0 && (
            <Badge
              count={`+${remainingCount}`}
              style={{ backgroundColor: "#1890ff" }}
            />
          )}
        </Space>
      </Popover>
    );
  };

  const filteredSyllabi =
    syllabi?.filter((syllabus) => {
      if (!syllabus) return false;

      // Search filter
      const matchesSearch = searchQuery
        ? syllabus?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          stripHtml(syllabus?.content || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      // Section filter
      const matchesSections =
        sectionIds?.length > 0
          ? sectionIds.some((id) =>
              syllabus?.sectionIds?.some((section) => section?._id === id)
            )
          : true;

      // Group filter
      const matchesGroups =
        groupIds?.length > 0
          ? groupIds.some((id) =>
              syllabus?.groupIds?.some((group) => group?._id === id)
            )
          : true;

      return matchesSearch && matchesSections && matchesGroups;
    }) || [];

  const columns = [
    {
      title: "S.N",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 400,
      render: (text) => <Text strong>{capitalize(text || "Untitled")}</Text>,
    },
    {
      title: "Sections",
      key: "sections",
      width: 150,
      render: (_, record) => {
        const { sections = [] } = getAudienceInfo(record);
        return renderSections(sections);
      },
    },
    {
      title: "Groups",
      key: "groups",
      width: 150,
      render: (_, record) => {
        const { groups = [] } = getAudienceInfo(record);
        return renderGroups(groups);
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleRowClick(record)}
            title="View"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(e, record)}
            title="Edit"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteClick(e, record)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!filteredSyllabi?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Empty
          description="No syllabus found matching your criteria"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={filteredSyllabi}
        rowKey="_id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: {
            cursor: "pointer",
            background:
              selectedSyllabus?._id === record?._id ? "#e6f7ff" : "inherit",
          },
        })}
        rowClassName={() => "hover:bg-gray-50"}
        pagination={false}
      />

      <DeleteModal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={syllabusToDelete?.title || "Untitled Syllabus"}
      />
    </>
  );
};

export default SyllabusList;
