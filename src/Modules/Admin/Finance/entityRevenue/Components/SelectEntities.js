import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntity } from "../../../../../Store/Slices/Finance/entitie/entity.thunk";

const SidebarEntitySelection = ({ entitiesIds, setEntitiesIds }) => {
  const dispatch = useDispatch();
  const { entities, loading } = useSelector((store) => store.admin.entity);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchEntity({ search: searchText, page: 1, limit: 10000 }));
  }, [dispatch, searchText]);

  const handleEntityCheckboxChange = (e, entityId) => {
    if (e.target.checked) {
      setEntitiesIds((prevIds) => [...prevIds, entityId]);
    } else {
      setEntitiesIds((prevIds) => prevIds.filter((id) => id !== entityId));
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setEntitiesIds(entities.map((entity) => entity._id));
    } else {
      setEntitiesIds([]);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={entitiesIds?.length === entities?.length}
            onChange={handleSelectAllChange}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">
            Select All Entities
          </span>
        </label>
        <input
          type="text"
          placeholder="Search entities..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm w-1/2 sm:w-1/3 text-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities?.map((e) => (
          <div
            key={e._id}
            className="flex flex-col items-start p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg"
          >
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={entitiesIds.includes(e._id)}
                onChange={(event) => handleEntityCheckboxChange(event, e._id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium">{e.entityName}</span>
            </label>
            <p className="text-xs mt-1 opacity-80">{e?.entityType}</p>
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-center mt-4 text-gray-500">
          Loading entities...
        </div>
      )}
    </div>
  );
};

export default SidebarEntitySelection;
