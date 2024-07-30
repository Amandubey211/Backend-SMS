import React from 'react';

const AssignmentDetail = React.memo(({ label, value, extra }) => (
  <div className="mt-4">
    <p className="text-sm text-gray-600">{label}</p>
    <div className="flex items-center">
      <p className="text-md font-semibold text-gray-900">{value}</p>
      {extra && <p className="text-md font-semibold text-gray-900 ml-1">{extra}</p>}
    </div>
  </div>
));

export default AssignmentDetail;
