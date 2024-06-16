import React from 'react';

const ListComponent = ({ items, handleItemClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, index) => (
        <div key={index} className="p-4 border rounded" onClick={() => handleItemClick(item)}>
          <h3>{item.name}</h3>
          <p>{item.detail}</p>
        </div>
      ))}
    </div>
  );
};

export default ListComponent;
