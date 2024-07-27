import React, { useEffect, useState } from "react";
import { dummyParents } from "./dummyData/dummyData";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import ChildProfile from "./ChildProfile";
import Sidebar from "../../../../Components/Common/Sidebar";
import { useSelector } from "react-redux";
import useGetAllParents from "../../../../Hooks/AuthHooks/Staff/Admin/parent/useGetAllParents";
import useFetchSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
const uniqueFilterOptions = (data, key) => {
  return [
    ...new Set(
      data?.flatMap((item) => item.children.map((child) => child[key]))
    ),
  ].sort();
};

const StudentParentProfile = () => {
    const {allParents} = useSelector((store)=>store.Parents);
    const {classList, sectionsList} = useSelector((store)=>store.Class);
      const {fetchAllParents} = useGetAllParents();
      const { fetchSection } = useFetchSection();
    useEffect(() => {
      async function fetchData() {
        await fetchAllParents();
     
        console.log(allParents)
      }
      fetchData();
    }, [])
    
     const [selectedChild,setSelectedChild]=useState(null)
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarOpen = () => setSidebarOpen(true);
    const handleSidebarClose = () => setSidebarOpen(false);

  const [filters, setFilters] = useState({
    class: "",
    section: "",
  });

  const handleFilterChange = async(e) => {
    const { name, value} = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
 const selectClass = classList.forEach(element => {
   return element.className == name
  });
  console.log(selectClass);
  };
const handleStudentClick=(child)=>{
    console.log(child);
    setSelectedChild(child)
    setSidebarOpen(true);
}
  const filteredParents = dummyParents.filter((parent) =>
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
                  value={filters.className}
                  onChange={(e)=>handleFilterChange(e)}
                  options={classList}
                />
                <FormField
                  id="section"
                  label="Section"
                  value={filters.section}
                  onChange={handleFilterChange}
                  options={uniqueFilterOptions(dummyParents, "section")}
                />
              </div>
            </div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Father
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Mother
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
                  {allParents?.map((parent, index) => (
                    <tr
                      key={index}
                      className="text-left text-gray-700 bg-gray-100  "
                    >
                      <td className="px-5 py-4 border-b border-gray-200 flex items-center">
                        <img
                          src={parent.profile}
                          alt="Profile"
                          className="h-8 w-8 rounded-full mr-2 bg-gray-300 "
                        />
                        <span>{parent.fatherName?parent.fatherName:parent.guardianName
                        }</span>
                      </td>

                      <td className="px-5 py-2 border-b border-gray-200">
                        <div className="flex items-center">
                          {" "}
                          <img
                            src={parent?.motherImageUrl}
                            alt="Profile"
                            className="h-8 w-8 rounded-full mr-2 bg-gray-300"
                          />
                          <span> {parent.motherName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {parent.guardianContactNumber}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {parent.guardianEmail}
                      </td>
                      {/* <td className="px-5 py-2 border-b border-gray-200">
                        {" "}
                        {parent.children.length}
                        
                     
                      </td> */}

                      <td className=" px-5 py-2 border-b border-gray-200 ">
                        <div className="flex items-center     py-1">
                          <div onClick={()=>handleStudentClick(parent.childs)}
                          className="flex bg-pink-100 p-2  border-l border-t border-b  border-r   items-center  rounded-full">

                            {parent.childs?.map((child, idx) => (
                            <img
                              key={idx}
                              src={child.profile} 
                              alt={child.firstName}
                              className="h-8 w-8  rounded-full"
                              title={child.firstName} 
                            />
                          ))}
                        
                          
                          <span  className="ml-2  font-normal ">{parent.childs.length} Child </span>{" "} 
                          
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
