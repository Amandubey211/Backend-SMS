import React, { useState, lazy, Suspense } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import { useSelector } from "react-redux";

const AddGroup = lazy(() => import("./AddGroup"));
const AddSection = lazy(() => import("./AddSection"));

const NavigationBar = ({ onSectionChange, selectedSection }) => {
  const [sidebarType, setSidebarType] = useState(null);
  const Sections = useSelector((store) => store.Class.sectionsList);

  const openAddGroupSidebar = () => setSidebarType('addGroup');
  const openAddSectionSidebar = () => setSidebarType('addSection');
  const closeSidebar = () => setSidebarType(null);

  const getButtonClass = (section) => {
    return selectedSection === section
      ? "px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
      : "px-4 py-2 rounded-full border border-gray-300";
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-2 px-5">
          <button
            className={getButtonClass("Everyone")}
            onClick={() => onSectionChange("Everyone")}
          >
            Everyone
          </button>

          {Sections?.map((item) => (
            <button
              key={item.sectionName}
              className={getButtonClass(item.sectionName)}
              onClick={() => onSectionChange(item.sectionName)}
            >
              {item.sectionName}
            </button>
          ))}
          <button 
            onClick={openAddSectionSidebar}
            className="flex items-center px-4 py-2 border-2 border-dashed border-pink-600 text-gradient rounded-full"
          >
            <span className="mr-2">+</span> Add Section
          </button>
        </div>
        <button
          onClick={openAddGroupSidebar}
          className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
        >
          <span className="mr-2">Group</span>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-3xl -mt-2">+</span>
          </div>
        </button>
      </div>

      <Sidebar
        isOpen={sidebarType === 'addSection'}
        onClose={closeSidebar}
        title="Add Section"
      >
        <Suspense fallback={<div>Loading...</div>}>
         <AddSection/>
        </Suspense>
      </Sidebar>

      <Sidebar
        isOpen={sidebarType === 'addGroup'}
        onClose={closeSidebar}
        title="Add New Group"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AddGroup />
        </Suspense>
      </Sidebar>
    </>
  );
};

export default NavigationBar;
