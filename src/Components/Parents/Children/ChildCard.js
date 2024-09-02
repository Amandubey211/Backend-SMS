import React from 'react';
import { useNavigate } from "react-router-dom";

const ChildCard = ({ student }) => {
    const navigate = useNavigate();
    
    // Define styles for the primary button container
    const primaryButtonContainerStyle = {
        background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)', // Gradient background
        borderRadius: '5px',  // Rounded corners for the container
        padding: '8px', // Padding inside the container
        display: 'inline-block', // Inline to ensure buttons are side by side
        margin: '0 5px', // Space between button containers
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease-in-out', // Transition for shadow
    };

    // Define styles for the primary button text
    const primaryButtonStyle = {
        color: '#C83B62', // Text color
        textTransform: 'uppercase',
        display: 'inline-block',
        textAlign: 'center',
        width: 'auto',
    };

    // Define styles for the secondary button
    const secondaryButtonStyle = {
        background: '#E9F8EB',
        color: '#228B22',
        padding: '10px 20px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        transition: 'box-shadow 0.3s ease-in-out', // Transition for shadow
        cursor: 'pointer',
        margin: '0 10px',
        display: 'inline-block',
        textAlign: 'center',
        width: 'auto',
    };

    // Define styles for the card container with hover effect
    const cardStyle = {
        backgroundColor: 'white',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '20px',
        margin: '10px',
        transition: 'box-shadow 0.3s ease-in-out', // Transition for shadow
    };

    return (
        <div
            className="bg-white shadow-xl backdrop-blur-md border-[1px] rounded-lg p-6 m-4"
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)')}
        >
            <div className="flex flex-col items-center">
                {/* Profile image centered at the top */}
                <img className="w-16 h-16 rounded-full mb-4" src={student.profile} alt={student.name} />
            
                <p className="font-semibold text-center mb-4">{student.name}</p>

                {/* Align student details in one row */}
                <div className="flex justify-center items-center mb-4 space-x-4 text-sm text-gray-600">
                    <p>Class: <span className="font-semibold">{student.class || 'N/A'}</span></p>
                    <p>ID: <span className="font-semibold">{student.admissionNumber || 'N/A'}</span></p>
                    <p>Section: <span className="font-semibold">{student.section || 'N/A'}</span></p>
                    <p>Group: <span className="font-semibold">{student.group || 'N/A'}</span></p>
                </div>

                {/* Button containers with background color - aligned horizontally */}
                <div className="flex justify-center space-x-2 mb-4">
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate("/teacher")}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    >
                        <div style={primaryButtonStyle}>Instructors</div>
                    </div>
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate(`/childgrade/${student.id}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    >
                        <div style={primaryButtonStyle}>Grades</div>
                    </div>
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate("/attendance")}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                    >
                        <div style={primaryButtonStyle}>Attendance</div>
                    </div>
                </div>

                {/* Secondary button */}
                <div
                    style={secondaryButtonStyle}
                    onClick={() => navigate(`/checkprogress/${student.id}`)}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                    Check Subject Progress
                </div>
            </div>
        </div>
    );
};

export default ChildCard;
