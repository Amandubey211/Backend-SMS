import React, { useState, lazy, Suspense } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast"; // Ensure proper import
import { RiDeleteBin5Line } from "react-icons/ri";
import useDeleteSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useDeleteSection";
import { PiSpinner } from "react-icons/pi";

const AddGroup = lazy(() => import("./AddGroup"));
const AddSection = lazy(() => import("./AddSection"));

const NavigationBar = ({ onSectionChange, selectedSection }) => {
  const [sidebarType, setSidebarType] = useState(null);
  const [clickedSection, setClickedSection] = useState(null);

  const Sections = useSelector((store) => store.Class.sectionsList);

  const { deleteSection, loading } = useDeleteSection(); // Using the custom hook

  const openAddGroupSidebar = () => setSidebarType("addGroup");
  const openAddSectionSidebar = () => setSidebarType("addSection");
  const closeSidebar = () => setSidebarType(null);

  const handleDeleteClick = async (id) => {
    await deleteSection(id);
  };

  const handleSectionChange = (section) => {
    onSectionChange(section);
    setClickedSection(section);
  };

  const getButtonClass = (section) => {
    return selectedSection === section
      ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
      : "relative px-4 py-2 rounded-full border border-gray-300";
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex space-x-2 px-5">
          <button
            className={getButtonClass("Everyone")}
            onClick={() => handleSectionChange("Everyone")}
          >
            Everyone
          </button>
          {Sections?.map((item) => (
            <button
            disabled={loading}
              key={item.sectionName}
              className={getButtonClass(item.sectionName)}
              onClick={() => handleSectionChange(item.sectionName)}
            >
              {item.sectionName}
              {clickedSection === item.sectionName && (
                <span className="absolute top-0 right-0 p-1 rounded-full bg-white text-2xl -m-1 text-red-600 cursor-pointer">
                  {loading ? (
                    <PiSpinner className="animate-spin" />
                  ) : (
                    <RiDeleteBin5Line
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent button click event
                        handleDeleteClick(item._id);
                      }}
                    />
                  )}
                </span>
              )}
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
        isOpen={sidebarType === "addSection"}
        onClose={closeSidebar}
        title="Add Section"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AddSection />
        </Suspense>
      </Sidebar>

      <Sidebar
        isOpen={sidebarType === "addGroup"}
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
