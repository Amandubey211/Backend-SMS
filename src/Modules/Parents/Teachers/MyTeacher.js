import React, { useEffect } from 'react';
import TeacherCards from '../../../Components/Parents/Teachers/TeacherCard';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../../Store/Slices/Parent/Children/children.action'; // Import the thunk
import Spinner from '../../../Components/Common/Spinner';

const MyTeacher = () => {
    const { ssid: studentId } = useParams(); // Get student ID from the route parameters
    const dispatch = useDispatch();
    
    // Access the teacher-related data from Redux state
    const { teachers = [], loading, error } = useSelector((state) => state.Parent.children); // Default empty array for teachers
    
    // Fetch teachers when component mounts or when studentId changes
    useEffect(() => {
        if (studentId) {
            dispatch(fetchTeachers(studentId));
        }
    }, [dispatch, studentId]);

    // Handling the loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner /> {/* Show spinner while data is loading */}
            </div>
        );
    }

    // Handling error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">{error || 'Something went wrong while fetching instructors.'}</p>
            </div>
        );
    }

    // Handling case where no teachers are found
    if (teachers?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">No Instructors Found!</p>
            </div>
        );
    }

    // Render teacher cards if teachers are available
    return (
        <div className="h-full w-full p-4">
            <div className="text-lg font-medium mb-4 flex items-center">
                Child Instructors
                <div
                    className="ml-2 flex items-center justify-center rounded-full"
                    style={{
                        background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)',
                        width: '32px',
                        height: '32px',
                    }}
                >
                    <span
                        style={{
                            background: 'linear-gradient(to right, #C83B62 0%, #7F35CD 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                        className="text-lg font-semibold"
                    >
                        {teachers?.length.toString().padStart(2, '0')} {/* Optional chaining to prevent errors */}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap justify-start">
                {teachers?.map((instructor) => (
                    <TeacherCards key={instructor?.id} instructor={instructor} /> 
                ))}
            </div>
        </div>
    );
};

export default MyTeacher;
