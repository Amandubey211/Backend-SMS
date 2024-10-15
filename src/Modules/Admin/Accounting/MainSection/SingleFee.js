import React, { useEffect, useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllClasses from '../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses';
import useFetchSection from '../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection';
import useGetStudentsByClassAndSection from '../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { fetchAllClasses } from '../../../../Store/Slices/Admin/Class/actions/classThunk';
import { fetchSectionsByClass } from '../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks';
import { fetchStudentsByClassAndSection } from '../../../../Store/Slices/Admin/Class/Students/studentThunks';
import { resetFormData, setFormData } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFeesSlice';
import { createStudentFee, fetchFees } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFees.action';

const SingleFee = () => {
  const { classes } = useSelector((store) => store?.admin?.class)
  const { sectionsList } = useSelector((store) => store?.admin?.group_section)
  const { studentsList } = useSelector((store) => store?.admin?.students)
  const { formData, loading } = useSelector((store) => store?.admin?.student_fees)

  const dispatch = useDispatch();

  const [sectionData, setSectionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [classData, setClassData] = useState([]);


  useEffect(() => {
    dispatch(fetchAllClasses())
  }, [dispatch]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      const formattedClassData = classes.map((item) => ({
        value: item.className,
        label: item.className,
      }));
      setClassData(formattedClassData);
    }
  }, [classes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value, name, '---')
    dispatch(setFormData({ ...formData, [name]: value }))
    if (name === 'class') {
      const findClass = classes.find((item) => item.className === value);
      if (findClass) {
        dispatch(fetchSectionsByClass(findClass._id))
        dispatch(fetchStudentsByClassAndSection(findClass._id))
      } else {
        console.log('Class not found');
      }
    }
    if (name === 'section') {
      const section = sectionData.find((item) => item.value === value);
      if (section) {
        dispatch(fetchStudentsByClassAndSection(section.id))
      }
    }

    if (name === 'studentId') {
      console.log("value", value);
      console.log("studentsList--", studentsList);
      const selectedStudent = studentsList.find(student => student._id === value);
      console.log("selectedStudent", selectedStudent);
      if (selectedStudent) {
        dispatch(setFormData({
          ...formData,
          studentId: selectedStudent._id
        }));
      }
    }

    if (name === 'amount') {
      // Ensure that the value is parsed as a number
      const parsedValue = parseFloat(value);

      // If the value is not a valid number, set it to 0 or handle the error
      if (isNaN(parsedValue)) {
        console.warn('Invalid amount');
        return;
      }

      // Update formData with the numeric value
      dispatch(setFormData({ ...formData, amount: parsedValue }));
    } else {
      dispatch(setFormData({ ...formData, [name]: value }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const selectedClass = classes.find(item => item.className === formData.class);
    // dispatch(fetchStudentsByClassAndSection(selectedClass?._id))
    // //const students = await fetchStudentsByClassAndSection(selectedClass?._id);
    const selectedStudent = studentsList.find(item => item._id === formData.studentId);

    if (!selectedStudent) {
      console.warn('No student selected');
      return;
    }

    const submissionData = {
      studentIds: [selectedStudent._id],
      amount: formData.amount,
      dueDate: formData.dueDate,
      feeType: formData.feesType
    }
    dispatch(createStudentFee({ submissionData })).then(() => {
      dispatch(fetchFees())
      dispatch(resetFormData())
      toast.success('Fee record Added');
    })
  };

  useEffect(() => {
    if (sectionsList) {
      setSectionData(
        sectionsList.map((section) => ({
          value: section.sectionName,
          label: section.sectionName,
          id: section._id,
        }))
      );
    }

    if (studentsList) {
      setStudentData(
        studentsList.map((student) => ({
          value: student._id,  // Use student._id as the value
          label: `${student.firstName} ${student.lastName} (ID: ${student.admissionNumber})`,
        }))
      );
    }
  }, [sectionsList, studentsList]);

  return (
    <>
      {loading ? <div className='w-full h-[60vh] flex items-center justify-center'>
        <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
      </div> : <form className="space-y-4" onSubmit={handleSubmit}>
        <div className='flex justify-between px-4'>
          <FormSelect id="class" label="Class" options={classData} value={formData.class} onChange={handleChange} required />
          <FormSelect id="section" label="Section" options={sectionData} value={formData.section} onChange={handleChange} />
        </div>
        <FormSelect id="studentId" label="Student ID" options={studentData} value={formData.studentId} onChange={handleChange} required />
        <FormInput id="feesType" label="Fees Type" type='text' value={formData.feesType} onChange={handleChange} required />
        <FormInput id="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} required />
        <FormInput id="amount" label="Amount" type="number" value={formData.amount} onChange={handleChange} required />
        <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
          Add New Fees
        </button>
      </form>}
    </>

  );
};

export default SingleFee;

