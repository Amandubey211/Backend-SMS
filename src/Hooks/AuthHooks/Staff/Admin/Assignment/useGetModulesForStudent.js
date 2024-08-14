import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setModules } from "../../../../../Redux/Slices/Admin/SubjectSlice";
import { setSelectedModule } from "../../../../../Redux/Slices/Common/CommonSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetModulesForStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modulesData, setModulesData] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { cid, sid } = useParams();
  const dispatch = useDispatch();
  const selectedModule = useSelector((store) => store.Common.selectedModule);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${baseUrl}/admin/student/classes/${cid}/modules/${sid}`,
        {
          headers: { Authentication: token },
        }
      );

      if (response.data?.success) {
        const fetchedModules = response.data.data.modules;
        dispatch(setModules(fetchedModules)); // Update Redux
        setModulesData(response.data.data); // Update local state

        // Check if the selectedModule is empty or the moduleId doesn't exist in fetchedModules
        const selectedModuleExists = fetchedModules.find(
          (module) => module._id === selectedModule.moduleId
        );

        if (!selectedModule || !selectedModuleExists) {
          // Set the first module as the selectedModule
          const firstModule = fetchedModules[0];
          if (firstModule) {
            dispatch(
              setSelectedModule({
                moduleId: firstModule._id,
                name: firstModule.moduleName,
                chapters: firstModule.chapters,
              })
            );
          }
        } else {
          // If selectedModule exists, update it with the fetched data
          const updatedSelectedModule = fetchedModules.find(
            (module) => module._id === selectedModule.moduleId
          );
          if (updatedSelectedModule) {
            dispatch(
              setSelectedModule({
                moduleId: updatedSelectedModule._id,
                name: updatedSelectedModule.moduleName,
                chapters: updatedSelectedModule.chapters,
              })
            );
          }
        }
      } else {
        dispatch(setModules([]));
        setError(response.data.msg || "Failed to fetch modules.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error in fetching modules";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, dispatch, cid, sid, selectedModule]); // Include selectedModule as a dependency

  return { loading, error, modulesData, fetchModules };
};

export default useGetModulesForStudent;
