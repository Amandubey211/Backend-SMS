import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { baseUrl } from "../../../config/Common";
import EditAcademicYearModal from "./Components/EditAcademicYearModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { setAcademicYear } from "../../../Redux/Slices/Auth/AuthSlice";
import AcademicYearTable from "./Components/AcademicYearTable";
import CreateAcademicYearForm from "./Components/CreateAcademicYearForm";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const MainSection = () => {
  const dispatch = useDispatch();
  const [academicYears, setAcademicYears] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const role = useSelector((store) => store.Auth.role);

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.get(`${baseUrl}/admin/getAllAcademicYear`, {
        headers: { Authentication: token },
      });
      if (data?.success) {
        const formattedYears = data.data.map((year) => ({
          _id: year._id,
          academicYear: year.year,
          startDate: formatDate(year.startDate),
          endDate: formatDate(year.endDate),
          isActive: year.isActive,
        }));
        setAcademicYears(formattedYears);
        dispatch(setAcademicYear(formattedYears));
      } else {
        toast.error(data.msg || "Failed to fetch academic years.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle the checkbox change to set only one academic year as active
  const handleCheckboxChange = async (selectedYear) => {
    // First, uncheck all other years
    const updatedYears = academicYears.map((year) => ({
      ...year,
      isActive: year._id === selectedYear._id, // Set only the selected year as active
    }));

    setAcademicYears(updatedYears);
    dispatch(setAcademicYear(updatedYears)); // Update the Redux store

    // Call the update API to set the selected year as active
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.put(
        `${baseUrl}/admin/updateAcademicYear/${selectedYear._id}`,
        { isActive: true },
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        toast.success(
          `Academic year ${selectedYear.academicYear} set as active.`
        );
      } else {
        toast.error(data.msg || "Failed to update academic year.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handle academic year creation
  const handleCreate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.post(
        `${baseUrl}/admin/createAcademicYear`,
        newYear,
        {
          headers: { Authentication: token },
        }
      );

      if (data?.success) {
        // Format the new year immediately after creation
        const formattedNewYear = {
          _id: data.data._id,
          academicYear: data.data.year,
          startDate: formatDate(data.data.startDate),
          endDate: formatDate(data.data.endDate),
          isActive: data.data.isActive,
        };

        // Update state with the newly created and formatted academic year
        setAcademicYears([...academicYears, formattedNewYear]);
        dispatch(setAcademicYear([...academicYears, formattedNewYear]));

        // Clear the form fields
        setNewYear({ year: "", startDate: "", endDate: "", isActive: false });

        toast.success("Academic year created successfully.");
      } else {
        toast.error(data.msg || "Failed to create academic year.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const { data } = await axios.delete(
        `${baseUrl}/admin/deleteAcademicYear/${deletingYear._id}`,
        {
          headers: { Authentication: token },
        }
      );
      if (data?.success) {
        setAcademicYears(
          academicYears.filter((year) => year._id !== deletingYear._id)
        );
        dispatch(
          setAcademicYear(
            academicYears.filter((year) => year._id !== deletingYear._id)
          )
        );
        setShowDeleteModal(false);
        toast.success("Academic year deleted successfully.");
      } else {
        toast.error(data.msg || "Failed to delete academic year.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

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
          refreshData={fetchAcademicYears}
        />
      )}

      {showDeleteModal && deletingYear && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title={deletingYear.academicYear}
        />
      )}
    </div>
  );
};

export default MainSection;
