import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import ChildProfile from "./ChildProfile";
import Sidebar from "../../../../Components/Common/Sidebar";
import useGetAllParents from "../../../../Hooks/AuthHooks/Staff/Admin/parent/useGetAllParents";
import { useSelector } from "react-redux";

// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
const uniqueFilterOptions = (data, key) => {
  return [
    ...new Set(
      data.flatMap((item) => item.children.map((child) => child[key]))
    ),
  ].sort();
};

const StudentParentProfile = () => {

    const [selectedChild,setSelectedChild]=useState(null)
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
const handleStudentClick=(child)=>{
    console.log(child);
    setSelectedChild(child)
    setSidebarOpen(true);
}
const {fetchAllParents} = useGetAllParents();
const allParents = useSelector((store)=>store.Parents.allParents)
useEffect(() => {
async function fetchData() {
  await fetchAllParents();
}
fetchData();
}, [])
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
          <div className="min-h-screen p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex  gap-5 space-x-4  ">
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
                      Children
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent, index) => (
                    <tr
                      key={index}
                      className="text-left text-gray-700 bg-gray-100  "
                    >
                      <td className="px-5 py-4 border-b border-gray-200 flex items-center">
                        <img
                          src={parent.fatherImageUrl}
                          alt="Profile"
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <span>{parent.fatherName}</span>
                      </td>

                      <td className="px-5 py-2 border-b border-gray-200">
                        <div className="flex items-center">
                          {" "}
                          <img
                            src={parent.motherImageUrl}
                            alt="Profile"
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span> {parent.motherName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {parent.phone}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {parent.email}
                      </td>
                      {/* <td className="px-5 py-2 border-b border-gray-200">
                        {" "}
                        {parent.children.length}
                        
                     
                      </td> */}

                      <td className=" px-5 py-2 border-b border-gray-200 ">
                        <div className="flex items-center     py-1">
                         <div onClick={()=>handleStudentClick(parent.children)}
                          className="flex bg-pink-100 p-2  border-l border-t border-b  border-r   items-center  rounded-full">

                            {parent.children.map((child, idx) => (
                            <img
                              key={idx}
                              src={child.imageUrl} 
                              alt={child.name}
                              className="h-8 w-8  rounded-full"
                              title={child.name} 
                            />
                          ))}
                        
                          
                          <span  className="ml-2  font-normal ">{parent.children.length} Child </span>{" "} 
                          
                          </div>
                          {/* Display the count next to the images */}

                          
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
            title="Add New Book"
          >
            <ChildProfile  children={selectedChild} />
          </Sidebar>
          </div>
        </DashLayout>
      </Layout>
    </>
  );
};

export default StudentParentProfile;