import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SubjectCard from "../../Admin/UsersProfiles/StudentProfile/Components/StudentCourseProgress/allSubjects/SubjectCard";
import MainSection from "./MainSection.js";
import { SubjectCardSkeleton } from "../Skeletons.js";
import {
  fetchCourseProgress,
  fetchStudentSubjectProgress,
} from "../../../Store/Slices/Admin/Users/Students/student.action.js";
import { useParams } from "react-router-dom";
import { Button, Modal } from "antd";
import { fetchSemestersByClass } from "../../../Store/Slices/Parent/Semesters/parentSemester.action";
import { setSelectedSemester } from "../../../Store/Slices/Parent/Semesters/parentSemesterSlice.js";
import Layout from "../../../Components/Common/Layout.js";
import { FaChevronDown, FaRegSadTear } from "react-icons/fa";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";

const AllSubject = () => {
  const { cid, studentId } = useParams();
  const dispatch = useDispatch();
  useNavHeading("My Child", "Courses & Progress");
  const [subjectsFetched, setSubjectsFetched] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null); // Initially null

  // Semester modal state
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Redux store data (admin side for subject progress)
  const { studentSubjectProgress, error } = useSelector(
    (store) => store?.admin?.all_students
  );

  // Redux store data (parent side for semesters)
  const { semesters, selectedSemester, loadingSemesters, errorSemesters } =
    useSelector((store) => store?.Parent?.semesters);

  const semesterId = selectedSemester?._id;

  // Get selected child from Redux
  const selectedChild = useSelector(
    (state) => state.Parent.children.selectedChild
  );

  // Fetch semesters when selected child is available
  useEffect(() => {
    if (cid) {
      dispatch(fetchSemestersByClass({ classId: cid })).then((response) => {
        const fetchedSemesters = response.payload;
        dispatch(setSelectedSemester({ _id: fetchedSemesters[0]._id, title: fetchedSemesters[0].title }));
      });
    }
  }, [dispatch, cid]);

  // Fetch the student's subjects and set the default selected subject
  useEffect(() => {
    dispatch(fetchStudentSubjectProgress(studentId))
      .unwrap()
      .then((response) => {
        // After subjects are fetched, set the first subject as default if not already set
        if (response && response.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(response[0].subjectId);
        }
      })
      .finally(() => {
        setSubjectsFetched(true);
      });
  }, [dispatch, studentId, selectedSubjectId]);

  // Fetch course progress when selectedSubjectId or semester changes
  useEffect(() => {
    if (selectedSubjectId && semesterId && studentSubjectProgress?.length > 0) {
      setModuleLoading(true);

      dispatch(
        fetchCourseProgress({
          studentId,
          subjectId: selectedSubjectId,
          semesterId,
        })
      )
        .unwrap()
        .finally(() => setModuleLoading(false));

    }
  }, [dispatch, selectedSubjectId, semesterId]);

  // Handler when user selects a subject
  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
  };

  // Handler for selecting a semester from the modal
  const handleSemesterSelect = (sem) => {
    dispatch(setSelectedSemester({ _id: sem._id, title: sem?.title }));
    setSemesterModalVisible(false);
  };

  // While fetching subjects, show skeleton
  if (!subjectsFetched) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <SubjectCardSkeleton />
      </div>
    );
  }

  // If there was an error fetching subjects, show error message
  if (error) {
    const errorMessage =
      typeof error === "object"
        ? error.message || JSON.stringify(error)
        : error;
    return (
      <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-xl">
        <FiAlertCircle className="text-[3rem]" />
        {errorMessage}
      </div>
    );
  }

  // If no subjects exist, show full-panel "No Subjects Found" view
  if (!studentSubjectProgress || studentSubjectProgress.length === 0) {
    return (
      <Layout title="Parents | Child Courses & Progress">
        <div className="w-full h-[80vh] flex flex-col items-center justify-center text-gray-500">
          <BsFillJournalBookmarkFill className="text-6xl mb-4" />
          <p className="text-2xl font-bold">No subjects found.</p>
          <p>Please check back later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Parents | Child Courses & Progress">
      <div className="w-full">
        <div className="flex w-full flex-row">
          {/* LEFT: Subject Cards */}
          <div className="flex flex-col gap-2 p-2 w-[25%] border-r border-gray-300 min-h-[100vh]">
            {/* Semester Button */}
            <Button
              type="default"
              onClick={() => setSemesterModalVisible(true)}
              className="w-full border border-pink-400 bg-white text-black rounded-md font-semibold text-sm mt-2 mb-1
                         hover:bg-pink-400 hover:text-pink-900 transition-colors duration-200 flex items-center justify-between"
            >
              <span>
                {selectedSemester?.title
                  ? selectedSemester?.title
                  : "Select Semester"}
              </span>
              <FaChevronDown className="ml-2" />
            </Button>

            {/* Subject Cards */}
            {studentSubjectProgress?.map((subject, index) => (
              <div
                key={subject.subjectId}
                onClick={() => handleSubjectClick(subject.subjectId)}
                className={`
                  bg-white
                  rounded-lg
                  cursor-pointer
                  duration-200
                `}

              >
                <SubjectCard subject={subject} i={index} subjectColor={studentSubjectProgress[index]?.subjectColor} selectedSubject={selectedSubjectId} />
              </div>
            ))}
          </div>

          {/* RIGHT: Modules & Chapters */}
          <div className="w-[75%]">
            <MainSection
              selectedSubjectId={selectedSubjectId}
              studentId={studentId}
              moduleLoading={moduleLoading}
            />
          </div>
        </div>

        {/* SEMESTER SELECTION MODAL */}
        <Modal
          visible={semesterModalVisible}
          onCancel={() => setSemesterModalVisible(false)}
          footer={null}
          title="Select Semester"
          bodyStyle={{ padding: "1rem" }}
          destroyOnClose
        >
          {loadingSemesters ? (
            <div className="flex justify-center items-center">
              <span>Loading semesters...</span>
            </div>
          ) : errorSemesters ? (
            <div className="text-red-500 text-center">
              Failed to load semesters. Please try again.
            </div>
          ) : (
            <div className="space-y-2">
              {semesters && semesters.length > 0 ? (
                semesters?.map((sem) => (
                  <Button
                    key={sem._id}
                    onClick={() => handleSemesterSelect(sem)}
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${selectedSemester?._id === sem._id
                      ? "bg-purple-100 border-purple-400"
                      : "bg-white hover:bg-purple-50"
                      }`}
                  >
                    {sem.title}
                  </Button>
                ))
              ) : (
                <p className="text-center">No semesters available.</p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default AllSubject;