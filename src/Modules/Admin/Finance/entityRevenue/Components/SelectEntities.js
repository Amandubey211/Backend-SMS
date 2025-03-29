import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntity } from "../../../../../Store/Slices/Finance/entitie/entity.thunk";

const SidebarEntitySelection = ({ entitiesIds, setEntitiesIds }) => {
  const dispatch = useDispatch();
  const { entities, loading, total, totalPages, page } = useSelector(
    (store) => store.admin.entity
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchEntity({ search: searchText, page: 1, limit: 10000 }));
  }, [dispatch, searchText]);

  // Handle individual entity checkbox change
  const handleEntityCheckboxChange = (e, entityId) => {
    if (e.target.checked) {
      // Add entity ID to the list
      setEntitiesIds((prevIds) => [...prevIds, entityId]);
    } else {
      // Remove entity ID from the list
      setEntitiesIds((prevIds) => prevIds.filter((id) => id != entityId));
    }
    console.log(e.target.checked,entityId);
    
  };

  // Handle Select All checkbox change
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Select all entities
      setEntitiesIds(entities.map((entity) => entity._id));
    } else {
      // Deselect all entities
      setEntitiesIds([]);
    }
  };

  return (
    <div className="p-4 w-full">
      <label>
        <input
          type="checkbox"
          checked={entitiesIds?.length === entities?.length}
          onChange={handleSelectAllChange}
        />
        <span className="text-sm m-1 cursor-pointer">Select All Entities</span>
      </label>
      <div className="flex w-[99%] flex-wrap gap-8 border border-gray-200 h-full rounded-lg p-2 overflow-y-auto">
        {entities?.map((e) => (
          <div
            key={e._id}
            className="w-auto h-[3rem] flex items-start px-2 justify-center flex-col bg-purple-500 text-white text-sm rounded-lg"
          >
            <label>
              <input
                type="checkbox"
                checked={entitiesIds.includes(e._id)}
                onChange={(event) => handleEntityCheckboxChange(event, e._id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="pl-2 cursor-pointer">{e.entityName}</span>
            </label>
            <p>{e?.entityType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarEntitySelection;
