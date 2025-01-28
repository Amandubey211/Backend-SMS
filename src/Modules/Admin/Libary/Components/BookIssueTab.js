import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSectionsByClass,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import FormField from "../Components/FormField";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import BookIssueRow from "../Components/BookIssueRow";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../config/permission";
import { FaBook } from "react-icons/fa"; // Importing relevant icon

const BookIssueTab = ({ handleSidebarOpen, setEditIssueData }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const { bookIssues, books } = useSelector((state) => state.admin.library);
  const classList = useSelector((store) => store.admin.class.classes);
  const role = useSelector((store) => store.common.auth.role);

  useEffect(() => {
    // Optionally fetch books or other data
    // dispatch(fetchBooksThunk());
  }, []);

  const sectionList = useSelector(
    (store) => store.admin.group_section.sectionsList
  );

  const [localFilters, setLocalFilters] = React.useState({
    classLevel: "",
    section: "",
    book: "",
    status: "",
  });

  const handleIssueFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "classLevel" && value) {
      dispatch(fetchSectionsNamesByClass(value));
    }
  };

  const filteredBookIssues = bookIssues?.filter((issue) => {
    const matchesClass =
      !localFilters.classLevel ||
      (issue.classId && issue.classId._id === localFilters.classLevel);
    const matchesSection =
      !localFilters.section ||
      (issue.sectionId && issue.sectionId._id === localFilters.section);
    const matchesBook =
      !localFilters.book ||
      (issue.bookId && issue.bookId._id === localFilters.book);
    const matchesStatus =
      !localFilters.status ||
      issue.status.toLowerCase() === localFilters.status.toLowerCase();

    return matchesClass && matchesSection && matchesBook && matchesStatus;
  });

  return (
    <>
      <div className="flex justify-between items-end mb-4 ">
        <div className="flex space-x-4">
          <FormField
            id="classLevel"
            name="classLevel"
            label={t("Class")}
            value={localFilters.classLevel}
            onChange={handleIssueFilterChange}
            options={classList?.map((cls) => ({
              value: cls._id,
              label: cls.className,
            }))}
          />
          <FormField
            id="section"
            name="section"
            label={t("Section")}
            value={localFilters.section}
            onChange={handleIssueFilterChange}
            options={sectionList?.map((section) => ({
              value: section._id,
              label: section.sectionName,
            }))}
            disabled={!localFilters.classLevel}
          />
          <FormField
            id="book"
            name="book"
            label={t("Book")}
            value={localFilters.book}
            onChange={handleIssueFilterChange}
            options={books?.map((book) => ({
              value: book._id,
              label: book.name,
            }))}
          />
          <FormField
            id="status"
            name="status"
            label={t("Status")}
            value={localFilters.status}
            onChange={handleIssueFilterChange}
            options={[
              { value: "Pending", label: t("Pending") },
              { value: "Returned", label: t("Returned") },
            ]}
          />
        </div>
        {role !== "teacher" && (
          <ProtectedAction requiredPermission={PERMISSIONS.ADD_ISSUE_BOOK}>
            <button
              onClick={handleSidebarOpen}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            >
              {t("Add Book Issue")}
            </button>
          </ProtectedAction>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-200">
              <th className="px-6 py-3">{t("Student")}</th>
              <th className="px-6 py-3">{t("Class & Section")}</th>
              <th className="px-6 py-3">{t("Book")}</th>
              <th className="px-6 py-3">{t("Author")}</th>
              <th className="px-6 py-3">{t("Issue Date")}</th>
              <th className="px-6 py-3">{t("Status")}</th>
              {role !== "teacher" && (
                <ProtectedAction
                  requiredPermission={PERMISSIONS.EDIT_ISSUE_BOOK}
                >
                  <th className="px-6 py-3">{t("Action")}</th>
                </ProtectedAction>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredBookIssues?.length > 0 ? (
              filteredBookIssues?.map((issue) => (
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
                <td colSpan="7" className="h-80">
                  <NoDataFound
                    title={t("Book Issues")}
                    desc={t(
                      "No book issues available. Try adding or adjusting filters."
                    )}
                    icon={FaBook} // Library-specific icon
                    iconColor="text-blue-500"
                    textColor="text-gray-600"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookIssueTab;
