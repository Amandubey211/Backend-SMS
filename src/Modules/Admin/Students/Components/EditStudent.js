import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { editStudents } from "../../../../Store/Slices/Admin/Users/Students/student.action";
import { useParams } from "react-router-dom";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import toast from "react-hot-toast";

const EditStudent = ({ studentId,  handleUpdateSidebarClose,onFilterChange}) => {
  
  const { classes } = useSelector((store) => store?.admin?.class);
  const { cid } = useParams();
  const { sectionsList, loading } = useSelector((store) => store?.admin?.group_section);
  const [selectClass, setSelectClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectSection, setSelectSection] = useState(null);

  const dispatch = useDispatch();

  const handleClassChange = (e) => {
    const { value } = e.target;
    setSelectClass(value);
    dispatch(fetchSectionsByClass(value));
  };

  const handleSectionChange = (e) => {
    const { value } = e.target;
    setSelectSection(value);
  };

  const handleSubmit = async () => {
    if(selectClass){
    await dispatch(editStudents({ id: studentId, data: { classId: selectClass, sectionId: selectSection } }));
    handleUpdateSidebarClose();
    onFilterChange('classId', '');
    setIsModalOpen(false);}else{
      toast.error('Please select a class')
    }
  };

  useEffect(() => { 
    setSelectClass(null);
    setSelectSection(null);
    setSelectClass(null);
    setSelectSection(null);
    dispatch(fetchAllClasses());
 
  }, [dispatch,studentId]);


  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700"
          >
            Select Class
          </label>
          <select
            id="class"
            required
            value={selectClass || ''}
            onChange={handleClassChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" >Select</option>
            {classes?.map((c) => (
              <option key={c?._id} value={c._id} >
                {c?.className}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-700"
          >
            Select Section
          </label>
          <select
            id="section"
            disabled={loading}
            value={selectSection || ''}
            onChange={handleSectionChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select</option>
            {sectionsList?.map((s) => (
              <option key={s?._id} value={s._id}>
                {s?.sectionName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button" // Set the button type to "button" to avoid default form submission
          onClick={(e) => {
            e.stopPropagation();
           setIsModalOpen(true)
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-400 hover:bg-purple-600 "
        >
          Submit
        </button>
      </form>
      <DeleteConfirmatiomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={()=>handleSubmit()}
        text="Move"
      />
    </div>
  );
};

export default EditStudent;
