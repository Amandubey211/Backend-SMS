import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const PaySalary = ({ teacher, onSave, onClose }) => {
  const { t } = useTranslation('admExpense'); // Initialize useTranslation hook
  const [salaryAmount, setSalaryAmount] = useState(teacher ? teacher.salaryAmount : 0);

  useEffect(() => {
    if (teacher) {
      setSalaryAmount(teacher.salaryAmount);
    }
  }, [teacher]);

  if (!teacher) {
    return <div>{t('Loading...')}</div>;
  }

  const handlePayment = () => {
    const salaryDetails = {
      staffId: teacher.staffId._id, // Assuming staffId is an object
      month: teacher.month,
      year: teacher.year,
      status: 'paid'
    };
    // console.log("salaryDetails", salaryDetails);
    onSave(salaryDetails);
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold">{t('Pay Salary')}</h2>
      </div>
      <div className="flex flex-col items-center mb-4">
        {teacher.staffId.profile ? (
          <img
            src={teacher.staffId.profile}
            alt={teacher.staffId.fullName}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-3xl">{teacher.staffId.fullName[0]}</span>
          </div>
        )}
        <h3 className="mt-2 text-lg font-semibold">{teacher.staffId.fullName}</h3>
        <p>{teacher.staffId.position}</p>
        <p className="text-green-600">{teacher.staffId.mobileNumber}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Salary Amount')}
        </label>
        <input
          type="number"
          value={salaryAmount}
          onChange={(e) => setSalaryAmount(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
          readOnly
        />
      </div>
      <button
        onClick={handlePayment}
        className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
      >
        {t('Pay Now')}
      </button>
    </div>
  );
};

export default PaySalary;
