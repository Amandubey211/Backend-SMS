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
import Cookies from "js-cookie";
import { setLocalCookies } from "../../../Utils/academivYear";
import { useNavigate } from "react-router-dom";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const MainSection = () => {
  const dispatch = useDispatch();
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
  const role = useSelector((store) => store.common.auth.role);
  const navigate = useNavigate();
  const handleCheckboxChange = async (selectedYear) => {
    setLocalCookies("say", selectedYear._id);
    dispatch(setSeletedAcademicYear(selectedYear));
    navigate("/dashboard");
  };

  const handleCreate = async () => {
    dispatch(addAcademicYear(newYear));
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setShowEditModal(true);
  };

  const handleDelete = (year) => {
    setDeletingYear(year);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    dispatch(deleteAcademicYear(deletingYear._id));
  };
  const { academicYears, loading } = useSelector(
    (store) => store.common.academicYear
  );
  useEffect(() => {
    dispatch(fetchAcademicYear());
  }, [dispatch]);

  return (
    <div className=" min-h-screen flex w-full">
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

      {showEditModal && (
        <EditAcademicYearModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          year={editingYear}
          refreshData={fetchAcademicYear}
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
