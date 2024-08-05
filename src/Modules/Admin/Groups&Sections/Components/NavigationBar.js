import React, { useState, lazy, Suspense } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import { useSelector } from "react-redux";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import useDeleteSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useDeleteSection";
import { PiSpinner } from "react-icons/pi";
import useDeleteModal from "../../../../Hooks/CommonHooks/useDeleteModal";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import AddSection from "./AddSection"; // Use the same AddSection component for both add and edit
import { useParams } from "react-router-dom";

const AddGroup = lazy(() => import("./AddGroup"));

const NavigationBar = ({ onSectionChange, selectedSection, fetchSections }) => {
  const [sidebarType, setSidebarType] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null); // Track editing section
  const { cid } = useParams();
  const Sections = useSelector((store) => store.Class.sectionsList);

  const { deleteSection, loading } = useDeleteSection();

  const { isModalOpen, modalData, openModal, closeModal } = useDeleteModal();

  const openAddGroupSidebar = () => setSidebarType("addGroup");
  const openAddSectionSidebar = () => setSidebarType("addSection");
  const closeSidebar = () => {
    setSidebarType(null);
    setEditingSection(null);
  };

  const handleDeleteConfirm = async () => {
    if (modalData) {
      await deleteSection(modalData._id);
      closeModal();
      fetchSections(cid);
    }
  };

  const handleSectionChange = (section, sectionId) => {
    onSectionChange(section, sectionId);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSidebarType("editSection");
  };

  const handleSectionSubmitSuccess = () => {
    fetchSections(cid); // Refresh sections list
    closeSidebar()
  };

  const getButtonClass = (section) => {
    return selectedSection === section
      ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
      : "relative px-4 py-2 rounded-full border border-gray-300 hover:border-red-400 hover:bg-gray-100";
  };

  return (
    <>
      <div className="flex justify-between items-center border-b p-4">
        <div className="flex space-x-2 px-5">
          <button
            className={getButtonClass("Everyone")}
            onClick={() => handleSectionChange("Everyone", null)}
          >
            Everyone
          </button>
          {Sections?.map((item) => (
            <button
              disabled={loading}
              key={item._id}
              className={getButtonClass(item.sectionName)}
              onClick={() => handleSectionChange(item.sectionName, item._id)}
              onMouseEnter={() => setHoveredSection(item.sectionName)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {item.sectionName}
              {hoveredSection === item.sectionName && (
                <span className="absolute top-0 right-0 p-1 flex space-x-2 rounded-full bg-white hover:bg-gray-200 text-lg border -m-1 text-red-600 cursor-pointer">
                  {loading ? (
                    <PiSpinner className="animate-spin" />
                  ) : (
                    <>
                      <RiEdit2Line
                        className="hover:text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSection(item);
                        }}
                      />
                      <RiDeleteBin5Line
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(item);
                        }}
                      />
                    </>
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
        <AddSection
          onSubmitSuccess={handleSectionSubmitSuccess}
          onCancel={closeSidebar}
        />
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

      <Sidebar
        isOpen={sidebarType === "editSection"}
        onClose={closeSidebar}
        title="Edit Section"
      >
        {editingSection && (
          <AddSection
            initialSection={editingSection}
            onSubmitSuccess={handleSectionSubmitSuccess}
            onCancel={closeSidebar}
          />
        )}
      </Sidebar>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        title={modalData?.sectionName || ""}
      />
    </>
  );
};

export default NavigationBar;
