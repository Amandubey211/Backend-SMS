import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import ChildProfile from "./ChildProfile";
import Sidebar from "../../../../Components/Common/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import { GoAlertFill } from "react-icons/go";
import Spinner from "../../../../Components/Common/Spinner";
import { MdEdit } from "react-icons/md";
import UpdateParent from "./UpdateParent";
import { fetchAllParent } from "../../../../Store/Slices/Admin/Users/Parents/parent.action";
import { fetchAllStudents } from "../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

const uniqueFilterOptions = (data, key) => {
  return [
    ...new Set(
      data?.flatMap((item) => item.children?.map((child) => child[key]))
    ),
  ].sort();
};

const StudentParentProfile = () => {
  const { t } = useTranslation("admAccounts");

  const { allParents, loading } = useSelector(
    (store) => store.admin.all_parents
  );
  const { role } = useSelector((state) => ({
    role: state.common.auth.role,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllParent());
    dispatch(fetchAllStudents());
  }, [dispatch]);

  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedParentData, setSelectedParentData] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isUpdateSidebarOpen, setIsUpdateSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    class: "",
    section: "",
  });

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleUpdateSidebarClose = () => setIsUpdateSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentClick = (child) => {
    setSelectedChild(child);
    setSidebarOpen(true);
  };

  const filteredParents = allParents?.filter((parent) =>
    parent?.children?.some(
      (child) =>
        (filters.class === "" || child.class === filters.class) &&
        (filters.section === "" || child.section === filters.section)
    )
  );

  useNavHeading("User", "Parents");
  return (
    <>
      <Layout title={t("Parents")}>
        <DashLayout>
          {loading ? (
            <div className="flex w-full h-[90vh] flex-col items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <ProtectedSection requiredPermission={"viewParent"}>
            <div className="min-h-screen p-4">
              <h2 className="text-xl font-semibold mb-4">
                {t("All Parents")}{" "}
                <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                  {allParents?.length}
                </span>
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-5 space-x-4">
                  <FormField
                    id="class"
                    label={t("Class")}
                    value={filters.class}
                    onChange={handleFilterChange}
                    options={uniqueFilterOptions(allParents, "class")}
                  />
                  <FormField
                    id="section"
                    label={t("Section")}
                    value={filters.section}
                    onChange={handleFilterChange}
                    options={uniqueFilterOptions(allParents, "section")}
                  />
                </div>
              </div>
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="text-left text-gray-700 bg-gray-100">
                      <th className="px-5 py-3 border-b-2 border-gray-200">
                        {t("Parents Father")}
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">
                        {t("Parents Mother")}
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">
                        {t("Phone")}
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">
                        {t("Email")}
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">
                        {t("Children")}
                      </th>
                      {role === "admin" && (
                        <th className="px-5 py-3 border-b-2 border-gray-200">
                          {t("Action")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents?.length > 0 ? (
                      filteredParents?.map((parent, index) => (
                        <tr key={index} className="text-left text-gray-700">
                          <td className="px-5 py-5 border-b border-gray-200 align-middle">
                            <div className="flex items-center">
                              <img
                                src={parent?.fatherImageUrl || profileIcon}
                                alt={t("Profile")}
                                className="h-8 w-8 rounded-full mr-2 border"
                              />
                              <span>{parent?.fatherName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 align-middle">
                            <div className="flex items-center">
                              <img
                                src={parent?.motherImageUrl || profileIcon}
                                alt={t("Profile")}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              <span>{parent?.motherName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 align-middle">
                            {parent?.phone}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 align-middle">
                            {parent?.email}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 align-middle">
                            <div
                              className="flex items-center py-1 cursor-pointer"
                              onClick={() =>
                                handleStudentClick(parent?.children)
                              }
                            >
                              <div className="flex bg-pink-100 p-2 border rounded-full w-[10rem] items-center overflow-hidden">
                                <div className="flex -space-x-2">
                                  {parent?.children
                                    ?.slice(0, 1)
                                    ?.map((child, idx) => (
                                      <img
                                        key={idx}
                                        src={child?.imageUrl || profileIcon}
                                        alt={child?.name}
                                        className="h-8 w-8 rounded-full border-2 border-white"
                                        title={child?.name}
                                      />
                                    ))}
                                  {parent?.children?.length > 1 && (
                                    <div
                                      className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white text-sm"
                                      title={t("More Children", {
                                        count: parent?.children?.length - 1,
                                      })}
                                    >
                                      +{parent?.children?.length - 1}
                                    </div>
                                  )}
                                </div>
                                <span className="ml-2 font-normal">
                                  {parent?.children?.length}{" "}
                                  {parent?.children?.length > 1
                                    ? t("Children")
                                    : t("Child")}
                                </span>
                              </div>
                            </div>
                          </td>
                          {role === "admin" && (
                            <td className="px-5 py-5 border-b border-gray-200 align-middle">
                              <div
                                className="flex items-center py-1 cursor-pointer"
                                onClick={() => {
                                  setSelectedParentData(parent);
                                  setIsUpdateSidebarOpen(true);
                                }}
                              >
                                <button className="flex items-center gap-1 p-2 hover:bg-gray-200 w-auto text-left rounded-lg">
                                  <MdEdit className="text-gray-500" />
                                  <span>{t("Edit")}</span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center text-2xl py-10 text-gray-400"
                          colSpan={6}
                        >
                          <div className="flex w-[80vw] text-gray-500 h-[90vh] items-center justify-center flex-col text-2xl">
                            <NoDataFound />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
                title={t("Children Count", { count: selectedChild?.length })}
              >
                <ChildProfile children={selectedChild} />
              </Sidebar>
              <Sidebar
                isOpen={isUpdateSidebarOpen}
                onClose={handleUpdateSidebarClose}
                title={t("Edit Parent")}
              >
                <UpdateParent
                  data={selectedParentData}
                  handleUpdateSidebarClose={handleUpdateSidebarClose}
                />
              </Sidebar>
            </div>
            </ProtectedSection>
          )}
        </DashLayout>
      </Layout>
    </>
  );
};

export default StudentParentProfile;
