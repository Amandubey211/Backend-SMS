import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountingData } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action';
import Layout from "../../../../Components/Common/ParentLayout";
import { FaExclamationCircle, FaMoneyBillWave } from "react-icons/fa";
import Spinner from "../../../../Components/Common/Spinner";
import { useTranslation } from "react-i18next";
import { FinanceTableSkeleton } from "../../Skeletons";
import { Table, Tag } from "antd"; // AntD imports

// Utility function to get unique filter options from the data (with optional chaining)
const uniqueFilterOptions = (data, key) => {
  return [...new Set(data?.map((item) => item?.[key])?.filter(Boolean))].sort();
};

const AccountingSection = () => {
  const { t } = useTranslation('prtFinance');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filters state (if you still need them)
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone", 
  });

  // Redux state for accounting data
  const {
    accountingData = {
      fees: [],
      totalUnpaidFees: 0,
      totalPaidFees: 0
    },
    loadingAccounting: loading,
    errorAccounting: error
  } = useSelector((state) => state?.Parent?.dashboard || {});

  // Fetch data once
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchAccountingData());
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Extract fees array
  const fees = useMemo(() => accountingData?.fees ?? [], [accountingData]);

  // Prepare filter options (if you need to show them somewhere)
  const classes = useMemo(() => uniqueFilterOptions(fees, "class"), [fees]);
  const sections = useMemo(() => uniqueFilterOptions(fees, "section"), [fees]);
  const feesTypes = useMemo(() => uniqueFilterOptions(fees, "feeType"), [fees]);

  // Apply filters (if you are still filtering)
  const filteredData = useMemo(() => {
    return fees?.filter((item) => {
      const classCondition =
        filters?.class === "" || item?.class === filters?.class;
      const sectionCondition =
        filters?.section === "" || item?.section === filters?.section;
      const feeTypeCondition =
        filters?.feesType === "" || item?.feeType === filters?.feesType;
      const statusCondition =
        filters?.status === "Everyone" || item?.status === filters?.status;

      return (
        classCondition &&
        sectionCondition &&
        feeTypeCondition &&
        statusCondition
      );
    });
  }, [fees, filters]);

  // Show only top 5 entries
  const topFiveData = useMemo(() => {
    return filteredData.slice(0, 5).map((item) => ({
      key: item.id,
      ...item,
    }));
  }, [filteredData]);

  // AntD table columns
  const columns = [
    {
      title: t("Fee Type"),
      dataIndex: "feeType",
      key: "feeType",
      render: (text) => text ?? t("No Fee Type"),
    },
    {
      title: t("Paid By"),
      dataIndex: "paidBy",
      key: "paidBy",
      render: (text) => text ?? "N/A",
    },
    {
      title: t("Due Date"),
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => text ?? "N/A",
    },
    {
      title: t("Amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text) => text ?? "N/A",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Paid":
            color = "green";
            break;
          case "Partial":
            color = "orange";
            break;
          case "Unpaid":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status ?? "N/A"}</Tag>;
      },
    },
    {
      title: t("Action"),
      dataIndex: "status",
      key: "action",
      render: (status) => {
        if (status === "Unpaid") {
          return (
            <button
              className="text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:bg-gradient-to-l px-4 py-1 font-normal rounded-md transition duration-300 ease-in-out"
              style={{ minWidth: "100px", height: "36px" }}
            >
              {t("Pay Now")}
            </button>
          );
        } else {
          return (
            <span
              className="text-[#0D9755] bg-[#E9F8EB] font-normal px-4 py-1 rounded-md inline-block"
              style={{
                width: "100px",
                height: "36px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {t("Completed")}
            </span>
          );
        }
      },
    },
  ];

  // Navigation handler for "See All"
  const handleNavigate = useCallback(() => {
    navigate("/parentfinance");
  }, [navigate]);

  return (
    <Layout title={t("Finance")}>
      <div className="p-4 pt-0 pl-[0.5rem] w-full">
        {/* Header: DO NOT CHANGE */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-600 text-center">
            {t("Finance")}
          </h2>
          {!error && (
            <div className="flex items-center space-x-4">
              <div className="inline-block mr-5">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out 
               text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
               hover:bg-gradient-to-r hover:from-[#7F35CD] hover:to-[#C83B62]  
               hover:shadow-md"
                  onClick={handleNavigate}
                >
                  {t("See All")}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex items-center justify-center w-full">
          <div className="rounded-lg w-full overflow-x-hidden">
            {loading ? (
              <FinanceTableSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center p-10">
                <FaExclamationCircle className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">
                  {error ? `${error}: ` : ""}
                  {t("Unable to fetch Fees")}
                </p>
              </div>
            ) : topFiveData?.length === 0 ? (
              <div className="flex flex-col items-center p-10">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">{t("No Fees Yet")}</p>
              </div>
            ) : (
              // AntD Table (no pagination)
              <Table
                columns={columns}
                dataSource={topFiveData}
                pagination={false} // no pagination
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountingSection;
