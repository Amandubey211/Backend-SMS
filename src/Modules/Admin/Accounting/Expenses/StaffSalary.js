import React,{useState} from 'react';
import Sidebar from '../../../../Components/Common/Sidebar';
import AddEarning from '../Earnings/AddEarning';
import PaySalary from './PaySalary';

const StaffSalary = ({ data, selectedMonth }) => {
      const [selectedTeacher, setSelectedTeacher] = useState(null);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarOpen = () => {
        if(selectedTeacher)
        setSidebarOpen(true);
        
    }
    const handleSidebarClose = () => setSidebarOpen(false);
    const handlePayClick=(teacher)=>{
        setSelectedTeacher(teacher);
        handleSidebarOpen(true);
    }
  // Filter data based on the selected month or show all
  const filteredData = data.filter(item => item.salaryMonth === selectedMonth || selectedMonth === 'All');

  return (
    <div>
      <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-gray-700 bg-gray-100">
            <th className="px-5 py-3 border-b-2 border-gray-200">Teacher's Name</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Contact Info</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Month</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Salary Amount</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Paid Date</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
            <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="bg-white">
              {/* <td className="px-5 py-2 border-b border-gray-200">{item.name}</td> */}
              <td className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center">
                    <img src={item.imageUrl} alt="Profile" className="h-8 w-8 mr-2 rounded-full "/>
                    <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[12px] text-green-600">{item.jobRole}</span>
                    </div>
                </div>
            </td>              <td className="px-5 py-2 border-b border-gray-200">{item.contact}</td>
              <td className="px-5 py-2 border-b border-gray-200">{item.salaryMonth}</td>
              <td className="px-5 py-2 border-b border-gray-200">{item.salaryAmount}</td>
              <td className="px-5 py-2 border-b border-gray-200">{item.paidDate}</td>
              <td className="px-5 py-2 border-b border-gray-200">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-5 py-2 border-b border-gray-200">
                {item.status === 'Paid' ? (
                //   <span className='px-3 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800'>Complete</span>
                  <span className='inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800  py-1 px-2 rounded-md '>Complete</span>
                ) : (
                //   <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">Pay</button>
                <button
                className=" inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600"
                onClick={()=>{handlePayClick(item)}}
                // onClick={handleSidebarOpen}
                // onClick={handleAddEventClick}
              >
                Pay Now
              </button>
                
                )}
              </td>
              {/* <td className="px-5 py-2 border-b border-gray-200">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {item.status}
                </span>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add Transaction"
          >
          <PaySalary teacher={selectedTeacher} />
          </Sidebar>
    </div>
  );
};

export default StaffSalary;

