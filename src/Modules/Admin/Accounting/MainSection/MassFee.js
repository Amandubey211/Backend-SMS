import React, { useEffect, useState } from 'react';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../../../config/Common';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { fetchAllClasses } from '../../../../Store/Slices/Admin/Class/actions/classThunk';
import { fetchSectionsByClass } from '../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks';
import { fetchStudentsByClassAndSection } from '../../../../Store/Slices/Admin/Class/Students/studentThunks';
import { createStudentFee, fetchFees } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFees.action';
import { resetFormData, setFormData } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFeesSlice';
const MassFee = () => {
  const dispatch = useDispatch();
  const [sectionData, setSectionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [classData, setClassData] = useState([]);

  //const [loading, setLoading] = useState(false);
  const { classes } = useSelector((store) => store?.admin?.class)
  const { sectionsList } = useSelector((store) => store?.admin?.group_section)
  const { studentsList } = useSelector((store) => store?.admin?.students)
  const { formData, loading } = useSelector((store) => store?.admin?.student_fees)

  //const { classList, sectionsList } = useSelector((store) => store.Class);
  //const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetchClasses();
  //     setClassData(classes.map((item) => ({
  //       value: item.className,
  //       label: item.className
  //     })));
  //   };
  //   fetchData();
  // }, []);

  // const [formData, setFormData] = useState({
  //   class: '',
  //   section: '',
  //   studentId: '',
  //   feesType: '',
  //   dueDate: '',
  //   amount: 0
  // });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'class') {
      const findClass = classes.find((item) => item?.className === value);
      if (findClass) {
        dispatch(fetchSectionsByClass(findClass?._id));
        dispatch(fetchStudentsByClassAndSection(findClass?._id))
      } 
    }
    if (name === 'section') {
      const section = sectionData.find((item) => item?.value === value);
      if(section){
        dispatch(fetchStudentsByClassAndSection(section?.id))
      }
    }
    if (name === 'amount') {
      console.log("typeof", typeof (value));

      // Ensure that the value is parsed as a number
      const parsedValue = parseFloat(value);
      console.log("typeof", typeof (parsedValue));
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
    console.log('Submitting Mass Fee:', formData);

    const selectedStudents = studentsList.map((item) => { return item._id });
    console.log("selectedStudents", selectedStudents);

    const submissionData = {
      studentIds: selectedStudents,
      amount: formData?.amount,
      dueDate: formData?.dueDate,
      feeType: formData?.feesType
    }

    if (submissionData) {
      dispatch(createStudentFee({ submissionData })).then(() => {
        dispatch(fetchFees())
        dispatch(resetFormData())
        toast.success('Fee record Added');
      }).catch(() => {
        toast.error('Error adding Fees')
      })
    }
  };

  useEffect(() => {
    if (sectionsList) {
      setSectionData(
        sectionsList.map((section) => ({
          value: section?.sectionName,
          label: section?.sectionName,
          id: section?._id,
        }))
      );
    }
  }, [sectionsList]);


  return (
    <>{loading ? <div className='w-full h-[60vh] flex items-center justify-center'>
      <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem] " />
    </div> : <form className="space-y-4" onSubmit={handleSubmit}>
      <div className='flex justify-between px-4'>
        <FormSelect id="class" label="Class" options={classData} value={formData.class} onChange={handleChange} required />
        <FormSelect id="section" label="Section" options={sectionData} value={formData.section} onChange={handleChange} />
      </div>
      <FormInput id="feesType" label="Fees Type" type='text' value={formData.feesType} onChange={handleChange} required />
      <FormInput id="dueDate" label="Due Date" type="date" value={formData.dueDate} onChange={handleChange} required />
      <FormInput id="amount" label="Amount" type="number" value={formData.amount} onChange={handleChange} required />
      <button type="submit" className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600">
        Add New Fees
      </button>
    </form>}</>
  );
};

export default MassFee;

