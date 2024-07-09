

import React, { useState, useEffect } from "react";
import StudentDashLayout from "../../Components/Student/StudentDashLayout";
import Layout from "../../Components/Common/Layout";
import FilterContainer from "./StudentFinance/FilterContainer";
import FeeTable from "./StudentFinance/FeeTable";
import FeeCard from "./StudentFinance/FeeCard";

const FinanceTable = () => {
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });
  const [feesDetails, setFeesDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeesDetails = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          "http://localhost:8080/studentfees/student/get_own_fees",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch fees details, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setFeesDetails(data.data);
        } else {
          console.error("No fees data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch fees details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeesDetails();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredFeesDetails = feesDetails.filter(
    (item) =>
      (filters.feesType === "" || item.feeType === filters.feesType) &&
      (filters.status === "Everyone" || item.status === filters.status)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout title="Student Finance">
        <StudentDashLayout>
          <div className="flex">
            <div className="flex flex-col w-[80%] h-full">
              <FilterContainer
                filters={filters}
                feesDetails={feesDetails}
                handleFilterChange={handleFilterChange}
              />
              <FeeTable feesDetails={filteredFeesDetails} />
            </div>
            <div className="w-[20%] border p-4 h-screen">
              <div className="flex flex-col gap-5">
                <FeeCard
                  title="Total Unpaid Fees"
                  amount={feesDetails.reduce((sum, item) => item.status === "unpaid" ? sum + item.amount : sum, 0)}
                  buttonText="Pay Now"
                />
                <FeeCard
                  title="Total Paid Fees"
                  amount={feesDetails.reduce((sum, item) => item.status === "paid" ? sum + item.amount : sum, 0)}
                />
                <FeeCard
                  title="Parent Account Total Paid"
                  amount={feesDetails.reduce((sum, item) => item.status === "paid" ? sum + item.amount : sum, 0)}
                />
                <FeeCard
                  title="My Account Total Paid"
                  amount={feesDetails.reduce((sum, item) => item.status === "paid" ? sum + item.amount : sum, 0)}
                  buttonText="View All Expenses"
                />
              </div>
            </div>
          </div>
        </StudentDashLayout>
      </Layout>
    </>
  );
};

export default FinanceTable;
