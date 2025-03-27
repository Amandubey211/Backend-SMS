import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Popover, Button } from "antd";
import {
  EditOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { BsPatchCheckFill } from "react-icons/bs";
import { BiDotsVertical } from "react-icons/bi";
import { deleteModule } from "../../../../../../Store/Slices/Admin/Class/Module/moduleThunk";
import DeleteModal from "../../../../../../Components/Common/DeleteModal";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../../config/permission";

const ModuleCard = ({ module, onSelect, onEdit, onMove }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { sid } = useParams();

  // Access selected module from the Redux store
  const { selectedModule } = useSelector((state) => state.admin.module);

  // Check if this module is the selected one
  const isSelected = selectedModule && selectedModule.moduleId === module._id;

  const handleDelete = async () => {
    try {
      await dispatch(deleteModule({ sid, moduleId: module._id }));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  };

  const menuContent = (
    <div className="w-40">
      <ProtectedAction requiredPermission={PERMISSIONS.EDIT_MODULE}>
        <Button
          type="text"
          block
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-left flex items-center"
        >
          Edit
        </Button>
      </ProtectedAction>

      <ProtectedAction requiredPermission={PERMISSIONS.REORDER_MODULES}>
        <Button
          type="text"
          block
          icon={<ArrowRightOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
          className="text-left flex items-center"
        >
          Move to
        </Button>
      </ProtectedAction>

      <ProtectedAction requiredPermission={PERMISSIONS.DELETE_MODULE}>
        <Button
          type="text"
          block
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
          className="text-left flex items-center text-red-500"
        >
          Remove
        </Button>
      </ProtectedAction>
    </div>
  );

  return (
    <div
      key={module._id}
      className={`relative mb-4 border ${
        isSelected ? "border-2 border-rose-400" : "border-gray-200"
      } bg-white rounded-lg cursor-pointer`}
      onClick={onSelect}
    >
      <img
        src={module.thumbnail}
        alt={module.moduleName}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{module.moduleName}</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="bg-gradient-to-r text-sm from-pink-100 to-purple-200 font-semibold rounded-full py-1 px-4">
            Module {module.moduleNumber}
          </p>

          <div className="flex items-center justify-center space-x-2">
            {!module?.isPublished ? (
              <BsPatchCheckFill className="text-green-600 p-1 border rounded-full h-8 w-8" />
            ) : (
              <StopOutlined className="text-gray-600 p-1 border rounded-full h-8 w-8" />
            )}

            <Popover
              content={menuContent}
              trigger="click"
              placement="bottomRight"
              overlayClassName="module-card-popover"
            >
              <Button
                type="text"
                size="large"
                icon={<BiDotsVertical size={25} />}
                className="flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              />
            </Popover>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={module.moduleName}
      />
    </div>
  );
};

export default ModuleCard;
