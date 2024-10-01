import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import Sidebar from "../../../../Components/Common/Sidebar";
import {
  deleteSection,
  fetchSectionsByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import AddSection from "./AddSection";
import AddGroup from "./AddGroup";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const NavigationBar = ({ onSectionChange, selectedSection }) => {
  const [sidebarType, setSidebarType] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const dispatch = useDispatch();
  const { cid } = useParams();

  const sections = useSelector(
    (store) => store.admin.group_section.sectionsList
  );

  const openAddGroupSidebar = useCallback(() => setSidebarType("addGroup"), []);
  const openAddSectionSidebar = useCallback(() => {
    setSidebarType("addSection");
    setEditingSection(null);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarType(null);
    setEditingSection(null);
  }, [dispatch]);

  const handleDeleteConfirm = async () => {
    await dispatch(deleteSection(sectionToDelete._id));
    setDeleteModalOpen(false);
    dispatch(fetchSectionsByClass(cid)); // Fetch sections after deletion
  };

  const handleEditSection = useCallback((section) => {
    setEditingSection(section);
    setSidebarType("editSection");
  }, []);

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    setDeleteModalOpen(true);
  };

  const getButtonClass = (section) =>
    selectedSection === section
      ? "relative px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-purple-500 text-white"
      : "relative px-4 py-2 rounded-full border border-gray-300 hover:border-red-400 hover:bg-gray-100";

  return (
    <>
      <div className="flex justify-between items-center border-b p-4">
        <div className="flex space-x-2 px-5">
          <button
            className={getButtonClass("Everyone")}
            onClick={() => onSectionChange("Everyone", null)}
          >
            Everyone
          </button>
          {sections?.map((item) => (
            <button
              key={item._id}
              className={getButtonClass(item.sectionName)}
              onClick={() => onSectionChange(item.sectionName, item._id)}
              onMouseEnter={() => setHoveredSection(item.sectionName)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {item.sectionName}
              {hoveredSection === item.sectionName && (
                <span className="absolute top-0 right-0 p-1 flex space-x-2 rounded-full bg-white hover:bg-gray-200 text-lg border -m-1 text-red-600 cursor-pointer">
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
                      handleDeleteClick(item);
                    }}
                  />
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

      {/* Sidebars for adding/editing sections and groups */}
      <Sidebar
        isOpen={sidebarType === "addSection"}
        onClose={closeSidebar}
        title="Add Section"
      >
        <AddSection onCancel={closeSidebar} />
      </Sidebar>

      <Sidebar
        isOpen={sidebarType === "addGroup"}
        onClose={closeSidebar}
        title="New Group"
      >
        <AddGroup onClose={closeSidebar} />
      </Sidebar>

      <Sidebar
        isOpen={sidebarType === "editSection"}
        onClose={closeSidebar}
        title="Edit Section"
      >
        {editingSection && (
          <AddSection initialSection={editingSection} onCancel={closeSidebar} />
        )}
      </Sidebar>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={sectionToDelete?.sectionName || "Section"}
      />
    </>
  );
};

export default NavigationBar;
