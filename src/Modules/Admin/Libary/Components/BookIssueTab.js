import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import BookIssueRow from "../Components/BookIssueRow";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Select, Skeleton, Input, Tooltip, DatePicker, message } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import Pagination from "../../../../Components/Common/pagination";
import moment from "moment";

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
  issueDate: null, // moment | null
  returnDate: null, // moment | null
};

const BookIssueTab = ({
  handleSidebarOpen,
  setEditIssueData,
  page,
  setPage,
  limit,
  setLimit,
}) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const {
    bookIssues,
    books,
    loading: libraryLoading,
  } = useSelector((state) => state.admin.library);
  const classList = useSelector((store) => store.admin.class.classes);
  const { totalPages, totalBooks } = useSelector(
    (state) => state.admin.library
  );
  const sectionList = useSelector(
    (store) => store.admin.group_section.sectionsList
  );
  const role = useSelector((store) => store.common.auth.role);

  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    if (localFilters.classLevel) {
      dispatch(fetchSectionsNamesByClass(localFilters.classLevel));
    }
  }, [dispatch, localFilters.classLevel]);

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

  // ---------- Filtering ----------
  const filteredBookIssues = useMemo(() => {
    try {
      return bookIssues?.filter((issue) => {
        // class / section / book / status / roleType -----------------------------------------
        if (
          localFilters.classLevel &&
          issue.classId?._id !== localFilters.classLevel
        )
          return false;
        if (
          localFilters.section &&
          issue.sectionId?._id !== localFilters.section
        )
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

        // search query -----------------------------------------------------------------------
        if (localFilters.searchQuery) {
          const fullName = `${issue.issuedTo?.userId?.firstName || ""} ${
            issue.issuedTo?.userId?.lastName || ""
          }`.trim();
          if (
            !fullName
              .toLowerCase()
              .includes(localFilters.searchQuery.toLowerCase())
          )
            return false;
        }

        // issue date -------------------------------------------------------------------------
        if (localFilters.issueDate) {
          const filterDate = localFilters.issueDate;
          const issueMoment = issue.issueDate ? moment(issue.issueDate) : null;
          if (!issueMoment || !issueMoment.isSame(filterDate, "day"))
            return false;
        }

        // return date ------------------------------------------------------------------------
        if (localFilters.returnDate) {
          const filterDate = localFilters.returnDate;
          const returnMoment = issue.returnDate
            ? moment(issue.returnDate)
            : null;
          if (!returnMoment || !returnMoment.isSame(filterDate, "day"))
            return false;
        }

        return true;
      });
    } catch (err) {
      console.error("Filter error:", err);
      message.error(t("An error occurred while filtering data."));
      return [];
    }
  }, [bookIssues, localFilters, t]);

  return (
    <>
      {/* ------------------ Filter Header ------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white  rounded-lg">
        {/* Search Input */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {t("Search")}
          </label>
          <Search
            size="middle"
            placeholder={t("Search by student name")}
            onSearch={handleSearch}
            allowClear
            style={{ width: 200 }}
          />
        </div>

        {/* Middle Filters */}
        <div className="flex flex-wrap gap-4 items-end flex-grow justify-center">
          {/* ---------- Book ---------- */}
          <div className="flex-shrink-0">
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

          {/* ---------- Status ---------- */}
          <div className="flex-shrink-0">
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
              style={{ width: 120 }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              <Option value="Pending">{t("Pending")}</Option>
              <Option value="Returned">{t("Returned")}</Option>
            </Select>
          </div>

          {/* ---------- Role ---------- */}
          <div className="flex-shrink-0">
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
              style={{ width: 120 }}
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

          {/* ---------- Issue Date ---------- */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Issue Date")}
            </label>
            <DatePicker
              size="middle"
              value={localFilters.issueDate}
              onChange={(date) => handleFilterChange("issueDate", date)}
              allowClear
              style={{ width: 150 }}
              format="DD-MM-YYYY"
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </div>

          {/* ---------- Return Date ---------- */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("Return Date")}
            </label>
            <DatePicker
              size="middle"
              value={localFilters.returnDate}
              onChange={(date) => handleFilterChange("returnDate", date)}
              allowClear
              style={{ width: 150 }}
              format="DD-MM-YYYY"
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </div>

          {/* ---------- Reset Button ---------- */}
          <div className="flex-shrink-0">
            <Tooltip title={t("Reset Filters")}>
              <button
                onClick={resetFilters}
                className="flex items-center justify-center border border-gray-300 rounded-full p-2 hover:bg-gray-100 hover:animate-spin"
              >
                <FiRefreshCcw size={20} />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Add Book Issue Button */}
        <ProtectedAction requiredPermission={PERMISSIONS.ADD_ISSUE_BOOK}>
          <div className="flex-shrink-0">
            <button
              onClick={handleSidebarOpen}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <span className="text-xl">+</span>
              <span>{t("Add Book Issue")}</span>
            </button>
          </div>
        </ProtectedAction>
      </div>

      {/* ------------------ Table / Skeleton ------------------ */}
      {libraryLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-gray-700 bg-gray-200">
                <th className="px-6 py-3 font-semibold">{t("User Name")}</th>
                <th className="px-6 py-3 font-semibold">{t("User Type")}</th>
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

      {/* ------------------ Pagination ------------------ */}
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
