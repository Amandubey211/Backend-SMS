import React, { useEffect, useState } from "react";
import { Select, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollStaff } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import TeacherTimeTable from './components/TeacherTimeTable';
import ClassTimeTable from './components/ClassTimeTable';
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const { Option } = Select;

const MainSection = () => {
    const dispatch = useDispatch();
    const { classes } = useSelector((state) => state?.admin?.class);
    const { sectionsList } = useSelector((state) => state?.admin?.group_section);
    const role = useSelector((store) => store.common.auth.role);

    const [timetableType, setTimetableType] = useState("class");
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teachersList, setTeachersList] = useState([]);

    useEffect(() => {
        dispatch(fetchAllClasses());
        dispatch(fetchPayrollStaff({ type: "teacher" })).then((action) => {
            setTeachersList(action?.payload?.data);
        });
    }, [dispatch]);

    const handleClassChange = async (value) => {
        setSelectedClass(value);
        setSelectedSection(null); // Reset the section when the class changes
        await dispatch(fetchSectionsByClass(value));
    };

    // Get class and section names based on selection
    const selectedClassName = classes?.find((cls) => cls._id === selectedClass)?.className || "";
    const selectedSectionName = sectionsList?.find((sec) => sec._id === selectedSection)?.sectionName || "";

    // Sort classes by numeric value
    const sortedClasses = classes?.slice().sort((a, b) => {
        const classA = parseInt(a.className.match(/\d+/)) || 0;
        const classB = parseInt(b.className.match(/\d+/)) || 0;
        return classA - classB;
    });

    // Sort sections alphabetically
    const sortedSections = sectionsList?.slice().sort((a, b) => {
        return a.sectionName.localeCompare(b.sectionName);
    });

    return (
        <div className="wp-4 space-y-4">
            {/* Timetable Type Selection */}
            <div className="flex space-x-4 items-center">
                <label className="font-medium">Select Timetable Type:</label>
                <Select
                    defaultValue="class"
                    style={{ width: 200 }}
                    onChange={setTimetableType}
                >
                    <Option value="class">Class & Section Wise</Option>
                    <Option value="teacher">Teacher Wise</Option>
                </Select>
            </div>

            {/* Class & Section Selection */}
            {timetableType === "class" && (
                <div className="flex space-x-4 items-center">
                    <label className="font-medium">Select Class:</label>
                    <Select
                        style={{ width: 150 }}
                        onChange={handleClassChange}
                        placeholder="Select Class"
                        value={selectedClass}
                    >
                        {sortedClasses?.map((cls, index) => (
                            <Option key={cls._id || `class-${index}`} value={cls._id}>
                                {cls.className}
                            </Option>
                        ))}
                    </Select>

                    <label className="font-medium">Select Section:</label>
                    <Select
                        style={{ width: 150 }}
                        onChange={setSelectedSection}
                        placeholder="Select Section"
                        value={selectedSection}
                        disabled={!sectionsList?.length}
                    >
                        {sortedSections?.map((sec, index) => (
                            <Option key={sec._id || `section-${index}`} value={sec._id}>
                                {sec.sectionName}
                            </Option>
                        ))}
                    </Select>
                </div>
            )}

            {/* Teacher Selection */}
            {timetableType === "teacher" && (
                <div className="flex space-x-4 items-center">
                    <label className="font-medium">Select Teacher:</label>
                    <Select
                        style={{ width: 200 }}
                        onChange={setSelectedTeacher}
                        placeholder="Select Teacher"
                        value={selectedTeacher}
                    >
                        {teachersList?.map((teacher) => (
                            <Option key={teacher.id} value={teacher.id}>
                                {teacher.firstName + " " + teacher.lastName}
                            </Option>
                        ))}
                    </Select>
                </div>
            )}

            {/* Timetable Components */}
            {timetableType === "class" && selectedClass && selectedSection && (
                <ClassTimeTable
                    selectedClass={selectedClass}
                    selectedSection={selectedSection}
                    selectedClassName={selectedClassName}
                    selectedSectionName={selectedSectionName}
                />
            )}
            {timetableType === "teacher" && selectedTeacher && (
                <TeacherTimeTable selectedTeacher={selectedTeacher} />
            )}
        </div>
    );
};

export default MainSection;
