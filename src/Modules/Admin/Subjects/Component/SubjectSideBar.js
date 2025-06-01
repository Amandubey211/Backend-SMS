import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip, Modal, Button, Divider, Input } from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSemester } from "../../../../Store/Slices/Common/User/reducers/userSlice";
import { setCellModal, setCellModalCancel } from "../../../../Store/Slices/Admin/scoreCard/scoreCard.slice";
import { addScoreCardCellData, getScoreCard } from "../../../../Store/Slices/Admin/scoreCard/scoreCard.thunk";
import toast from "react-hot-toast";
const ScoreCardModal = ({ isModalOpen, dispatch, Modaldata, setCellModal, setCellModalCancel, addScoreCardCellData, scoreCardData }) => {
  const [cellNumber, setCellNumber] = useState("");
  const [error, setError] = useState("");
    

  // Validate input on change
  const validateInput = (value) => {
    // Check if input is empty
    if (!value) {
      setError("Cell number is required");
      return false;
    }

    // Allow only uppercase letters and numbers, no spaces or special characters
    const isValid = /^[A-Z0-9]+$/.test(value);
    if (!isValid) {
      setError("Only uppercase letters and numbers are allowed (e.g., A1, B2)");
      return false;
    }

    setError("");
    return true;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCellNumber(value);
    validateInput(value);
    dispatch(setCellModal({ ...Modaldata, cellNumber: value }));
  };

  // Handle form submission
  const handleOk = async() => {
    if (validateInput(cellNumber)) {
    let res=    await  dispatch(addScoreCardCellData(Modaldata))

    let result = res?.payload;
    if(result?.success){
      toast.success("Added Successfully")
    }else{
      toast.error(result?.message || "Something Is Wrong")
    }

     dispatch(setCellModalCancel());

    }

  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setCellNumber("");
      setError("");
    }
  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      okText="Add"
      onCancel={() => dispatch(setCellModalCancel())}
      okButtonProps={{
        className: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200",
        disabled: !!error || !cellNumber, // Disable button if there's an error or input is empty
      }}
      cancelButtonProps={{
        className: "border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 rounded-lg transition-all duration-200",
      }}
      className="rounded-lg"
    >
      <div className="p-4">
        <label className="block text-gray-700 text-sm font-semibold mb-3">
          Enter the cell number where you want to display the grades in your scorecard Excel sheet
        </label>
        <Input
          placeholder="e.g., A1, B2"
          value={cellNumber}
          onChange={handleInputChange}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400 ${error ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-indigo-400"
            }`}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </Modal>
  );
};
const SubjectSideBar = () => {
  const { t } = useTranslation("admModule");
  const location = useLocation();
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  // Retrieve semesters from the admin slice and selected semester from the common user slice
  const {
    semesters,
    loading: semesterLoading,
    error: semesterError,
  } = useSelector((state) => state.admin.semesters);
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  // Local state to control the semester selection modal visibility
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);

  // Format sid to lowercase with underscores for the URL
  const formattedSid = sid.toLowerCase().replace(/ /g, "_");

  // Define sidebar menu items
  const menuItems = [
    { name: "Module", path: "module" },
    { name: "Assignments", path: "assignment" },
    { name: "Quizzes", path: "quiz" },
    { name: "Offline Exam", path: "offline_exam" },
    { name: "Discussions", path: "discussions" },
    { name: "Page", path: "page" },
    { name: "Grades", path: "grades" },
    { name: "Announcements", path: "announcements" },
    { name: "Syllabus", path: "syllabus" },
    { name: "Rubric", path: "rubric" },
  ];

  // Construct the base path for each menu item
  const getBasePath = (item) => `/class/${cid}/${formattedSid}/${item.path}`;

  // Handler for selecting a semester from the modal
  const handleSemesterSelect = (semester) => {
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    setSemesterModalVisible(false);
  };
  const { isModalOpen, Modaldata, scoreCardData } = useSelector((state) => state.admin.scoreCard)
  return (<>
    <div className="flex flex-col min-h-screen h-full w-full md:w-[16%] space-y-3 p-3 border-r ">
      {/* Semester Selection Section */}
      <div>
        <Button
          type="default"
          onClick={() => setSemesterModalVisible(true)}
          className="
    w-full
    border border-pink-400
    bg-white
    text-black
    rounded-lg
    font-semibold
    text-sm           /* smaller text */
    whitespace-normal /* allow wrapping */
    break-words       /* break long words */
    text-center       /* optionally center-align text */
    transition-colors
    duration-200  
    hover:bg-pink-400
    hover:text-pink-900
  "
          aria-label="Select Semester"
        >
          {selectedSemester && selectedSemester.name ? (
            <>
              {/* Show full label on screens ≥ small */}
              <span className="hidden sm:inline">{selectedSemester.name}</span>
              {/* Short label on smaller screens (< sm) */}
              <span className="inline sm:hidden">{selectedSemester.name}</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Select Semester</span>
              <span className="inline sm:hidden">Sem</span>
            </>
          )}
        </Button>
      </div>

      <Divider className="border-purple-300" />

      {/* Sidebar Menu Items */}
      <div className="flex flex-col space-y-2">
        {menuItems.map((item, index) => {
          const basePath = getBasePath(item);
          const isActive = location.pathname.includes(
            `/class/${cid}/${formattedSid}/${item.path}`
          );
          return (
            <Tooltip key={index} title={t(item.name)} placement="right">
              <NavLink
                to={basePath}
                className={`${isActive
                  ? "text-purple-600 font-semibold bg-purple-100 rounded-full py-1 px-4"
                  : "text-gray-800 px-4 py-1"
                  } hover:bg-purple-200 hover:text-purple-500 hover:rounded-full transition-colors duration-200`}
                aria-label={t(item.name)}
              >
                {t(item.name)}
              </NavLink>
            </Tooltip>
          );
        })}
      </div>

      {/* Semester Selection Modal with Framer Motion Animations */}
      <Modal
        visible={semesterModalVisible}
        onCancel={() => setSemesterModalVisible(false)}
        footer={null}
        title="Select Semester"
        bodyStyle={{ padding: "1rem" }}
        destroyOnClose
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {semesterLoading ? (
            <div className="flex justify-center items-center">
              <span>{t("Loading semesters...")}</span>
            </div>
          ) : semesterError ? (
            <div className="text-red-500 text-center">
              {t("Failed to load semesters. Please try again.")}
            </div>
          ) : (
            <div className="space-y-2">
              {semesters && semesters.length > 0 ? (
                semesters.map((sem) => (
                  <Button
                    key={sem._id}
                    onClick={() => handleSemesterSelect(sem)}
                    className={`w-full text-left border rounded-md transition-colors duration-200 ${selectedSemester && selectedSemester.id === sem._id
                      ? "bg-purple-100 border-purple-400"
                      : "bg-white hover:bg-purple-50"
                      }`}
                    aria-label={`Select semester ${sem.title}`}
                  >
                    {sem.title}
                  </Button>
                ))
              ) : (
                <p className="text-center">{t("No semesters available.")}</p>
              )}
            </div>
          )}
        </motion.div>
      </Modal>
    </div>
    <ScoreCardModal
      isModalOpen={isModalOpen}
      dispatch={dispatch}
      Modaldata={Modaldata}
      setCellModal={setCellModal}
      setCellModalCancel={setCellModalCancel}
      addScoreCardCellData={addScoreCardCellData}
      scoreCardData={scoreCardData} />
  </>
  );
};

export default SubjectSideBar;
