import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParentFinanceData,
  fetchParentFeeBreakdown,
} from "../../Store/Slices/Parent/Finance/finance.action.js";
import { fetchChildren } from "../../Store/Slices/Parent/Children/children.action";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { RiErrorWarningFill, RiSignalWifiErrorFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";
import { FaMoneyBillWave } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import ChildCard from "../../Components/Parents/Children/ChildCard.js";
import StudentFinance from "../Admin/UsersProfiles/StudentProfile/Components/FinanceMenu/StudentFinance.js";


const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance");
  const dispatch = useDispatch();
  const [studentId, setStudentId] = useState('')
  const { children = [], } = useSelector((state) => state.Parent.children);
  const userId = useSelector((state) => state.common.user.userDetails.userId);


  useEffect(() => {
    if (userId) {
      dispatch(fetchChildren(userId)).then(()=>setStudentId(children[0]?.id));
    }
  }, [dispatch, userId]);

  useNavHeading(t("Children Fees"));


  return (
    <Layout title={t("Parents | Children Fees")}>
      <ParentDashLayout hideAvatarList={true}>
  
          <div className="flex flex-row  gap-2">
            <div className="w-[75%]">
              <StudentFinance studentId={studentId} />

            </div>
            {/* Right Box: Cards */}
            <div className="w-[25%] flex flex-col gap-4 py-6 px-2 items-center  border-l-2 h-[100vh]">
                {children?.map((child) => (
                  <div
                    key={child?.id}
                    onClick={() => setStudentId(child.id)}
                    className={`cursor-pointer w-full transform ${child?.id == studentId ? "bg-purple-200":""}  border p-2 rounded-lg transition duration-300 hover:scale-105 hover:shadow-lg`}
                  >
                    <div>
                      <div className="flex items-center space-x-3 mb-4+">
                        <div className="border rounded-full">
                          <img
                            src={child?.profile}
                            alt={child?.name}
                            className="w-16 h-16 rounded-full object-cover border"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{child?.name}</h2>
                          <p className="text-sm text-gray-600">
                            Class: {child?.class}
                          </p>
                          <p className="text-sm text-gray-600">
                            Section: {child?.sectionName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
    
            </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
