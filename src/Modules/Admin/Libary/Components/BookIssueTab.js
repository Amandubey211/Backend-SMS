import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import BookIssueRow from "../Components/BookIssueRow";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Select, Skeleton, Input, Tooltip } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import  Pagination from '../../../../Components/Common/pagination'
const { Option } = Select;
const { Search } = Input;

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "parent", label: "Parent" },
  { value: "staff", label: "Staff" },
  { value: "finance", label: "Finance" },
  { value: "librarian", label: "Librarian" },
];

const initialFilters = {
  searchQuery: "",
  classLevel: "",
  section: "",
  book: "",
  status: "",
  roleType: "",
};

const BookIssueTab = ({ handleSidebarOpen, setEditIssueData, page,
  setPage,
  limit,
  setLimit, }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const {
    bookIssues,
    books,
    loading: libraryLoading,
  } = useSelector((state) => state.admin.library);
  const classList = useSelector((store) => store.admin.class.classes);
  const { totalPages, totalBooks } = useSelector((state) => state.admin.library);
  const sectionList = useSelector(
    (store) => store.admin.group_section.sectionsList
  );
  const role = useSelector((store) => store.common.auth.role);

  // Local filters state
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    // Optionally fetch additional data here.
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "classLevel" && value) {
      dispatch(fetchSectionsNamesByClass(value));
    }
  };

  const handleSearch = (value) => {
    setLocalFilters((prev) => ({ ...prev, searchQuery: value }));
  };

  const resetFilters = () => {
    setLocalFilters(initialFilters);
  };

  // Filter logic for book issues based on filters
  const filteredBookIssues = bookIssues?.filter((issue) => {
    if (
      localFilters.classLevel &&
      issue.classId?._id !== localFilters.classLevel
    )
      return false;
    if (localFilters.section && issue.sectionId?._id !== localFilters.section)
      return false;
    if (localFilters.book && issue.bookId?._id !== localFilters.book)
      return false;
    if (
      localFilters.status &&
      issue.status?.toLowerCase() !== localFilters.status.toLowerCase()
    )
      return false;
    if (
      localFilters.roleType &&
      issue.issuedTo?.userType?.toLowerCase() !==
      localFilters.roleType.toLowerCase()
    )
      return false;
    if (localFilters.searchQuery) {
      const fullName = `${issue.issuedTo?.userId?.firstName || ""} ${issue.issuedTo?.userId?.lastName || ""
        }`.trim();
      if (
        !fullName.toLowerCase().includes(localFilters.searchQuery.toLowerCase())
      )
        return false;
    }
    return true;
  });

  return (
    <>
      {/* Filter Header */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search Input at the Start */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {t("Search")}
          </label>
          <Search
            size="middle"
            // style={{ width: "150px" }}
            placeholder={t("Search by student name")}
            onSearch={handleSearch}
            allowClear
          />
        </div>

        {/* Middle Filters */}
        <div className="flex gap-4  items-end flex-wrap">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Class")}
            </label>
            <Select
              size="middle"
              placeholder={t("Select Class")}
              value={
                localFilters.classLevel === ""
                  ? undefined
                  : localFilters.classLevel
              }
              onChange={(value) => handleFilterChange("classLevel", value)}
              style={{ width: 120 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {classList?.map((cls) => (
                <Option key={cls._id} value={cls._id}>
                  {cls.className}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Section")}
            </label>
            <Select
              size="middle"
              placeholder={t("Select Section")}
              value={
                localFilters.section === "" ? undefined : localFilters.section
              }
              onChange={(value) => handleFilterChange("section", value)}
              style={{ width: 120 }}
              allowClear
              disabled={!localFilters.classLevel}
              showSearch
              optionFilterProp="children"
            >
              {sectionList?.map((section) => (
                <Option key={section._id} value={section._id}>
                  {section.sectionName}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Book")}
            </label>
            <Select
              size="middle"
              placeholder={t("Select Book")}
              value={localFilters.book === "" ? undefined : localFilters.book}
              onChange={(value) => handleFilterChange("book", value)}
              style={{ width: 150 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {books?.map((book) => (
                <Option key={book._id} value={book._id}>
                  {book.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Status")}
            </label>
            <Select
              size="middle"
              placeholder={t("Select Status")}
              value={
                localFilters.status === "" ? undefined : localFilters.status
              }
              onChange={(value) => handleFilterChange("status", value)}
              style={{ width: 100 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              <Option value="Pending">{t("Pending")}</Option>
              <Option value="Returned">{t("Returned")}</Option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Role")}
            </label>
            <Select
              size="middle"
              placeholder={t("Select Role")}
              value={
                localFilters.roleType === "" ? undefined : localFilters.roleType
              }
              onChange={(value) => handleFilterChange("roleType", value)}
              style={{ width: 100 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {roleOptions.map((r) => (
                <Option key={r.value} value={r.value}>
                  {r.label}
                </Option>
              ))}
            </Select>
          </div>
          {/* Reset Filters Button */}
          <div>
            <Tooltip title={t("Reset Filters")}>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center border border-gray-300 rounded-full p-2 hover:animate-spin"
              >
                <FiRefreshCcw size={20} />
              </button>
            </Tooltip>
          </div>
        </div>
        {/* Add Book Issue Button on the Right */}
        <ProtectedAction requiredPermission={PERMISSIONS.ADD_ISSUE_BOOK}>
          <div className="ml-auto">
            <button
              onClick={handleSidebarOpen}
              className="flex items-center border border-gray-300 ps-5 py-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <span className="mr-2 text-sm">{t("Add Book Issue")}</span>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-3xl -mt-2">+</span>
              </div>
            </button>
          </div>
        </ProtectedAction>
      </div>

      {/* Table or Skeleton Shimmer */}
      {libraryLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-gray-700 bg-gray-200">
                <th className="px-6 py-3 font-semibold">{t("User Name")}</th>
                <th className="px-6 py-3 font-semibold">{t("User Type")}</th>
                {/* <th className="px-6 py-3 font-semibold">
                  {t("Class & Section")}
                </th> */}
                <th className="px-6 py-3 font-semibold">{t("Book")}</th>
                <th className="px-6 py-3 font-semibold">{t("Author")}</th>
                <th className="px-6 py-3 font-semibold">{t("Issue Date")}</th>
                <th className="px-6 py-3 font-semibold">{t("Status")}</th>
                {role !== "teacher" && (
                  <ProtectedAction
                    requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}
                  >
                    <th className="px-6 py-3 font-semibold">{t("Action")}</th>
                  </ProtectedAction>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBookIssues?.length ? (
                filteredBookIssues.map((issue) => (
                  <BookIssueRow
                    key={issue._id}
                    item={issue}
                    setEditIssueData={setEditIssueData}
                    handleSidebarOpen={handleSidebarOpen}
                    role={role}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={role !== "teacher" ? 8 : 7} className="h-80">
                    <NoDataFound
                      title={t("Book Issues")}
                      desc={t(
                        "No book issues available. Try adding or adjusting filters."
                      )}
                      icon={FaBook}
                      iconColor="text-blue-500"
                      textColor="text-gray-600"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {filteredBookIssues.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRecords={totalBooks}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          t={t}
        />
      )}
    </>
  );
};

export default BookIssueTab;
