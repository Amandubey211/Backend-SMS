import React, { useEffect, useState } from "react";
import { Select, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayrollStaff } from "../../../../Store/Slices/Finance/payroll/payroll.thunk";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import TeacherTimeTable from './components/TeacherTimeTable';
import ClassTimeTable from './components/ClassTimeTable';
import SchoolTimeTable from './components/SchoolTimeTable';
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";

const { Option } = Select;

const MainSection = () => {
    const dispatch = useDispatch();
    const { classes } = useSelector((state) => state?.admin?.class);
    const { sectionsList } = useSelector((state) => state?.admin?.group_section);
    const [timetableType, setTimetableType] = useState("school");
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
        <div className="p-4 space-y-4">
            {/* Timetable Type Selection */}
            <div className="flex space-x-4 items-center">
                <label className="font-medium">Select Timetable Type:</label>
                <Select
                    defaultValue="school"
                    style={{ width: 200 }}
                    onChange={setTimetableType}
                >
                    <Option value="school">All</Option>
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
                        value={selectedClass} // Bind the selected value
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
                        value={selectedSection} // Bind the selected value
                        disabled={!sectionsList?.length} // Disable if no sections are available
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
                        value={selectedTeacher} // Bind the selected value
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
                />
            )}
            {timetableType === "teacher" && selectedTeacher && (
                <TeacherTimeTable selectedTeacher={selectedTeacher} />
            )}
            {timetableType === "school" && (
                <SchoolTimeTable />
            )}
        </div>
    );
};

export default MainSection;
