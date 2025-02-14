import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { fetchAllClassesDetails } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const ClassesMainSection = () => {
  const { t } = useTranslation("admClass");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const dispatch = useDispatch();
  const { classes, loading } = useSelector((store) => store.admin.class);
  const { role } = useSelector((store) => store.common.auth);

  const handleAddNewClass = () => {
    setEditingClass(null);
    setSidebarOpen(true);
  };

  const handleEditClass = (classData) => {
    setEditingClass(classData);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    setEditingClass(null);
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
        {role === "teacher" && (
          <h1 className="text-2xl font-semibold mb-4">{t("Classes")}</h1>
        )}

        {role === "admin" && (
          <div className="flex justify-end items-center">
            <ProtectedAction requiredPermission={PERMISSIONS.ADD_CLASSES}>
              <button
                onClick={handleAddNewClass}
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
                onEdit={() => handleEditClass(cls)}
              />
            ))}
          </div>
        )}

        {role === "admin" && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={editingClass ? t("Update Class") : t("Add New Class")}
          >
            <AddNewClass
              onClose={handleSidebarClose}
              classData={editingClass}
              isUpdate={!!editingClass}
            />
          </Sidebar>
        )}
      </div>
    </ProtectedSection>
  );
};

export default ClassesMainSection;
