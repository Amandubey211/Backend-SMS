import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntity } from "../../../../Store/Slices/Finance/entitie/entity.thunk";

const EntitySelect = ({ onSelect, disabled = false, EntityName = "" ,onClose}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(EntityName);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const entities = useSelector((state) => state.admin.entity.entities);

  useEffect(() => {
    dispatch(fetchEntity({ search: "", page: 1, limit: 10000 }));
  }, [dispatch]);

  useEffect(() => {
    
    if (searchText && searchText !== EntityName) {
      const filtered = entities.filter((cat) =>
        cat.entityName?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEntities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredEntities([]);
      setShowDropdown(false);
      setSearchText(EntityName);

    }
    return () =>{
        setShowDropdown(false);
      }
  }, [searchText, entities, EntityName,onClose]);

  return (
    <div className="relative w-full">
      {/* Input Box */}
      <input
        type="text"
        placeholder="Search or Select Entity"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => searchText !== EntityName && setShowDropdown(true)}
        readOnly={disabled}
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Dropdown List */}
      {showDropdown && !disabled && filteredEntities.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40
         overflow-y-auto shadow-lg z-10">
          {filteredEntities.map((Entity) => (
            <li
              key={Entity._id}
              onClick={() => {
               
                setSearchText(Entity.entityName);
                onSelect(Entity);
                setShowDropdown(false);
              
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-200"
            >
              {Entity.entityName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntitySelect;
