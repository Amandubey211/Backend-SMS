import React, { useState, useEffect } from 'react';
import TeacherCards from '../../../Components/Parents/Teachers/TeacherCard';
import axios from 'axios';
import { baseUrl } from '../../../config/Common';

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

                if (!response.data) {


                    throw new Error("No teachers data found");
                }
                console.log(response.data.instructors)

                setTeachers(response.data.instructors); // Assuming the data is an array of teachers
            } catch (error) {
                console.error('Failed to fetch teachers:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="h-full w-full">
            <div className="w-full p-2">
                <div className="flex-wrap flex items-start">
                    {instructors.map(instructors => (
                        <TeacherCards key={instructors.id} instructors={instructors} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyTeacher;
