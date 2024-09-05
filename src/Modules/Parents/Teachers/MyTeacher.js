import React, { useState, useEffect } from 'react';
import TeacherCards from '../../../Components/Parents/Teachers/TeacherCard';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';
import Spinner from '../../../Components/Common/Spinner';
import { FaChalkboardTeacher } from 'react-icons/fa';

const MyTeacher = () => {
    const [instructors, setTeachers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                const token = localStorage.getItem('parent:token');

                if (!userData) {
                    throw new Error("No user data found");
                }

                const { email } = userData;

                if (!token) {
                    throw new Error("No token found");
                }
                if (!email) {
                    throw new Error("No guardian email found");
                }

                const response = await axios.get(`${baseUrl}/parent/api/instructors?guardianEmail=${encodeURIComponent(email)}`, {
                    headers: {
                        'Authentication': `${token}`
                    }
                });

                if (!response.data || !response.data.instructors || response.data.instructors.length === 0) {
                    throw new Error("No teachers data found");
                }

                setTeachers(response.data.instructors); 
            } catch (error) {
                console.error('Failed to fetch teachers:', error);
                setError("Unable to fetch teachers");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner /> 
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (instructors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">No Teachers Found</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full p-4">
            <div className="text-lg font-medium mb-4 flex items-center"> {/* Reduced size here */}
                Child Instructors
                <div
                    className="ml-2 flex items-center justify-center rounded-full"
                    style={{
                        background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)', // Background of the circle
                        width: '32px', // Reduced circle size
                        height: '32px', // Reduced circle size
                    }}
                >
                    <span
                        style={{
                            background: 'linear-gradient(to right, #C83B62 0%, #7F35CD 100%)', // Gradient text color
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                        className="text-lg font-semibold"
                    >
                        {instructors.length.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {instructors.map(instructor => (
                    <TeacherCards key={instructor.id} instructor={instructor} />
                ))}
            </div>
        </div>
    );
};

export default MyTeacher;
