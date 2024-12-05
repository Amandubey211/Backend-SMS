import React, { useEffect, useState } from "react";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs"; // Importing the icons
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranch,
  updateBranch,
} from "../../../Store/Slices/Admin/branchs/branch.action";
import Cookies from "js-cookie";
import Spinner from "../../../Components/Common/Spinner";
import { useNavigate } from "react-router-dom";
import { LuSchool } from "react-icons/lu";
import { setLocalCookies } from "../../../Utils/academivYear";
import { FaRegEdit } from "react-icons/fa";
import { edit } from "@cloudinary/url-gen/actions/animated";
import EditBranch from "./EditBranch";

const BranchTable = () => {
  const dispatch = useDispatch();
  const selectBranch = Cookies.get("SelectedschoolId");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const { userDetails } = useSelector((store) => store.common.user);
  const { t } = useTranslation("admAcademicYear");
  const navigate = useNavigate();
  const { branchs, loading, error } = useSelector(
    (store) => store.common.branchs
  );
  useEffect(() => {
    if (!selectBranch) {
      setLocalCookies("SelectedschoolId", userDetails?.schoolId);
    }
    dispatch(fetchBranch());
  }, [dispatch]);
  const changeBranch = (branchId) => {
    const data = { schoolId: branchId };
    dispatch(updateBranch({ navigate, data })).then(() => {
      setLocalCookies("SelectedschoolId", branchId);
      window.location.reload();
    });
  };
  return (
    <div className="bg-white p-2 rounded-lg w-full px-8">
      <h2 className="text-2xl text-gray-600 flex mb-2 flex-row items-center gap-2">
        {" "}
        <span>
          <LuSchool />
        </span>
        {userDetails?.schoolName}
      </h2>
      {loading ? (
        <Spinner />
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-gray-500 text-base leading-normal bg-gray-100">
              <th className="p-3">{t("Select Branch")}</th>
              <th className="p-3">{t("Branch Name")}</th>
              <th className="p-3">{t("Branch City & Address")}</th>
              <th className="p-3">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="text-base text-gray-700">
            {branchs?.map((b) => (
              <tr
                key={b._id}
                className={`${
                  selectBranch == b._id
                    ? "bg-green-50 hover:bg-green-100"
                    : "hover:bg-gray-50"
                } border-b border-gray-200 transition duration-200`}
              >
                <td className="p-3 flex">
                  <button onClick={() => changeBranch(b._id)}>
                    {selectBranch == b._id ? (
                      <BsFillPatchCheckFill className="text-green-500 text-2xl" />
                    ) : (
                      <BsPatchCheck className="text-gray-400 text-2xl" />
                    )}
                  </button>
                </td>
                <td className="p-3">{b?.branchName}</td>
                <td className="p-3 ">{b?.city} <br/>
                  <span className="text-gray-600 text-sm">
                    {b?.address}
                  </span>
                  </td>
                <td className="p-3 flex items-center text-2xl ">
                <button
                  onClick={() => { setEditData(b);setShowEditModal(true)}}
                >
                   <FaRegEdit />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showEditModal && (
        <EditBranch
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editData}
        />
      )}
    </div>
  );
};

export default BranchTable;
