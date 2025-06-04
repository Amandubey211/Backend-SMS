import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAscTimetable } from '../../../../Store/Slices/Parent/TimeTable/parentTimeTable.action';
import { Tag } from 'antd';



const AscTimeTableView = ({ selectedClass, selectedSection }) => {
    const dispatch = useDispatch();
    const { ascTimeTable, loading, error } = useSelector(
        (state) => state.Parent.parentTimetable
    );

    useEffect(() => {
        dispatch(
            fetchAscTimetable({
                classId: selectedClass,
                sectionId: selectedSection,
            })
        );
    }, [dispatch, selectedClass, selectedSection]);
    const getColorForTeachers = (teachers) => {
        if (!teachers || teachers.length === 0) return 'bg-red-300';
        return 'bg-white';
    };

    const AllData = ascTimeTable?.data || [];
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {AllData?.length >= 1 ? (
                AllData.map((data, index) => (
                    <div
                        key={index}
                        className="p-6 bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xl font-semibold text-gray-800 mb-1">
                                    Class Timetable
                                </p>
                                <p className="text-gray-500">
                                    Timings: <span className="font-medium">{data.startTime || 'N/A'}</span> to{' '}
                                    <span className="font-medium">{data.endTime || 'N/A'}</span>
                                </p>
                                <div className="mt-2">
                                    {data?.days?.map((day, index) => (
                                        <Tag key={index} color="blue" className="mb-1">
                                            {day}
                                        </Tag>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <table className="w-full table-auto border border-gray-300 rounded-md">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-left">
                                    <th className="px-4 py-2 border text-center">Time</th>
                                    <th className="px-4 py-2 border text-center">Subject</th>
                                    <th className="px-4 py-2 border text-center">Teacher</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.generatedTimeTabel?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition duration-200"
                                    >
                                        <td className="px-4 py-2 border text-center">{item?.timing?.startTime || ''} - {item?.timing?.endTime || ''}</td>
                                        <td className="px-4 py-2 border text-center">{item?.subjectName || '-'}</td>
                                        <td className={`px-4 py-2 border text-center ${getColorForTeachers(item?.teacherName)}`}>
                                            {item?.teacherName || 'Not Assigned'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="w-full p-8 bg-white rounded-lg shadow-md flex flex-col items-center">
                        <span className="text-6xl mb-4">📜</span>
                        <p className="text-lg font-medium text-gray-700">Timetable Not Available</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AscTimeTableView


