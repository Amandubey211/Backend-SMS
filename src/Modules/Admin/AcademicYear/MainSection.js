import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditAcademicYearModal from "./Components/EditAcademicYearModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import AcademicYearTable from "./Components/AcademicYearTable";
import CreateAcademicYearForm from "./Components/CreateAcademicYearForm";
import { setSeletedAcademicYear } from "../../../Store/Slices/Common/AcademicYear/academicYear.slice";
import {
  addAcademicYear,
  deleteAcademicYear,
  fetchAcademicYear,
} from "../../../Store/Slices/Common/AcademicYear/academicYear.action";
import { setLocalCookies } from "../../../Utils/academivYear";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newYear, setNewYear] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [editingYear, setEditingYear] = useState(null);
  const [deletingYear, setDeletingYear] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { academicYears, loading } = useSelector(
    (store) => store.common.academicYear
  );
  const isSingle = academicYears?.length === 1;

  const handleCheckboxChange = async (selectedYear) => {
    setLocalCookies("say", selectedYear._id);
    dispatch(setSeletedAcademicYear(selectedYear));
    navigate("/dashboard");
  };

  const handleCreate = async () => {
    // If there are no academic years, force the new year to be active.
    if (academicYears.length === 0) {
      setNewYear((prev) => ({ ...prev, isActive: true }));
    }
    dispatch(addAcademicYear(newYear));
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setShowEditModal(true);
  };

  const handleDelete = (year) => {
    if (isSingle) {
      toast.error("At least one Academic Year must remain.");
      return;
    }
    setDeletingYear(year);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (isSingle) {
      toast.error("At least one Academic Year must remain.");
      return;
    }
    dispatch(deleteAcademicYear(deletingYear._id));
  };

  useEffect(() => {
    dispatch(fetchAcademicYear());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex w-full">
      <div className="w-2/3 p-2">
        <AcademicYearTable
          academicYears={academicYears}
          handleCheckboxChange={handleCheckboxChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      <div className="w-1/3 p-2">
        <CreateAcademicYearForm
          newYear={newYear}
          setNewYear={setNewYear}
          handleCreate={handleCreate}
          loading={loading}
        />
      </div>

      {showEditModal && editingYear && (
        <EditAcademicYearModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          year={editingYear}
          academicYears={academicYears} // Pass for single-check inside modal
        />
      )}

      {showDeleteModal && deletingYear && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title={deletingYear?.year}
        />
      )}
    </div>
  );
};

export default MainSection;
