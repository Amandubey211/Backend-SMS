import React from 'react';

const AssignmentDetail = ({ label, value }) => (
  <div className="mt-4">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-md font-bold text-gray-900">{value}</p>
  </div>
);

export default AssignmentDetail;
