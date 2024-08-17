import React, { useState, useEffect } from 'react';
import TeacherCards from '../../../Components/Parents/Teachers/TeacherCard';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';
import Spinner from '../../../Components/Common/Spinner'; // Importing the Spinner component
import { FaChalkboardTeacher } from 'react-icons/fa'; // Importing an icon for the "No Teachers Found" state

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

                setTeachers(response.data.instructors); // Assuming the data is an array of teachers
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
                <Spinner /> {/* Show spinner while loading */}
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
        <div className="h-full w-full">
            <div className="w-full p-2">
                <div className="flex-wrap flex items-start">
                    {instructors.map(instructor => (
                        <TeacherCards key={instructor.id} instructor={instructor} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyTeacher;
