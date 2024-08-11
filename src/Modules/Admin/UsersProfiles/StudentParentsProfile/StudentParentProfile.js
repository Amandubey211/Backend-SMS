import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import ChildProfile from "./ChildProfile";
import Sidebar from "../../../../Components/Common/Sidebar";
import useGetAllParents from "../../../../Hooks/AuthHooks/Staff/Admin/parent/useGetAllParents";
import { useSelector } from "react-redux";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";

const uniqueFilterOptions = (data, key) => {
  return [
    ...new Set(
      data.flatMap((item) => item.children.map((child) => child[key]))
    ),
  ].sort();
};

const StudentParentProfile = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const [filters, setFilters] = useState({
    class: "",
    section: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleStudentClick = (child) => {
    console.log(child);
    setSelectedChild(child);
    setSidebarOpen(true);
  };
  const { fetchAllParents } = useGetAllParents();
  const allParents = useSelector((store) => store.Parents.allParents);
  useEffect(() => {
    async function fetchData() {
      await fetchAllParents();
    }
    fetchData();
  }, []);
  const filteredParents = allParents.filter((parent) =>
    parent.children.some(
      (child) =>
        (filters.class === "" || child.class === filters.class) &&
        (filters.section === "" || child.section === filters.section)
    )
  );

  return (
    <>
      <Layout title="Parents">
        <DashLayout>
          <div className="min-h-screen p-4 ">
            <h2 className="text-xl font-semibold mb-4">
              All Parents{" "}
              <span className="bg-purple-400 px-2 text-sm py-1 rounded-full">
                {allParents?.length}
              </span>
            </h2>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-5 space-x-4">
                <FormField
                  id="class"
                  label="Class"
                  value={filters.class}
                  onChange={handleFilterChange}
                  options={uniqueFilterOptions(allParents, "class")}
                />
                <FormField
                  id="section"
                  label="Section"
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
                      Parents Father
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Parents Mother
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Phone
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Childs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent, index) => (
                    <tr key={index} className="text-left text-gray-700">
                      <td className="px-5 py-5 border-b border-gray-200 align-middle">
                        <div className="flex items-center">
                          <img
                            src={parent.fatherImageUrl || profileIcon}
                            alt="Profile"
                            className="h-8 w-8 rounded-full mr-2 border"
                          />
                          <span>{parent.fatherName}</span>
                        </div>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 align-middle">
                        <div className="flex items-center">
                          <img
                            src={parent.motherImageUrl || profileIcon}
                            alt="Profile"
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span>{parent.motherName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 align-middle">
                        {parent.phone}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 align-middle">
                        {parent.email}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 align-middle">
                        <div
                          className="flex items-center py-1 cursor-pointer"
                          onClick={() => handleStudentClick(parent.children)}
                        >
                          <div className="flex bg-pink-100 p-2 border rounded-full">
                            {parent.children.map((child, idx) => (
                              <img
                                key={idx}
                                src={child.imageUrl || profileIcon}
                                alt={child.name}
                                className="h-8 w-8 rounded-full"
                                title={child.name}
                              />
                            ))}
                            <span className="ml-2 font-normal">
                              {parent.children.length} Child
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              title={`Children ${selectedChild?.length}`}
            >
              <ChildProfile children={selectedChild} />
            </Sidebar>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default StudentParentProfile;
