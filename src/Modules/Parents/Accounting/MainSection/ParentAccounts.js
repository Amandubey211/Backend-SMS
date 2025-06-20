import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchChildren } from "../../../../Store/Slices/Parent/Dashboard/dashboard.action";
import { fetchOneStudentFee } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { Table, Skeleton } from 'antd';
import { FaMoneyBillAlt, FaExclamationCircle, FaArrowRight } from "react-icons/fa";

const AccountingSection = () => {
  const { t } = useTranslation("prtFinance");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [initialFetching, setInitialFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (initialFetching) {
        setLoading(true);
        try {
          const studentsResponse = await dispatch(fetchChildren());
          const fetchedStudents = studentsResponse.payload;
          setStudents(fetchedStudents);

          const feesPromises = fetchedStudents.map(async (student) => {
            const feeResponse = await dispatch(fetchOneStudentFee({ studentId: student._id }));
            return {
              id: student._id,
              childName: `${student.firstName} ${student.lastName}`,
              totalAmount: parseFloat(feeResponse.payload.totalAllAmount) || 0,
              paidAmount: parseFloat(feeResponse.payload.paidAllAmount) || 0,
            };
          });

          const fetchedFees = await Promise.all(feesPromises);
          setFeesData(fetchedFees);
        } catch (err) {
          setError("Failed to fetch data");
        } finally {
          setLoading(false);
          setInitialFetching(false);
        }
      }
    };

    fetchData();
  }, [dispatch, initialFetching]);

  const fees = useMemo(() => feesData ?? [], [feesData]);

  const tableData = useMemo(() => {
    return fees.map(fee => ({
      key: fee.id,
      childName: fee.childName,
      amountRemaining: fee.paidAmount <= fee.totalAmount
        ? (fee.totalAmount - fee.paidAmount).toFixed(2)
        : "0.00",
    }));
  }, [fees]);

  const columns = [
    {
      title: 'Child Name',
      dataIndex: 'childName',
      key: 'childName',
      sorter: (a, b) => a.childName.localeCompare(b.childName),
    },
    {
      title: 'Amount Remaining (QAR)',
      dataIndex: 'amountRemaining',
      key: 'amountRemaining',
      sorter: (a, b) => a.amountRemaining - b.amountRemaining,
    },
  ];

  const handleNavigate = () => {
    navigate("/parentfinance");
  };

  const skeletonRows = Array(5).fill().map((_, index) => (
    <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-2">
      <Skeleton.Input active style={{ width: '40%' }} />
      <Skeleton.Input active style={{ width: '50%' }} />
    </div>
  ));

  return (
    <div className="py-4 px-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg h-full">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <span className="text-l font-bold text-gray-800 flex items-center">
          <FaMoneyBillAlt className="w-8 h-8 mr-2 text-blue-400" />
          {t("Fees Pending")}
        </span>
        {tableData.length > 0 && !error && (
          <button
            className="lg:mt-0 px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 ease-in-out
                      text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
                      hover:bg-gray-100 hover:shadow-md flex items-center gap-2"
            onClick={handleNavigate}
          >
            {tableData.length === 1 ? t("View Details") : t("View All")}
            <FaArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="w-full">
          {loading ? (
            <div className="w-full bg-white rounded-lg shadow-md p-4 overflow-y-auto h-[200px]">
              {skeletonRows}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <FaExclamationCircle className="text-red-500 w-12 h-12 mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                {error ? `${error}: ` : ""}
                {t("Unable to fetch Fees")}
              </p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <FaMoneyBillAlt className="text-indigo-500 w-16 h-16 mb-4" />
              <p className="text-gray-700 text-lg font-medium">{t("No Fees Yet")}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-[400px]">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                className="w-full"
                size="middle"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountingSection;