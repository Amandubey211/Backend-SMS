import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../subClass/component/FormInput';
import FormSelect from '../subClass/component/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { fetchAllClasses } from '../../../../Store/Slices/Admin/Class/actions/classThunk';
import { fetchSectionsByClass } from '../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks';
import { fetchStudentsByClassAndSection } from '../../../../Store/Slices/Admin/Class/Students/studentThunks';
import { resetFormData, setFormData } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFeesSlice';
import { createStudentFee, fetchFees } from '../../../../Store/Slices/Admin/Accounting/StudentFees/studentFees.action';

const SingleFee = () => {
  const { t } = useTranslation("admExpense"); // Use translation hook
  const dispatch = useDispatch();

  const { classes } = useSelector((store) => store?.admin?.class);
  const { sectionsList } = useSelector((store) => store?.admin?.group_section);
  const { studentsList } = useSelector((store) => store?.admin?.students);
  const { formData, loading } = useSelector((store) => store?.admin?.student_fees);

  const [sectionData, setSectionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  useEffect(() => {
    if (classes && classes?.length > 0) {
      const formattedClassData = classes?.map((item) => ({
        value: item.className,
        label: item.className,
      }));
      setClassData(formattedClassData);
    }
  }, [classes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));

    if (name === 'class') {
      const findClass = classes.find((item) => item.className === value);
      if (findClass) {
        dispatch(fetchSectionsByClass(findClass._id));
        dispatch(fetchStudentsByClassAndSection(findClass._id));
      } else {
        // console.log('Class not found');
      }
    }

    if (name === 'section') {
      const section = sectionData.find((item) => item.value === value);
      if (section) {
        dispatch(fetchStudentsByClassAndSection(section.id));
      }
    }

    if (name === 'studentId') {
      const selectedStudent = studentsList.find(student => student._id === value);
      if (selectedStudent) {
        dispatch(setFormData({
          ...formData,
          studentId: selectedStudent._id
        }));
      }
    }

    if (name === 'amount') {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        console.warn('Invalid amount');
        return;
      }
      dispatch(setFormData({ ...formData, amount: parsedValue }));
    } else {
      dispatch(setFormData({ ...formData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedStudent = studentsList.find(item => item._id === formData.studentId);

    if (!selectedStudent) {
      console.warn('No student selected');
      return;
    }

    const submissionData = {
      studentIds: [selectedStudent._id],
      amount: formData.amount,
      dueDate: formData.dueDate,
      feeType: formData.feesType,
    };

    dispatch(createStudentFee({ submissionData }))
      .then(() => {
        dispatch(fetchFees());
        dispatch(resetFormData());
        toast.success(t('Fee record Added'));
      })
      .catch(() => {
        toast.error(t('Error adding Fees'));
      });
  };

  useEffect(() => {
    if (sectionsList) {
      setSectionData(
        sectionsList?.map((section) => ({
          value: section.sectionName,
          label: section.sectionName,
          id: section._id,
        }))
      );
    }

    if (studentsList) {
      setStudentData(
        studentsList?.map((student) => ({
          value: student._id,
          label: `${student.firstName} ${student.lastName} (ID: ${student.admissionNumber})`,
        }))
      );
    }
  }, [sectionsList, studentsList]);

  return (
    <>
      {loading ? (
        <div className='w-full h-[60vh] flex items-center justify-center'>
          <FiLoader className="animate-spin mr-2 w-[3rem] h-[3rem]" />
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className='flex justify-between px-4'>
            <FormSelect
              id="class"
              label={t('Class')}
              options={classData}
              value={formData.class}
              onChange={handleChange}
              required
            />
            <FormSelect
              id="section"
              label={t('Section')}
              options={sectionData}
              value={formData.section}
              onChange={handleChange}
            />
          </div>
          <FormSelect
            id="studentId"
            label={t('Student ID')}
            options={studentData}
            value={formData.studentId}
            onChange={handleChange}
            required
          />
          <FormInput
            id="feesType"
            label={t('Fees Type')}
            type='text'
            value={formData.feesType}
            onChange={handleChange}
            required
          />
          <FormInput
            id="dueDate"
            label={t('Due Date')}
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <FormInput
            id="amount"
            label={t('Amount')}
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
          >
            {t('Add New Fees')}
          </button>
        </form>
      )}
    </>
  );
};

export default SingleFee;
