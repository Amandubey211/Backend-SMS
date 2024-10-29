import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

const ClassesMainSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null); // For handling update

  const dispatch = useDispatch();
  const { classes, loading, error } = useSelector((store) => store.admin.class);
  const role = useSelector((store) => store.common.auth.role);

  // Handle the sidebar open for adding a new class (clear the form)
  const handleAddNewClass = () => {
    setEditingClass(null); // Clear form for new class
    setSidebarOpen(true);
  };

  // Handle sidebar open for editing (preload the form)
  const handleEditClass = (classData) => {
    setEditingClass(classData); // Preload form with class data
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditingClass(null); // Reset editingClass when closing the sidebar
  };

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-4">
      {/* Conditionally show heading for teachers */}
      {role === "teacher" && <h1 className="text-2xl font-semibold mb-4 "></h1>}

      {/* For Admin: Add new class button */}
      {role === "admin" && (
        <div className="flex justify-end">
          <button
            onClick={handleAddNewClass} // Open for adding new class
            className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200"
            aria-label="Add New Class"
          >
            <span className="text-gradient"> + Add New Class</span>
          </button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : classes.length === 0 ? (
        <NoDataFound title="Classes" />
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {classes?.map((cls) => (
            <ClassCard
              role={role}
              key={cls._id}
              classData={cls}
              onEdit={() => handleEditClass(cls)} // Pass class data for editing
            />
          ))}
        </div>
      )}

      {/* Sidebar for adding/editing classes for Admin */}
      {role === "admin" && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          title={editingClass ? "Update Class" : "Add New Class"}
        >
          <AddNewClass
            onClose={handleSidebarClose}
            classData={editingClass} // Preload data if editing
            isUpdate={!!editingClass} // Boolean flag for update mode
          />
        </Sidebar>
      )}
    </div>
  );
};

export default ClassesMainSection;
