import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Typography,
  message,
  Modal,
  Tag,
  Spin,
  Avatar,
  Divider,
  Badge,
  Card,
  Alert,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { AiOutlineDrag } from "react-icons/ai";
import { distance } from "@turf/turf";

import {
  createRoute,
  getRoutesBySchool,
  updateRoute,
} from "../../../../../Store/Slices/Transportation/RoutesManagment/routes.action";
import SubRouteModal from "./AddSubRouteModal";
import StrictModeDroppable from "./StrictModeDroppable";
import { fetchAllUsersThunk } from "../../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";

const { Option } = Select;
const { Title, Text } = Typography;

const UserAssignmentModal = ({
  visible,
  onCancel,
  onOk,
  stopId,
  subRoutes,
  allUsers,
  assignedUsers,
}) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedStop, setSelectedStop] = useState(null);

  useEffect(() => {
    if (visible && stopId) {
      const currentStop = subRoutes.find((s) => s._id === stopId);
      setSelectedStop(currentStop);

      const studentIds = currentStop?.students?.map((s) => s.studentId) || [];
      const staffIds = currentStop?.staffs?.map((s) => s.staffId) || [];

      form.setFieldsValue({
        students: studentIds,
        staff: staffIds,
      });
    }
  }, [visible, stopId, form, subRoutes]);

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allUsers, searchText]);

  const students = useMemo(
    () => filteredUsers.filter((u) => u.role === "student"),
    [filteredUsers]
  );

  const staff = useMemo(
    () => filteredUsers.filter((u) => u.role !== "student"),
    [filteredUsers]
  );

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onOk({
      stopId,
      studentIds: values.students || [],
      staffIds: values.staff || [],
    });
  };

  const isUserAssignedElsewhere = (userId, currentStopId) => {
    return assignedUsers.some(
      (id) =>
        id === userId &&
        !selectedStop?.students?.some((s) => s.studentId === userId) &&
        !selectedStop?.staffs?.some((s) => s.staffId === userId)
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <UserOutlined className="text-[#C83B62]" />
          <span>
            Assign Users to{" "}
            <span className="text-gradient font-semibold">
              {selectedStop?.stopName || "Stop"}
            </span>
          </span>
        </div>
      }
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      centered
      destroyOnClose
      footer={
        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
          >
            <CloseOutlined />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white hover:opacity-90"
          >
            <CheckOutlined />
            Save Assignments
          </Button>
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <Form form={form} layout="vertical">
          <Input
            placeholder="Search users by name or role..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
            allowClear
          />

          <div className="space-y-4">
            <div>
              <Divider
                orientation="left"
                dashed
                className="text-sm font-semibold "
              >
                <TeamOutlined className="mr-2" /> Students
              </Divider>
              <Form.Item name="students">
                <Select
                  mode="multiple"
                  placeholder="Select students"
                  optionLabelProp="label"
                  filterOption={false}
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 250, overflow: "auto" }}
                  className="user-select-dropdown"
                >
                  {students.map((user) => (
                    <Option
                      key={user.userId}
                      value={user.userId}
                      label={user.name}
                      disabled={isUserAssignedElsewhere(user.userId, stopId)}
                    >
                      <UserItem
                        user={user}
                        isAssignedElsewhere={isUserAssignedElsewhere(
                          user.userId,
                          stopId
                        )}
                      />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div>
              <Divider
                orientation="left"
                dashed
                className="text-sm font-semibold "
              >
                <UserOutlined className="mr-2" /> Staff Members
              </Divider>
              <Form.Item name="staff">
                <Select
                  mode="multiple"
                  placeholder="Select staff members"
                  optionLabelProp="label"
                  filterOption={false}
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 250, overflow: "auto" }}
                  className="user-select-dropdown"
                >
                  {staff.map((user) => (
                    <Option
                      key={user.userId}
                      value={user.userId}
                      label={user.name}
                      disabled={isUserAssignedElsewhere(user.userId, stopId)}
                    >
                      <UserItem
                        user={user}
                        isAssignedElsewhere={isUserAssignedElsewhere(
                          user.userId,
                          stopId
                        )}
                        showRole
                      />
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

const UserItem = ({ user, isAssignedElsewhere, showRole = false }) => (
  <div className="flex items-center gap-3">
    <Avatar
      src={user.profile}
      size="small"
      icon={<UserOutlined />}
      className="flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <Text ellipsis className="block font-medium">
        {user.name}
      </Text>
      {showRole && (
        <Text type="secondary" className="text-xs block">
          {user.role}
        </Text>
      )}
    </div>
    {isAssignedElsewhere && (
      <Tag color="orange" className="ml-2 text-xs">
        Assigned elsewhere
      </Tag>
    )}
  </div>
);

// export default UserAssignmentModal;

export default function RouteForm({ routeData, onSuccess, onDirtyChange, t }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { subRoutes = [] } = useSelector(
    (s) => s.transportation.transportSubRoute ?? { subRoutes: [] }
  );
  const { loading } = useSelector((s) => s.transportation.transportRoute);
  const { allUsers, loading: usersLoading } = useSelector(
    (s) => s.admin.notice
  );

  const [selectedStops, setSelectedStops] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState({
    visible: false,
    stopId: null,
  });
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({
    hasStartPoint: true,
    hasEndPoint: true,
  });

  /* Fetch users on mount */
  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  /* Update assigned users list and validate start/end points */
  useEffect(() => {
    const assigned = selectedStops.flatMap((stop) => [
      ...(stop.students?.map((s) => s.studentId) || []),
      ...(stop.staffs?.map((s) => s.staffId) || []),
    ]);
    setAssignedUsers(assigned);

    // Validate start and end points
    const hasStartPoint = selectedStops.some((s) => s.isStartingPoint);
    const hasEndPoint = selectedStops.some((s) => s.isEndingPoint);
    setFormErrors({
      hasStartPoint,
      hasEndPoint,
    });
  }, [selectedStops]);

  /* dirty */
  useEffect(() => {
    onDirtyChange?.(true);
    return () => onDirtyChange?.(false);
  }, [onDirtyChange]);

  /* preload edit */
  useEffect(() => {
    if (!routeData) {
      form.resetFields();
      setSelectedStops([]);
      return;
    }
    form.setFieldsValue({
      routeName: routeData.routeName,
      isActive: routeData.isActive,
    });

    // Use stops data if available, otherwise use stopage
    const stopsData = routeData.stops || routeData.stopage || [];

    const raw = stopsData.map((s, i, arr) => ({
      key: s.stopId ?? s._id,
      stopId: s.stopId ?? s._id,
      order: i + 1,
      isStartingPoint: s.isStartingPoint || i === 0,
      isEndingPoint: s.isEndingPoint || i === arr.length - 1,
      students: s.students || [],
      staffs: s.staffs || [],
    }));

    setSelectedStops(raw);
  }, [routeData, form]);

  const stopIds = useMemo(
    () => selectedStops.map((s) => s.stopId),
    [selectedStops]
  );
  const reorder = (arr) => arr.map((s, i) => ({ ...s, order: i + 1 }));

  /* add/remove */
  const onStopsSelectChange = (ids) => {
    const add = ids.filter((id) => !stopIds.includes(id));
    const drop = stopIds.filter((id) => !ids.includes(id));

    if (add.length)
      setSelectedStops((prev) =>
        reorder([
          ...prev,
          ...add.map((id) => ({
            key: id,
            stopId: id,
            order: prev.length + 1,
            isStartingPoint: false,
            isEndingPoint: false,
            students: [],
            staffs: [],
          })),
        ])
      );
    if (drop.length)
      setSelectedStops((prev) =>
        reorder(prev.filter((s) => !drop.includes(s.stopId)))
      );
  };

  const removeStop = (id) =>
    onStopsSelectChange(stopIds.filter((x) => x !== id));
  const setAsStart = (id) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isStartingPoint: s.stopId === id,
        isEndingPoint: s.isEndingPoint && s.stopId !== id,
      }))
    );
  const setAsEnd = (id) =>
    setSelectedStops((prev) =>
      prev.map((s) => ({
        ...s,
        isEndingPoint: s.stopId === id,
        isStartingPoint: s.isStartingPoint && s.stopId !== id,
      }))
    );

  /* User assignment */
  const handleAssignUsers = (stopId) => {
    setAssignModal({
      visible: true,
      stopId,
    });
  };

  const handleUserAssignmentSubmit = ({ stopId, studentIds, staffIds }) => {
    setSelectedStops((prev) =>
      prev.map((stop) =>
        stop.stopId === stopId
          ? {
              ...stop,
              students: studentIds.map((id) => ({
                studentId: id,
                ...allUsers.find((u) => u.userId === id),
              })),
              staffs: staffIds.map((id) => ({
                staffId: id,
                ...allUsers.find((u) => u.userId === id),
              })),
            }
          : stop
      )
    );
    setAssignModal({ visible: false, stopId: null });
  };

  /* Calculate distances */
  const getDistanceBetweenStops = (fromId, toId) => {
    const fromStop = subRoutes.find((s) => s._id === fromId);
    const toStop = subRoutes.find((s) => s._id === toId);

    if (!fromStop || !toStop) return null;

    return distance(
      [fromStop.location.lng, fromStop.location.lat],
      [toStop.location.lng, toStop.location.lat],
      { units: "kilometers" }
    ).toFixed(2);
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const arr = [...selectedStops];
    const [moved] = arr.splice(source.index, 1);
    arr.splice(destination.index, 0, moved);
    setSelectedStops(reorder(arr));
  };

  /* submit */
  const handleSubmit = async (vals) => {
    // Validate start and end points
    if (!formErrors.hasStartPoint || !formErrors.hasEndPoint) {
      message.error(
        "Please select both a starting and ending point for the route"
      );
      return;
    }

    const payload = {
      ...vals,
      stopage: selectedStops.map(
        ({
          stopId,
          order,
          isStartingPoint,
          isEndingPoint,
          students,
          staffs,
        }) => ({
          stopId,
          order,
          isStartingPoint,
          isEndingPoint,
          isActive: true,
          studentIds: students?.map((s) => s.studentId) || [],
          staffIds: staffs?.map((s) => s.staffId) || [],
        })
      ),
    };

    try {
      if (routeData?._id || routeData?.routeId) {
        await dispatch(
          updateRoute({ id: routeData._id ?? routeData.routeId, data: payload })
        ).unwrap();
        message.success(t("Route updated successfully"));
      } else {
        await dispatch(createRoute(payload)).unwrap();
        message.success(t("Route created successfully"));
      }
      dispatch(getRoutesBySchool());
      onDirtyChange?.(false);
      onSuccess();
    } catch (err) {
      message.error(err.message ?? t("Failed to save route"));
    }
  };

  /* columns */
  const columns = [
    {
      title: "",
      width: 30,
      render: () => <AiOutlineDrag className="cursor-grab text-gray-400" />,
    },
    {
      title: t("Order"),
      dataIndex: "order",
      width: 60,
      render: (o, r) => (
        <span
          className={
            r.isStartingPoint
              ? "font-bold text-green-600"
              : r.isEndingPoint
              ? "font-bold text-red-600"
              : ""
          }
        >
          {o}
        </span>
      ),
    },
    {
      title: t("Stop"),
      render: (_, r) => {
        const stop = subRoutes.find((s) => s._id === r.stopId);
        return (
          <div>
            <div className="font-medium">{stop?.stopName}</div>
            {stop?.location && (
              <Text type="secondary" className="text-xs">
                {stop.location.lat.toFixed(6)}, {stop.location.lng.toFixed(6)}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: t("Assigned Users"),
      render: (_, r) => {
        const totalAssigned =
          (r.students?.length || 0) + (r.staffs?.length || 0);
        return (
          <Badge count={totalAssigned} size="small">
            <Button
              size="small"
              type="link"
              onClick={() => handleAssignUsers(r.stopId)}
              className="flex items-center gap-1"
            >
              <UserOutlined />
              <span>{t("Assign")}</span>
            </Button>
          </Badge>
        );
      },
    },
    {
      title: t("Distance"),
      render: (_, r, index) => {
        if (index === 0) return null;
        const prevStop = selectedStops[index - 1];
        const dist = getDistanceBetweenStops(prevStop.stopId, r.stopId);
        return dist ? `${dist} km` : "-";
      },
    },
    {
      title: t("Actions"),
      width: 170,
      render: (_, r) => (
        <div className="flex gap-2">
          <Button
            size="small"
            className={
              r.isStartingPoint
                ? "bg-green-600 text-white"
                : "border-green-600 text-green-600"
            }
            onClick={() => setAsStart(r.stopId)}
          >
            {t("Start")}
          </Button>
          <Button
            size="small"
            className={
              r.isEndingPoint
                ? "bg-red-600 text-white"
                : "border-red-600 text-red-600"
            }
            onClick={() => setAsEnd(r.stopId)}
          >
            {t("End")}
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeStop(r.stopId)}
          />
        </div>
      ),
    },
  ];

  /* tag */
  const tagRender = ({ label, closable, onClose }) => (
    <Tag closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );

  const submitLabel = routeData ? t("Update Route") : t("Save Route");
  const submitIcon = routeData ? <EditOutlined /> : <CheckOutlined />;

  return (
    <>
      <Spin spinning={loading || usersLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => onDirtyChange?.(true)}
          className="relative"
        >
          {(!formErrors.hasStartPoint || !formErrors.hasEndPoint) && (
            <Alert
              // message="Route Configuration Required"
              description="Please select both a starting and ending point for the route"
              type="warning"
              showIcon
              icon={<InfoCircleOutlined />}
              className="mb-4"
            />
          )}

          {/* top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item
              name="routeName"
              label={t("Route Name")}
              rules={[
                { required: true, message: t("Please input route name") },
              ]}
            >
              <Input placeholder={t("e.g. Main Campus Route")} />
            </Form.Item>
            <Form.Item name="isActive" label={t("Status")} initialValue={true}>
              <Select>
                <Option value={true}>{t("Active")}</Option>
                <Option value={false}>{t("Inactive")}</Option>
              </Select>
            </Form.Item>
          </div>

          {/* select */}
          <Title level={5}>{t("Add Stops")}</Title>
          <div className="flex gap-2 mb-2">
            <Select
              mode="multiple"
              showSearch
              tagRender={tagRender}
              value={stopIds}
              placeholder={t("Select stops")}
              style={{ flexGrow: 1 }}
              onChange={onStopsSelectChange}
              optionFilterProp="label"
              filterOption={(input, opt) =>
                opt?.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {subRoutes.map((sr) => (
                <Option
                  key={sr._id}
                  value={sr._id}
                  label={sr.stopName}
                  className="flex justify-between items-center"
                >
                  <span>{sr.stopName}</span>
                </Option>
              ))}
            </Select>
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={() => setModalOpen(true)}
            >
              {t("New Stop")}
            </Button>
          </div>

          {/* table */}
          <Title level={5} className="mt-4">
            {t("Selected Stops")}
          </Title>
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="table">
              {(prov) => (
                <Table
                  rowKey="key"
                  pagination={false}
                  dataSource={selectedStops}
                  columns={columns}
                  components={{
                    body: {
                      wrapper: (p) => (
                        <tbody
                          {...p}
                          ref={prov.innerRef}
                          {...prov.droppableProps}
                        >
                          {p.children}
                          {prov.placeholder}
                        </tbody>
                      ),
                      row: (p) => {
                        const idx = selectedStops.findIndex(
                          (s) => s.key === p["data-row-key"]
                        );
                        return (
                          <Draggable
                            draggableId={String(p["data-row-key"])}
                            index={idx}
                          >
                            {(dp) => (
                              <tr
                                {...p}
                                ref={dp.innerRef}
                                {...dp.draggableProps}
                                {...dp.dragHandleProps}
                              />
                            )}
                          </Draggable>
                        );
                      },
                    },
                  }}
                />
              )}
            </StrictModeDroppable>
          </DragDropContext>

          {/* footer */}
          <div className="sticky bottom-0 bg-white py-3 flex justify-end gap-3 border-t">
            <Button
              className="h-10 rounded-lg"
              onClick={() => form.resetFields()}
            >
              {t("Cancel")}
            </Button>
            <Button
              htmlType="submit"
              disabled={
                loading || !formErrors.hasStartPoint || !formErrors.hasEndPoint
              }
              icon={submitIcon}
              className="h-10 rounded-lg font-medium bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white border-0 hover:opacity-90"
            >
              {submitLabel}
            </Button>
          </div>
        </Form>
      </Spin>

      <Modal
        open={modalOpen}
        footer={null}
        title={t("Create Stop")}
        centered
        destroyOnClose
        width={700}
        onCancel={() => setModalOpen(false)}
      >
        <SubRouteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Modal>

      <UserAssignmentModal
        visible={assignModal.visible}
        onCancel={() => setAssignModal({ visible: false, stopId: null })}
        onOk={handleUserAssignmentSubmit}
        stopId={assignModal.stopId}
        subRoutes={subRoutes}
        allUsers={allUsers}
        assignedUsers={assignedUsers}
      />
    </>
  );
}
