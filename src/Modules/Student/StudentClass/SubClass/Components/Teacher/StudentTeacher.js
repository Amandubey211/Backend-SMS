// StudentTeacher.jsx  (listing page)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Student/StudentDashLayout";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import Spinner from "../../../../../../Components/Common/Spinner";
import SidebarSlide from "../../../../../../Components/Common/SidebarSlide";
import ProfileCard from "./ProfileCard";
import TeacherModal from "./TeacherModal";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { stdClassTeacher } from "../../../../../../Store/Slices/Student/MyClass/Class/classTeacher/classTeacher.action";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";

const StudentTeacher = () => {
  const dispatch = useDispatch();
  const { classId } = useParams();
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  /* ----------------- global state ----------------- */
  const { classData } = useSelector((s) => s.student.studentClass);
  const { teacherData, loading, error } = useSelector(
    (s) => s.student.studentClassTeacher
  );

  /* ----------------- nav heading ------------------ */
  useNavHeading(`${classData?.className ?? ""}`, "Class Teachers");

  /* ----------------- fetch teachers --------------- */
  useEffect(() => {
    dispatch(stdClassTeacher({ classId }));
  }, [dispatch, classId]);

  /* ----------------- helpers ---------------------- */
  const handleDismiss = () => dispatch(setShowError(false));
  const openModal = (teacher) => setSelectedTeacher(teacher);
  const closeModal = () => setSelectedTeacher(null);

  /* ----------------- render ----------------------- */
  return (
    <Layout title="My Class Teachers">
      <DashLayout>
        <section className="p-4">
          {/* grid list */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : teacherData?.length ? (
            <div
              className="
                grid gap-4
                grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]
              "
            >
              {teacherData.map((t) => (
                <ProfileCard
                  key={t.teacherId || t.id}
                  profile={t}
                  onClick={() => openModal(t)}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-20">
              <NoDataFound title="Teachers" />
            </div>
          )}
        </section>

        {/* teacher quick view */}
        {selectedTeacher && (
          <SidebarSlide
            isOpen={Boolean(selectedTeacher)}
            onClose={closeModal}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                Quick View of Teacher
              </span>
            }
            width="30%"
          >
            <TeacherModal teacher={selectedTeacher} />
          </SidebarSlide>
        )}
      </DashLayout>
    </Layout>
  );
};

export default StudentTeacher;
