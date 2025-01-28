import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import {
  fetchAllClasses,
  fetchAllClassesDetails,
} from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
// import { FaSchool } from "react-icons/fa";

const ClassesMainSection = () => {
  const { t } = useTranslation("admClass");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null); // For handling update

  const dispatch = useDispatch();
  const { classes, loading } = useSelector((store) => store.admin.class);
  const { role } = useSelector((store) => store.common.auth);
  const { schoolName } = useSelector((store) => store.common.user.userDetails);

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
    dispatch(fetchAllClassesDetails());
  }, [dispatch]);

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.ALL_CLASSES}
      title={"Classes"}
    >
      <div className="min-h-screen p-4">
        {/* Conditionally show heading for teachers */}
        {role === "teacher" && (
          <h1 className="text-2xl font-semibold mb-4">{t("Classes")}</h1>
        )}

        {/* For Admin: Add new class button */}
        {role === "admin" && (
          <div className="flex justify-end items-center">
            {/* <div className="flex items-center gap-4 p-1">
            <div className="bg-gradient-to-r from-purple-300 to-pink-300 p-3 rounded-full">
              <FaSchool className="text-white text-3xl" aria-hidden="true" />
            </div>
            <h1 className="text-gradient font-bold text-xl tracking-wide">
              {schoolName}
            </h1>
          </div> */}
            <ProtectedAction requiredPermission={PERMISSIONS.ALL_CLASSES}>
              <button
                onClick={handleAddNewClass} // Open for adding new class
                className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-200 flex items-center gap-2"
                aria-label={t("Add New Class")}
              >
                <span className="text-gradient"> + {t("Add New Class")}</span>
              </button>
            </ProtectedAction>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : classes?.length === 0 ? (
          <NoDataFound title={t("Classes")} />
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
            title={editingClass ? t("Update Class") : t("Add New Class")}
          >
            <AddNewClass
              onClose={handleSidebarClose}
              classData={editingClass} // Preload data if editing
              isUpdate={!!editingClass} // Boolean flag for update mode
            />
          </Sidebar>
        )}
      </div>
    </ProtectedSection>
  );
};

export default ClassesMainSection;
