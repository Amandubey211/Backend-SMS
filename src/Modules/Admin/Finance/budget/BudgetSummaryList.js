import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaFileInvoice } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchBudgetsummary } from "../../../../Store/Slices/Finance/budget/budget.thunk";


const BudgetSummaryList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);

  const { allBudgetDetails, loading,  currentPage } = useSelector(
    (store) => store.admin.budget
  );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

  useEffect(() => {
    dispatch(fetchBudgetsummary({ page: currentPage || 1, search: searchText, limit: computedPageSize }));
  }, [dispatch, currentPage, computedPageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchBudgetsummary({ page: 1, search: value, limit: computedPageSize }));
  };


  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      title: "Budget Allocated",
      render: (_,record) => `${record.totalBudget} ${schoolCurrency} (${record.frequency})  `,
    },
    {
      title: "Spend Amount",
      dataIndex: "spendAmount",
      render:(spendAmount,record)=>` ${record.frequency == "monthly"?   (spendAmount/ record?.totalMonths)?.toFixed(2) :spendAmount} ${schoolCurrency} ${record.frequency == "monthly"? "/ Month":"" }`
    },
    {
      title: "Status",
      render: (_, record) => {
        let text = "With in budget";
    
        if (record.frequency == "monthly") {
          text = record?.totalBudget / record?.totalMonths > record?.spendAmount / 12 
            ? "With in budget" 
            : "Over Budget";
        } else {
          text = record?.totalBudget > record?.spendAmount 
            ? "With in budget" 
            : "Over Budget";
        }
    
        return (
          <p className={`text-${text === "With in budget" ? "green" : "red"}-500`}>
            {text}
          </p>
        );
      },
    }
    
  ];
  


const navigate = useNavigate();
  return (
 
  <>
        <div className="">
         <div className="flex flex-row items-center justify-between font-bold">
         Summary of Budget
          <div>
            <button className="flex flex-row text-sm items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg" onClick={()=>navigate("/finance/budget-planner/list")}>View More</button>
          </div>
         </div>
          <Table
            columns={columns}
            dataSource={allBudgetDetails?.slice(0,5)}
            rowKey="_id"
            loading={loading}
            pagination={false}
          />
        </div>
      
 </>
  );
};

export default BudgetSummaryList;
