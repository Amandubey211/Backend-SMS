import React, { useState, useMemo, useEffect } from "react";
import axios from 'axios';
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../SubClass/component/AddIssue";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";

const BookIssue = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState({show:false,index:0});
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    category: "",
  });
  const [data, setData] = useState([]);
  const role = useSelector((store) => store.Auth.role);
  const getAuthHeaders = () => {
    const token = localStorage.getItem(`${role}:token`);
    return {
      Authentication: `${token}`,
    };
  };
  const get_issue_books = ()=>{
    axios.get(`${baseUrl}/admin/all/bookIssue`, { headers: getAuthHeaders() })
    .then(response => {
      if (response.data.success) {
        setData(response.data.books);
        console.log(response.data.books);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  useEffect(() => {
    get_issue_books()
  }, []);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSuccess = (newItem) => {
    axios.post(`${baseUrl}/admin/all/bookIssue`, newItem, { headers: getAuthHeaders() })
      .then(response => {
        if (response.data.success) {
          setData(prev => [...prev, response.data.book]);
        }
      })
      .catch(error => console.error('Error adding item:', error));
  };

  const filteredData = data.filter(item => {
    return (
      (filters.classLevel === "" || item.classId?.className === filters.classLevel) &&
      (filters.section === "" || item.sectionId?.sectionName === filters.section) )
  });
  const sectionOptions = useMemo(() => {
    return [...new Set(data
      .filter(book => book.classId?.className === filters.classLevel)
      .map(book => book.sectionId?.sectionName)
      .filter(sectionName => sectionName))];
  }, [filters.classLevel, data]);
  const [editIssueData, setEditIssueData] = useState({
    class: '',
    section: '',
    student: '',
    book: '',
    authorName: '',
    issueDate: '',
    returnDate: '',
    status: ''
});
const DeleteBook=(id)=>{


}
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
        <FormField
  id="classLevel"
  label="Class"
  value={filters.classLevel}
  onChange={handleFilterChange}
  options={[...new Set(data.map(book => book.classId?.className))]}
  placeholder="Select Class"
/>
           <FormField
            id="section"
            label="Section"
            value={filters.section}
            onChange={handleFilterChange}
            options={sectionOptions}
            placeholder="Select Section"
          />
        </div>
        <button
          onClick={handleSidebarOpen}
          className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book Issue
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-6 py-3 border-b-2 border-gray-200">Student</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Class & Section</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Issue Book</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Author</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Date</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item,index) => (
              <tr key={item._id} className="hover:bg-gray-50 relative">
                <td className="px-6 py-4 border-b border-gray-200">{item.studentId?.firstName}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.classId?.className} & {item.sectionId?.sectionName}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.bookId?.name}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.author}</td>
                <td className="px-6 py-4 border-b border-gray-200">{new Date(item.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 border-b border-gray-200">{item.status}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                <div className=" absolute right-12   text-indigo-600 hover:text-indigo-900 cursor-pointer font-bold items-center" onClick={() => setShowEditMenu({show:true,index:index})}><HiDotsVertical /></div>
                {
          showEditMenu.show == true && showEditMenu.index==index ?
            <div className="absolute bottom-0 right-0 bg-white shadow-lg flex flex-col items-center w-[6rem] h-[3rem] border rounded-lg">
              <button className=" absolute left-[-1.5rem] top-[-2rem]  bottom-2 text-indigo-600 hover:text-indigo-900" onClick={() => setShowEditMenu(false)} ><MdCancel className="text-2xl text-black" /></button>
              <button className="  bottom-2 text-indigo-600 hover:text-indigo-900"  onClick={() => {
             handleSidebarOpen();
             setEditIssueData({
              id:item._id,
              class: item.classId?.className,
              section:item.sectionId?.sectionName,
              student: item.studentId?.firstName,
              book: item.bookId?.name,
              authorName: item.author,
              issueDate: item.issueDate,
              returnDate: item.returnDate,
              status: item.status
          })
              }}>Edit </button>
             {/* <button className=" bottom-2 text-indigo-600 hover:text-indigo-900 " onClick={()=>DeleteBook(item._id)}>Delete</button>*/}
            </div> : null
        }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title={editIssueData?"Edit Book Issue":"Add Book Issue"}
      >
        <AddIssue onClose={handleSidebarClose} onAddSuccess={handleAddSuccess} editIssueData={editIssueData}  onupdate={get_issue_books} />
      </Sidebar>
    </div>
  );
};

export default BookIssue;
