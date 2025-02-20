import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassCard from "./ClassCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { fetchAllClassesDetails } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";
import { Skeleton } from "antd";

// Updated skeleton closely matching the ClassCard layout
const ClassCardSkeleton = () => {
  return (
    <div className="group p-1 pb-4 border rounded-lg shadow-lg relative overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      {/* Top Icons (matching ~40px width in real card) */}
      <div className="flex justify-between items-center px-1">
        <Skeleton.Avatar active size={40} shape="circle" />
        <Skeleton.Avatar active size={40} shape="circle" />
      </div>

      {/* Centered Title, Teacher Count, and Center Image */}
      <div className="flex flex-col gap-1 justify-center items-center -mt-4">
        {/* Class Name */}
        <Skeleton.Input
          active
          style={{ width: "60%", height: 24 }}
          className="mt-2 mb-1"
        />
        {/* Teachers Count */}
        <Skeleton.Input
          active
          style={{ width: "40%", height: 16 }}
          className="mb-2"
        />
        {/* Center Logo (w-20 => ~80px) */}
        <Skeleton.Image
          active
          style={{ width: 80, height: 80 }}
          className="mb-2"
        />
      </div>

      {/* Bottom Stats Row (Students / Section / Group) */}
      <div className="flex justify-around items-center px-3">
        {/* Students Column */}
        <div className="flex flex-col items-center gap-1">
          {/* Label skeleton (e.g., "Students") */}
          <Skeleton.Input active style={{ width: 55, height: 14 }} />
          {/* Value skeleton (e.g., "3") */}
          <Skeleton.Input active style={{ width: 20, height: 14 }} />
        </div>

        {/* Section Column (with border) */}
        <div className="flex flex-col items-center gap-1 border-x px-4 border-opacity-45 border-black">
          <Skeleton.Input active style={{ width: 55, height: 14 }} />
          <Skeleton.Input active style={{ width: 20, height: 14 }} />
        </div>

        {/* Group Column */}
        <div className="flex flex-col items-center gap-1">
          <Skeleton.Input active style={{ width: 55, height: 14 }} />
          <Skeleton.Input active style={{ width: 20, height: 14 }} />
        </div>
      </div>
    </div>
  );
};

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
          <div className="flex justify-end items-center mb-4">
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

        {/* Conditional Rendering: Skeleton, NoData, or Class Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ClassCardSkeleton key={idx} />
            ))}
          </div>
        ) : classes?.length === 0 ? (
          <NoDataFound title={t("Classes")} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map((cls) => (
              <ClassCard
                role={role}
                key={cls._id}
                classData={cls}
                onEdit={() => handleEditClass(cls)}
              />
            ))}
          </div>
        )}

        {/* Sidebar for Add/Update Class */}
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
