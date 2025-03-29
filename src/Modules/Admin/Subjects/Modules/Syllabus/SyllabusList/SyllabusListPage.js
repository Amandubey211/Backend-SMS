import React, { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Select,
  Button,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Tooltip,
} from "antd";
import { RiAddFill, RiSearchLine, RiFilterLine } from "react-icons/ri";
import SubjectSideBar from "../../../Component/SubjectSideBar";
import {
  fetchSyllabus,
  deleteSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusThunk";
import {
  fetchSectionsByClass,
  fetchGroupsByClass,
} from "../../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { AiOutlineClear } from "react-icons/ai";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";
import SyllabusList from "./SyllabusList";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import SyllabusListSkeleton from "./SyllabusListSkeleton";
import {
  setSyllabusFilters,
  clearSelectedSyllabus,
} from "../../../../../../Store/Slices/Admin/Class/Syllabus/syllabusSlice";

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const SyllabusListPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admModule");
  const { cid, sid } = useParams();
  const navigate = useNavigate();

  const { syllabi, loading, filters } = useSelector(
    (state) => state.admin.syllabus
  );
  const sectionsList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const groupsList = useSelector(
    (state) => state.admin.group_section.groupsList
  );

  // Fetch syllabus and related data
  useEffect(() => {
    dispatch(fetchSectionsByClass(cid));
    dispatch(fetchGroupsByClass(cid));
    dispatch(fetchSyllabus({ subjectId: sid, classId: cid, ...filters }));
  }, [dispatch, sid, cid, filters]);

  const handleEditClick = () => {
    navigate(`/class/${cid}/${sid}/syllabus/create_syllabus`);
  };

  const handleDeleteClick = async (syllabusId) => {
    await dispatch(deleteSyllabus(syllabusId));
    dispatch(fetchSyllabus({ subjectId: sid, classId: cid, ...filters }));
  };

  const handleSectionChange = (values) => {
    dispatch(setSyllabusFilters({ ...filters, sectionIds: values }));
  };

  const handleGroupChange = (values) => {
    dispatch(setSyllabusFilters({ ...filters, groupIds: values }));
  };

  const handleSearch = (value) => {
    dispatch(setSyllabusFilters({ ...filters, searchQuery: value }));
  };

  const handleClearFilters = () => {
    dispatch(
      setSyllabusFilters({
        searchQuery: "",
        sectionIds: [],
        groupIds: [],
      })
    );
  };

  // When "Add New Syllabus" is clicked, clear the selected syllabus
  const handleAddNewClick = () => {
    dispatch(clearSelectedSyllabus()); // This will reset the selected syllabus in the Redux store
  };

  const renderContent = () => {
    if (loading.fetch) {
      return <SyllabusListSkeleton />;
    }

    return (
      <SyllabusList
        syllabi={syllabi}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    );
  };

  return (
    <Layout title={`Syllabus | Student Diwan`}>
      <DashLayout hideSearchbar={true}>
        <div className="flex h-full w-full">
          <SubjectSideBar />
          <ProtectedSection
            title="Syllabus"
            requiredPermission={PERMISSIONS.VIEW_SYLLABUS}
          >
            <div className="border-l w-full py-4 px-6 flex flex-col h-full">
              {/* Header Section */}
              <div className="flex justify-between items-center ">
                <Title level={4} className="mb-0">
                  All Syllabus
                </Title>
                <ProtectedAction
                  requiredPermission={PERMISSIONS.CREATE_SYLLABUS}
                >
                  <NavLink
                    to={`/class/${cid}/${sid}/syllabus/create_syllabus`}
                    className="flex items-center border border-gray-300 ps-5 rounded-full transition-all duration-300 ease-in-out hover:shadow-md"
                    onClick={handleAddNewClick} // Trigger clearing selected syllabus on click
                  >
                    <span className="mr-2">{t("Add New Syllabus")}</span>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-3xl -mt-2">+</span>
                    </div>
                  </NavLink>
                </ProtectedAction>
              </div>

              {/* Search and Filters Section */}
              <div className="mb-6 bg-white p-2 rounded-lg ">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Search
                      placeholder="Search syllabus by title or content..."
                      allowClear
                      enterButton={
                        <Button type="primary" icon={<RiSearchLine />} />
                      }
                      size="mddle"
                      onSearch={handleSearch}
                      value={filters.searchQuery}
                      onChange={(e) =>
                        dispatch(
                          setSyllabusFilters({
                            ...filters,
                            searchQuery: e.target.value,
                          })
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Select
                      mode="multiple"
                      style={{ width: 200 }}
                      placeholder="Filter by Sections"
                      value={filters.sectionIds}
                      onChange={handleSectionChange}
                      loading={loading.fetch}
                      allowClear
                      suffixIcon={<RiFilterLine />}
                    >
                      {sectionsList?.map((sec) => (
                        <Option key={sec._id} value={sec._id}>
                          {sec.sectionName}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      mode="multiple"
                      style={{ width: 200 }}
                      placeholder="Filter by Groups"
                      value={filters.groupIds}
                      onChange={handleGroupChange}
                      loading={loading.fetch}
                      allowClear
                      suffixIcon={<RiFilterLine />}
                    >
                      {groupsList?.map((group) => (
                        <Option key={group._id} value={group._id}>
                          {group.groupName}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Tooltip title="Clear Filters">
                      <Button
                        onClick={handleClearFilters}
                        disabled={
                          !filters.searchQuery &&
                          !filters.sectionIds.length &&
                          !filters.groupIds.length
                        }
                        icon={<AiOutlineClear />}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </div>

              {/* Syllabus List */}
              <div className="flex-grow overflow-auto">{renderContent()}</div>
            </div>
          </ProtectedSection>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default SyllabusListPage;
