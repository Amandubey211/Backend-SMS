import React, { useEffect, useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';
import { useSelector } from 'react-redux';
import useGetAllClasses from '../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses';
import useFetchSection from '../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection';
import useGetStudentsByClassAndSection from '../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import toast from 'react-hot-toast';

const EditFee = ({onUpdate}) => {
  const [sectionData, setSectionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
 const [classData, setClassData] = useState([]);
  const role = useSelector((store) => store.Auth.role);
  const token = localStorage.getItem(`${role}:token`);
  const { classList, sectionsList } = useSelector((store) => store.Class);
  const { fetchClasses } = useGetAllClasses();
  const { fetchSection } = useFetchSection();
  const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();
  useEffect(() => {
    const fetchData = async () => {
        await fetchClasses();
        setClassData(classList.map((item) => ({
            value: item.className,
            label: item.className
        })));
    };
    fetchData();
}, []);
  const [formData, setFormData] = useState({
    studentId: '',
    feesType: '',
    dueDate: '',
    amount: ''
  });

  const handleChange = async(e) => {
    const { name, value } = e.target;
    if (name === 'class') {
      const findClass = classList.find((item) => item.className === value);
      if (findClass) {
          await fetchSection(findClass._id);
          const students = await fetchStudentsByClassAndSection(findClass._id);

          setStudentData(students.map((item) => ({
              value: item.firstName + item.lastName,
              label: `${item.firstName } ID:${item?.admissionNumber}`,
            
              

          })));
          console.log(students);
          setSectionData(sectionsList.map((item) => ({
              value: item.sectionName,
              label: item.sectionName
          })));
      } else {
          console.log('Class not found');
      }
  }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Submitting Single Fee:', formData);
    const selectedClass = classList.find(item => item.className === formData.class);
    const students = await fetchStudentsByClassAndSection(selectedClass?._id);
    const selectedStudent = students.find(item => item.firstName + item.lastName == formData.studentId);
    const submissionData = {
      studentIds:[selectedStudent._id],
     amount:formData.amount,
    dueDate:formData.dueDate,
     feeType:formData.feesType
    }
    try {
      if (submissionData) {
          // If editing, make a PUT request
          await axios.post(`${baseUrl}/admin/student/create_fees`, submissionData, {
              headers: {
                  'Content-Type': 'application/json',
                  Authentication: `${token}`,
              },
          });
          toast.success('Fee record Added');
          onUpdate()
          //onupdate()
      } else {
          // If adding a new record, make a POST request
      //    await axios.post(`${baseUrl}/admin/student/create_fees`, submissionData, {
        //      headers: {
       //           'Content-Type': 'application/json',
       //           Authentication: `${token}`,
        //      },
        //  });
         // toast.success('Fee record Added');
          //onupdate()
      }
  } catch (error) {
      toast.error('Failed to process request');
  }
    console.log(selectedStudent);
    
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormSelect id="studentId" label="Student ID" options={studentData} value={formData.studentId} onChange={handleChange} required />
      <FormInput id="feesType" label="Fees Type" type='text' value={formData.feesType} onChange={handleChange} required />
      <FormInput id="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} required />
      <FormInput id="amount" label="Amount" type="text" value={formData.amount} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Fees
      </button>
    </form>
  );
};

export default EditFee;

