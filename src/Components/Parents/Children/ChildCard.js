import React from 'react';
import { useNavigate } from "react-router-dom";
import rightArrow from '../../../Assets/ParentAssets/svg/right-arrow.svg'; // Ensure this path is correct

const ChildCard = ({ student }) => {
    const navigate = useNavigate();

    // Define styles for the primary button container with increased width
    const primaryButtonContainerStyle = {
        background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)',
        borderRadius: '5px',
        padding: '8px 24px', // Increased padding to make buttons longer
        display: 'inline-block',
        margin: '0 10px', // Space between button containers
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease-in-out',
        width: '100%', // Make buttons take up the full width
        textAlign: 'center',
    };

    // Define styles for the primary button text with gradient and increased font weight
    const primaryButtonTextGradientStyle = {
        background: 'linear-gradient(to right, #C83B62, #7F35CD)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '600', // Increased thickness of the text
        fontSize: '14px',
        textTransform: 'uppercase',
    };

    // Define styles for the secondary button with more spacing and full width
    const secondaryButtonStyle = {
        background: '#E9F8EB',
        color: '#0D9755',
        padding: '12px 24px', // Adjusted padding for a bigger button
        borderRadius: '8px',
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: '600', // Increased thickness of the text
        transition: 'box-shadow 0.3s ease-in-out',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '16px', // Increased space between primary buttons and this button
        width: '100%', // Make the button take up the full width
    };

    const arrowIconStyle = {
        marginLeft: '8px',
        fill: '#0D9755',
    };

    // Define styles for the card container with thin border and shadow on hover
    const cardStyle = {
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Initial light shadow
        borderRadius: '10px',
        border: '1px solid #E5E7EB', // Thin border
        padding: '24px', // Increased padding for more space inside the card
        margin: '20px', // Increased margin to better align with the grid
        transition: 'box-shadow 0.3s ease-in-out',
    };

    return (
        <div
            className="bg-white rounded-lg"
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0px 8px 16px rgba(0, 0, 0, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)')}
        >
            <div className="flex flex-col items-center">
                <img className="w-24 h-24 rounded-full mb-6" src={student.profile} alt={student.name} />
                <p className="font-semibold text-center mb-6 text-lg">{student.name}</p>
                <div className="flex justify-center items-center mb-6 space-x-4 text-sm text-gray-600">
                    <p>Class: <span className="font-semibold">{student.class || 'N/A'}</span></p>
                    <p>ID: <span className="font-semibold">{student.admissionNumber || 'N/A'}</span></p>
                    <p>Section: <span className="font-semibold">{student.section || 'N/A'}</span></p>
                    <p>Group: <span className="font-semibold">{student.group || 'N/A'}</span></p>
                </div>
                <div className="flex justify-between space-x-2 mb-4 w-full">
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate("/teacher")}
                    >
                        <div style={primaryButtonTextGradientStyle}>Instructors</div>
                    </div>
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate(`/childgrade/${student.id}`)}
                    >
                        <div style={primaryButtonTextGradientStyle}>Grades</div>
                    </div>
                    <div
                        style={primaryButtonContainerStyle}
                        onClick={() => navigate("/attendance")}
                    >
                        <div style={primaryButtonTextGradientStyle}>Attendance</div>
                    </div>
                </div>
                <div
                    style={secondaryButtonStyle}
                    onClick={() => navigate(`/checkprogress/${student.id}`)}
                >
                    Check Subject Progress
                    <img src={rightArrow} alt="Right Arrow" style={arrowIconStyle} />
                </div>
            </div>
        </div>
    );
};

export default ChildCard;
