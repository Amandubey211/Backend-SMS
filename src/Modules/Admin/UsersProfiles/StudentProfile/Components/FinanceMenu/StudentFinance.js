import React, { useEffect, useState } from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import FinanceCard from "./FinanceCard";
import FinanceTable from "./FinanceTable";
import { PiMoneyBold } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../../../config/Common";
const StudentFinance = ({ student }) => {
  const {cid} = useParams();
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
      const token = localStorage.getItem('admin:token');
  
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      const response = await axios.get(
        `${baseUrl}/student/fees/${cid}`,
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

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("totalPaidFees", totalPaidFees)
  console.log("TotalPaidFees", totalUnpaidFees)
  return (
      <>
      <div className="flex flex-col">
        <div className="w-full border p-4">
          <div className="flex flex-row gap-3 p-4 ">
           <div className="w-[18rem]">
           <FinanceCard
              icon={<PiMoneyBold className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />}
              label="Total Unpaid Fees"
              value={totalUnpaidFees}
              buttonLabel={null}
              onButtonClick={() => console.log("Message clicked")}
            />
           </div>
            <FinanceCard
              icon={<FaUserFriends className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />}
              label="Parents Account Total Paid"
              value={student?.finance?.parentsAccountTotalPaid | 0}
              onButtonClick={() => console.log("Message clicked")}
              buttonLabel={null}
            />
            <FinanceCard
              icon={<PiMoneyBold className="text-green-300 text-[2.5rem] font-bold border border-green-300 p-2 rounded-full" />}
              label="Total Paid Fees"
              value={totalPaidFees}
                buttonLabel={null}
              onButtonClick={() => console.log("Message clicked")}
            />
          </div>
        </div>
        <FinanceTable feesDetails={feesDetails} />
      </div>
    </>
  );
};

export default StudentFinance;






