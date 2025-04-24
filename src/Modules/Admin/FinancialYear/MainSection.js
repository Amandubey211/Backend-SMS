import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FinanceYearTable from "./FinancialYearTable";
import { addFinancialYear, fetchFinancialYear } from "../../../Store/Slices/Common/FinancialYear/financialYear.action";
import CreateFinanceYearForm from "./CreateFinancialYear";
import EditFinanceYearModal from "./EditFinancialYear";

const MainSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newYear, setNewYear] = useState({
    Name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [editingYear, setEditingYear] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);


  const { FinancialYears, loading } = useSelector(
    (store) => store.common.financialYear
  );
  
  const handleCheckboxChange = async (sy) => {
   
  };

  const handleCreate = async () => {
    if (FinancialYears.length === 0) {
      setNewYear((prev) => ({ ...prev, isActive: true }));
    }
    dispatch(addFinancialYear(newYear));
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setShowEditModal(true);
  };

 

  useEffect(() => {
    dispatch(fetchFinancialYear());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex w-full">
      <div className="w-2/3 p-2">
        <FinanceYearTable
          FinancialYears={FinancialYears}
          handleCheckboxChange={handleCheckboxChange}
          handleEdit={handleEdit}
        />
      </div>

      <div className="w-1/3 p-2">
        <CreateFinanceYearForm
          newYear={newYear}
          setNewYear={setNewYear}
          handleCreate={handleCreate}
          loading={loading}
        />
      </div>

      {showEditModal && editingYear && (
        <EditFinanceYearModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          year={editingYear}
          FinanceYears={FinancialYears}
          />
      )}
    </div>
  );
};

export default MainSection;
