import React from 'react';

const Day = ({ date, status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Attend':
        return 'bg-green-200 text-green-600';
      case 'Absent':
        return 'bg-red-200 text-red-600';
      case 'Leave':
        return 'bg-purple-200 text-purple-600';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 m-2 rounded-lg ${getStatusStyle(status)}`}>
      <span>{date}</span>
      <span>{status}</span>
    </div>
  );
};

export default Day;
