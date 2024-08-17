

// import React, { useState, useEffect } from "react";
// import StudentDashLayout from "../../Components/Student/StudentDashLayout";
// import Layout from "../../Components/Common/Layout";
// import FilterContainer from "./StudentFinance/FilterContainer";
// import FeeTable from "./StudentFinance/FeeTable";
// import FeeCard from "./StudentFinance/FeeCard";
// import axios from "axios";
// import { baseUrl } from "../../config/Common";
// import Spinner from "../../Components/Common/Spinner";

// const FinanceTable = () => {
//   const [filters, setFilters] = useState({
//     feesType: "",
//     status: "Everyone",
//   });
//   const [feesDetails, setFeesDetails] = useState([]);
//   const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
//   const [totalPaidFees, setTotalPaidFees] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchFeesDetails = async () => {
//     console.log("Fetching fees details...");
//     try {
//       const token = localStorage.getItem('student:token');
//       console.log("Token is:", token);
  
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }
  
//       const response = await axios.get(
//         `${baseUrl}/student/my_fees`,
//         {
//           headers: {
//             Authentication: token,
//           },
//         }
//       );
  
//       console.log("Response received:", response);
//       const data = response.data;
//       console.log("Data parsed:", data);
  
//       if (data) {
//         setFeesDetails(data.fees.reverse());
//         setTotalUnpaidFees(data.totalUnpaidFees);
//         setTotalPaidFees(data.totalPaidFees);
//       } else {
//         console.log("No fees data or unsuccessful response");
//       }
//     } catch (error) {
//       console.error("Failed to fetch fees details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeesDetails();
//   }, []);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredFeesDetails = feesDetails.filter(
//     (item) =>
//       (filters.feesType === "" || item.feeType === filters.feesType) &&
//       (filters.status === "Everyone" || item.status === filters.status)
//   );

//   return (
//     <Layout title="Student Finance">
//       <StudentDashLayout>
//         <div className="flex">
//           <div className="flex flex-col w-[80%] h-full">
//             {loading ? (
//               <div className="w-full h-screen flex flex-col items-center justify-center">
//                 <Spinner />
//               </div>
//             ) : (
//               <>
//                 <FilterContainer
//                   filters={filters}
//                   feesDetails={feesDetails}
//                   handleFilterChange={handleFilterChange}
//                 />
//                 <FeeTable feesDetails={filteredFeesDetails} />
//               </>
//             )}
//           </div>

//           {!loading && (
//             <div className="w-[20%] border p-4 h-screen">
//               <h3 className="mb-5 text-gray-500">Your Finance Details</h3>

//               <div className="flex flex-col gap-5">
//                 <FeeCard
//                   title="Total Unpaid Fees"
//                   amount={totalUnpaidFees}
//                   buttonText="Pay Now"
//                 />
//                 <FeeCard
//                   title="Total Paid Fees"
//                   amount={totalPaidFees}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </StudentDashLayout>
//     </Layout>
//   );
// };

// export default FinanceTable;





///---------------------------------------


import React, { useState, useEffect } from "react";
import StudentDashLayout from "../../Components/Student/StudentDashLayout";
import Layout from "../../Components/Common/Layout";
import FilterContainer from "./StudentFinance/FilterContainer";
import FeeTable from "./StudentFinance/FeeTable";
import FeeCard from "./StudentFinance/FeeCard";
import axios from "axios";
import { baseUrl } from "../../config/Common";
import Spinner from "../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go"; // Import the GoAlertFill icon

const FinanceTable = () => {
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });
  const [feesDetails, setFeesDetails] = useState([]);
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFeesDetails = async () => {
    console.log("Fetching fees details...");
    try {
      const token = localStorage.getItem('student:token');
      console.log("Token is:", token);
  
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const response = await axios.get(
        `${baseUrl}/student/my_fees`,
        {
          headers: {
            Authentication: token,
          },
        }
      );
  
      console.log("Response received:", response);
      const data = response.data;
      console.log("Data parsed:", data);
  
      if (data) {
        setFeesDetails(data.fees.reverse());
        setTotalUnpaidFees(data.totalUnpaidFees);
        setTotalPaidFees(data.totalPaidFees);
      } else {
        console.log("No fees data or unsuccessful response");
      }
    } catch (error) {
      console.error("Failed to fetch fees details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <Layout title="Student Finance">
      <StudentDashLayout>
        <div className="flex">
          <div className="flex flex-col w-[80%] h-full">
            {loading ? (
              <div className="w-full h-screen flex flex-col items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {filteredFeesDetails.length > 0 ? (
                  <>
                    <FilterContainer
                      filters={filters}
                      feesDetails={feesDetails}
                      handleFilterChange={handleFilterChange}
                    />
                    <FeeTable feesDetails={filteredFeesDetails} />
                  </>
                ) : (
                  <div className="flex items-center justify-center flex-col text-2xl h-full text-gray-500">
                    <GoAlertFill className="text-[5rem]" />
                    No Data Found
                  </div>
                )}
              </>
            )}
          </div>

          {!loading && (
            <div className="w-[20%] border p-4 h-screen">
              <h3 className="mb-5 text-gray-500">Your Finance Details</h3>

              <div className="flex flex-col gap-5">
                <FeeCard
                  title="Total Unpaid Fees"
                  amount={totalUnpaidFees}
                  buttonText="Pay Now"
                />
                <FeeCard
                  title="Total Paid Fees"
                  amount={totalPaidFees}
                />
              </div>
            </div>
          )}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};

export default FinanceTable;
