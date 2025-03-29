import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollStaff } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";
const SelectStaffs = ({ staffIds,setStaffIds}) => {
  const dispatch = useDispatch();
  
  const [searchText, setSearchText] = useState("");
  const [staffs, setStaffs] = useState([]);
  useEffect(() => {
    dispatch(fetchPayrollStaff({ type:"teacher" })).then((action)=>{
      setStaffs(action?.payload?.data);
       
    });
  }, []);
  const getStaff = (type)=>{
    dispatch(fetchPayrollStaff({ type })).then((action)=>{
      setStaffs(action?.payload?.data);
       
    });
  }

  // Handle individual entity checkbox change
  const handleEntityCheckboxChange = (e, staffId) => {
    if (e.target.checked) {
      // Add entity ID to the list
      setStaffIds((prevIds) => [...prevIds, staffId]);
    } else {
      // Remove entity ID from the list
      setStaffIds((prevIds) => prevIds.filter((id) => id != staffId));
    }
    console.log(e.target.checked,staffId);
    
  };

  // Handle Select All checkbox change
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setStaffIds(staffs.map((staff) => staff._id));
    } else {
      setStaffIds([]);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex w-full justify-between flex-row mb-4">
      <label>
        <input
          type="checkbox"
          checked={staffIds?.length === staffs?.length}
          onChange={handleSelectAllChange}
        />
        <span className="text-sm m-1 cursor-pointer">Select All staffs</span>
      </label>
      <div>
        <select onClick={(e)=>getStaff(e.target.value)} >
          {['teacher', 'finance', 'librarian', 'staff'].map((i)=>(
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      </div>
      <div className="flex flex-start w-[99%] flex-wrap gap-8 border border-gray-200 h-full rounded-lg p-2 overflow-y-auto">
        { staffs?.length > 0 ? staffs?.map((e) => (
          <div
            key={e._id}
            className="w-auto h-[3rem] flex items-start px-2 justify-center flex-col bg-purple-500 text-white text-sm rounded-lg"
          >
            <label>
              <input
                type="checkbox"
                checked={staffIds.includes(e._id)}
                onChange={(event) => handleEntityCheckboxChange(event, e._id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="pl-2 cursor-pointer">{e?.firstName}</span>
              <span className="pl-2 cursor-pointer">{e?.lastName}</span>
            </label>
            <p className="text-xs">{e?.email}</p>
          </div>
        )):<div className="h-[5rem] flex item-center justify-center text-gray-500 w-full">
            No User Found
          </div>}

      </div>
    </div>
  );
};
export default SelectStaffs;