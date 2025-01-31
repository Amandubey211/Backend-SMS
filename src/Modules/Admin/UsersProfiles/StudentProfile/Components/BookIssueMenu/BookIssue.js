import React, { useState, useEffect, useMemo } from "react";
import BookIssueRow from "../../../../../Student/Library/SubClass/component/BookIssueRow";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoAlertFill } from "react-icons/go";
import { FiLoader } from "react-icons/fi";
import { studentIssueBooks } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import Spinner from "../../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";

const BookIssue = () => {
  const { cid:id } = useParams();
  const [filters, setFilters] = useState({
    classLevel: "",
    category: "",
    status: "All",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const {bookIssue,loading} = useSelector((store) => store.admin.all_students);
   const dispatch = useDispatch()
  useEffect(() => {
    dispatch(studentIssueBooks(id))
  }, [dispatch]);

  const filteredBookIssueData = useMemo(() => {
    if (filters.status === "All") {
      return bookIssue;
    }
    return bookIssue?.filter(item => item.status === filters.status);
  }, [bookIssue, filters.status]);

  return (
    <div className="min-h-screen p-4 ">
      <ProtectedSection requiredPermission={PERMISSIONS.STUDENT_BOOKISSUE_RECORD}  title={"Book Issue"}>
      <div className="flex justify-between items-center mb-4">

      </div>
      <div className="flex gap-3 mb-5">
        {["All", "Pending", "Returned"]?.map((status) => (
          <div key={status} className="">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={handleFilterChange}
                className="hidden"
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${filters.status === status
                  ? "border-green-500 bg-green-500"
                  : "border-gray-300"
                  }`}
              >
                {filters.status === status && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`transition-colors duration-200 ${filters.status === status
                  ? "text-red-700"
                  : "text-gray-700"
                  }`}
              >
                {status}
              </span>
            </label>
          </div>
        ))}
      </div>
      {loading?<div className="flex w-full h-[90vh] flex-col items-center justify-center">
   <Spinner/>
    </div>:
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-5 py-3 border-b border-gray-200">Issue Book</th>
              <th className="px-5 py-3 border-b border-gray-200">Author</th>
              <th className="px-5 py-3 border-b border-gray-200">Category</th>
              <th className="px-5 py-3 border-b border-gray-200">Issue Date</th>
              <th className="px-5 py-3 border-b border-gray-200">Return Date</th>
              <th className="px-5 py-3 border-b border-gray-200">Status</th>
            </tr>
          </thead>
          {filteredBookIssueData?.length > 0 ?  <tbody>
            {[...filteredBookIssueData]?.reverse()?.map((item) => (
              <BookIssueRow key={item.id} item={item} />

            ))}
          </tbody>: <tr className="w-full text-center text-gray-500 ">
          <td className="px-5 py-2" colSpan="6">
          <div className="flex  items-center justify-center flex-col text-2xl my-[10rem] h-auto">
        <GoAlertFill className="text-[5rem]" />
       No Issue Book Found
      </div>
          </td>
        </tr>}
        
        </table>
      </div>}
      </ProtectedSection>
    </div>
  );
};

export default BookIssue;
