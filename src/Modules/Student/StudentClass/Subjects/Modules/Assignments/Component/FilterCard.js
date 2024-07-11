import React, { useState } from 'react';

const FilterCard = () => {
  const [publishStatus, setPublishStatus] = useState('publish');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      {/* <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="publishStatus"
            value="publish"
            checked={publishStatus === 'publish'}
            onChange={() => setPublishStatus('publish')}
            className="form-radio h-5 w-5 text-green-600"
          />
          <span className="ml-2 text-green-600">Publish</span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input
            type="radio"
            name="publishStatus"
            value="unpublish"
            checked={publishStatus === 'unpublish'}
            onChange={() => setPublishStatus('unpublish')}
            className="form-radio h-5 w-5 text-red-600"
          />
          <span className="ml-2 text-red-600">Unpublish</span>
        </label>
      </div> */}
      <div className="mb-4">
        <label className="block text-gray-700">Module</label>
        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>Select</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Chapter</label>
        <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>Select</option>
        </select>
      </div>
      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md focus:outline-none">Apply</button>
    </div>
  );
};

export default FilterCard;
