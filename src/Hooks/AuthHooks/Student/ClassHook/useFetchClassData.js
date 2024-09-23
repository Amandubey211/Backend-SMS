import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setSelectedClass,
  setSelectedClassName,
  setSelectedSectionId,
  setSelectedSectionName
} from "../../../../Redux/Slices/Common/CommonSlice";
import { baseUrl } from "../../../../config/Common";

const useFetchClassData = () => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const role = useSelector((store) => store?.Auth?.role);

  // useEffect(() => {
  //   const fetchClassData = async () => {
  //     try {
  //       const token = localStorage.getItem(`${role}:token`);
  //       if (!token) {
  //         throw new Error("Authentication token not found");
  //       }

  //       const response = await axios.get(`${baseUrl}/student/my_class`, {
  //         headers: {
  //           Authentication: token,
  //         },
  //       });

  //         console.log(response.data.data.section.sectionId)
  //         console.log(response.data.data.section.sectionName	)
        // if (response.data.status && response.data.data) {
        
        //   setClassData(response.data.data);
        //   // dispatch(setSelectedSectionId(response.data.data.section.sectionId))
        //   dispatch(setSelectedSectionId(response.data.data.section.sectionId))
        //   dispatch(setSelectedSectionName(response.data.data.section.sectionName))
        //   dispatch(setSelectedClass(response.data.data.classId));
        //   dispatch(setSelectedClassName(response.data.data.className));
        // } else {
        //   throw new Error("No class data or unsuccessful response");
        // }
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchClassData();
  // }, [dispatch, role]);

  useEffect(() => {
    const fetchClassData = async () => {
        try {
            const token = localStorage.getItem(`${role}:token`);
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await axios.get(`${baseUrl}/student/my_class`, {
                headers: {
                    Authentication: token,
                },
            });


            ///-------------------------------------------------
            // if (response.data.status && response.data.data) {
            //     if (!response.data.data.section) {
            //         // Handle the case where section is null
            //         setClassData(response.data.data);
            //         // setClassData("No Section Assigned");
            //         dispatch(setSelectedSectionId(null)); // You may also decide not to dispatch at all
            //         dispatch(setSelectedSectionName("No Section Assigned"));
            //     } else {
            //         // When section is available
            //         setClassData(response.data.data);
            //         dispatch(setSelectedSectionId(response.data.data.section.sectionId));
            //         dispatch(setSelectedSectionName(response.data.data.section.sectionName));
            //         dispatch(setSelectedClass(response.data.data.classId));
            //     dispatch(setSelectedClassName(response.data.data.className));
            //     }
            //     // dispatch(setSelectedClass(response.data.data.classId));
            //     // dispatch(setSelectedClassName(response.data.data.className));
            // } else {
            //     throw new Error("No class data or unsuccessful response");
            // }
//------------------------------------------

            //--------before 👇 ---------------
            // if (response.data.status && response.data.data) {
        
            //     setClassData(response.data.data);
            //     // dispatch(setSelectedSectionId(response.data.data.section.sectionId))
            //     dispatch(setSelectedSectionId(response.data.data.section.sectionId))
            //     dispatch(setSelectedSectionName(response.data.data.section.sectionName))
            //     dispatch(setSelectedClass(response.data.data.classId));
            //     dispatch(setSelectedClassName(response.data.data.className));
            //   } else {
            //     throw new Error("No class data or unsuccessful response");
            //   }

              //-------------before 👆------------

              //----------after👇-------------
              if (response.data.status && response.data.data) {
                // Check if section is null and handle it
                if (!response.data.data.section) {
                  setError("Section not assigned yet."); // Set an error message if section is null
                  setClassData({
                    ...response.data.data,
                    section: { sectionName: "No Section Assigned" }, // Assign a default value
                  });
                } else {
                  // When section is available
                  setClassData(response.data.data);
                  dispatch(setSelectedSectionId(response.data.data.section.sectionId));
                  dispatch(setSelectedSectionName(response.data.data.section.sectionName));
                }
                dispatch(setSelectedClass(response.data.data.classId));
                dispatch(setSelectedClassName(response.data.data.className));
              } else {
                throw new Error("No class data or unsuccessful response");
              }


              //-----after 👆--------------
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchClassData();
}, [dispatch, role]);


  const memoizedClassData = useMemo(() => classData, [classData]);

  return { classData: memoizedClassData, loading, error };
};

export default useFetchClassData;
