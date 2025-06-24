import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import ShiftList from "../../../Components/Transportation/ShiftList";
import Sidebar from "../../../Components/Common/Sidebar";
import AddShift from "../../../Components/Transportation/AddShift";

const ShiftManagement = () => {
  const { t } = useTranslation("transportation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  const handleCreateNew = () => {
    setSelectedShift(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (shift) => {
    setSelectedShift(shift);
    setIsSidebarOpen(true);
  };

  const handleSave = (formData) => {
    // Here you would typically send the data to your API
    console.log("Saving Shift data:", formData);

    // Close the sidebar after saving
    setIsSidebarOpen(false);
  };

  // Set navigation heading
  useNavHeading(t("Transportation"), t("Shift Management"));
  return (
    <Layout title={t("Shift Management") + " | Student diwan"}>
      <DashLayout>
        <div className="p-5">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-4">Shift Management</h1>
            <div className="mb-4 flex gap-4">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-lg "
              >
                Add Shift
              </button>
            </div>
          </div>
          <ShiftList  onEdit={handleEdit}/>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() =>{ setIsSidebarOpen(false)}}
            title={selectedShift ? "Edit Shift" : "Add New Shift"}
            width="30%"
          >
            <AddShift
              onSave={handleSave}
              onClose={() => setIsSidebarOpen(false)}
              initialData={selectedShift}
              selectedShift={selectedShift}
            />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default ShiftManagement;
