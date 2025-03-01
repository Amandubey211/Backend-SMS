import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import React, { useState } from "react";
import StudentFeesForm from "../Earnings/AddEarnings/EarningsForm/StudentFeesForm";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

export default function AddStudentFeesForm() {
  const subCategories = [
            "Tuition Fees",
            "Hotel Fees",
            "Application Fees",
            "Certificate Fees",
            "Meal Fees",
            "Event Fees",
            "Exam Fees",
            "Transport Fees",
            "Other"
  ];


  const [selectCategories, setSelectCategories] = useState([]);
  const [discription, setDescription] = useState('');
  const [formData, setFormData] = useState([]);
  const [allData, setAllData] = useState({});
    const [studentDetail,setStudentDetail] = useState({
      classId:'',
      sectionId:'',
      studentId:'',
    });
  const handleCategoryChange = (category, isChecked) => {
    if (isChecked) {
      if(selectCategories.length == 0){
        setSelectCategories([category]);
        setFormData( [ { subCategory: category }]);
      }else{
        setSelectCategories((prev) => [...prev, category]);
        setFormData((prev) => [...prev, { subCategory: category}]);
      }
      
    } else {
      // Remove the category and its corresponding object from formData
      setSelectCategories((prev) => prev.filter((item) => item !== category));
      setFormData((prev) => prev.filter((item) => item.subCategory !== category));
    }
  };  
  useNavHeading("Finance", "Add Student Fees");
  return (
    <Layout title="Finance | Add Student Fees">
      <AdminDashLayout>
      <ProtectedSection requiredPermission={PERMISSIONS.ADD_NEW_FEES} title={'Add Fees'}>
        <div className="w-full max-w-screen-xl mx-auto overflow-x-hidden p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Fees</h1>
        <div className="flex gap-4">
          <button
            onClick={()=>{setFormData({});setSelectCategories([])} }
            className="bg-gray-100 text-gray-700 text-sm font-medium px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>
          <div className="flex w-full items-center justify-center flex-row gap-2 border-b-2 pb-2">
            <div className="flex w-[70%] flex-wrap gap-8">
              {subCategories.map((category,index) => (
                <div
                  key={category}
                  className="flex items-center justify-center flex-row gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={category}
                    className="cursor-pointer w-[1rem] h-[1rem]"
                    checked={selectCategories.includes(category)}
                    onChange={(e) =>
                      handleCategoryChange(category, e.target.checked)
                    }
                  
                  />
                  <label
                    htmlFor={category}
                    className="font-semibold cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            <div className="relative w-[30%] bg-gray-100 border border-gray-300 rounded-lg p-2">
              <label className="text-sm text-gray-900 block mb-2">
                Add description
              </label>
              <textarea
              onChange={(e)=>setDescription(e.target.value)}
              value={discription || ''}
              maxLength={100}
              className="bg-gray-50 rounded-lg p-2 text-sm text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
              placeholder="Write a short description"
              ></textarea>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <StudentFeesForm selectCategories={selectCategories}  setStudentDetail={setStudentDetail} formData={formData} setFormData={setFormData} allData={allData} discription={discription} studentDetail={studentDetail} />
          </div>
        </div>
        </ProtectedSection>
      </AdminDashLayout>
    </Layout>
  );
}
