import React, { useState, useEffect } from "react";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import Layout from "../../../Components/Common/Layout";
import FilterContainer from "./FilterContainer";
import FeeTable from "./FeeTable";
import FeeCard from "./FeeCard";
import axios from "axios";
import { baseUrl } from "../../../config/Common";
import Spinner from "../../../Components/Common/Spinner";
import NoDataFound from "../../../Components/Common/NoDataFound";
import { GoAlertFill } from "react-icons/go";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const StudentFinance = () => {
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });
  const [feesDetails, setFeesDetails] = useState([]);
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error handling
  useNavHeading("Finance");
  // Fetch Fees Details
  const fetchFeesDetails = async () => {
    try {
      const token = localStorage.getItem("student:token");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.get(`${baseUrl}/student/my_fees`, {
        headers: { Authentication: token },
      });

      const data = response.data;
      if (data) {
        setFeesDetails(data.fees.reverse());
        setTotalUnpaidFees(data.totalUnpaidFees);
        setTotalPaidFees(data.totalPaidFees);
      }
    } catch (error) {
      setError("Failed to fetch fees details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesDetails();
  }, []);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtered Data
  const filteredFeesDetails = feesDetails.filter(
    (item) =>
      (filters.feesType === "" || item.feeType === filters.feesType) &&
      (filters.status === "Everyone" || item.status === filters.status)
  );

  return (
    <Layout title="Student Finance">
      <StudentDashLayout>
        <div className="flex">
          <div className="flex flex-col w-[80%] h-full">
            {/* Filter always on top */}
            <FilterContainer
              filters={filters}
              feesDetails={feesDetails}
              handleFilterChange={handleFilterChange}
            />

            {loading ? (
              <div className="w-full h-screen flex flex-col items-center justify-center">
                <Spinner />
              </div>
            ) : error ? (
              <div className="alert-error flex items-center p-4">
                <GoAlertFill className="text-red-600 mr-2" />
                <span>{error}</span>
              </div>
            ) : filteredFeesDetails.length > 0 ? (
              <FeeTable feesDetails={filteredFeesDetails} />
            ) : (
              <NoDataFound />
            )}
          </div>

          {/* Summary Card Section */}
          {!loading && (
            <div className="w-[20%] border p-4 h-screen">
              <h3 className="mb-5 text-gray-500">Your Finance Details</h3>
              <div className="flex flex-col gap-5">
                <FeeCard
                  title="Total Unpaid Fees"
                  amount={totalUnpaidFees}
                  buttonText="Pay Now"
                />
                <FeeCard title="Total Paid Fees" amount={totalPaidFees} />
              </div>
            </div>
          )}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};

export default StudentFinance;
