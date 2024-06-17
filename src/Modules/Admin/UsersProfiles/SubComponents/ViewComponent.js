import React from 'react';

const ViewComponent = ({ profile, profileDetailsConfig }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      {profileDetailsConfig.map((detail, index) => (
        <div key={index} className="py-2">
          <strong>{detail.label}:</strong> {profile[detail.field]}
        </div>
      ))}
    </div>
  );
};

export default ViewComponent;
