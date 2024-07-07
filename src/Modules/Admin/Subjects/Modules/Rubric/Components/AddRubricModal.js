import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import RubricModalRow from "./RubricModalRow";
import { useSelector } from "react-redux";
import useCreateRubric from "../../../../../../Hooks/AuthHooks/Staff/Admin/Rubric/useCreateRubric";
import toast from "react-hot-toast";

const AddRubricModal = ({
  isOpen,
  onClose,
  onAddCriteria,
  criteriaList,
  setCriteriaList,
}) => {
  const [assignment, setAssignment] = useState("");
  const [rubricName, setRubricName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { createRubric, loading } = useCreateRubric();
  const AssignmentList = useSelector((store) => store.Subject.assignments);

  useEffect(() => {
    const toggleBodyClass = () => {
      document.body.classList.toggle("overflow-hidden", isOpen);
    };

    toggleBodyClass();
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChange = useCallback((id) => {
    setAssignment(id);
    setDropdownOpen(false);
  }, []);

  const handleAddRating = useCallback(
    (criteriaIndex, ratings) => {
      const updatedCriteria = criteriaList.map((crit, idx) =>
        idx === criteriaIndex ? { ...crit, ratings } : crit
      );
      setCriteriaList(updatedCriteria);
    },
    [criteriaList, setCriteriaList]
  );

  const handleDeleteCriteria = useCallback(
    (index) => {
      const updatedCriteria = criteriaList.filter((_, i) => i !== index);
      setCriteriaList(updatedCriteria);
    },
    [criteriaList, setCriteriaList]
  );

  const handleSubmit = useCallback(async () => {
    const selectedAssignment = AssignmentList.find((a) => a._id === assignment);

    const totalScore = criteriaList.reduce((acc, criterion) => {
      const criterionTotal = criterion.ratings.reduce(
        (ratingAcc, rating) => ratingAcc + Number(rating.ratingScore),
        0
      );
      return acc + criterionTotal;
    }, 0);

    console.log(totalScore);

    if (totalScore > selectedAssignment?.points) {
      toast.error("Total points cannot exceed the assignment's points.");
      return;
    }

    const rubricData = {
      name: rubricName,
      criteria: criteriaList,
      assignmentId: assignment,
      totalScore,
    };

    console.log(rubricData);

    if (totalScore === selectedAssignment?.points) {
      await createRubric(rubricData);

      // after creating the modal will be closed
      onClose();
    } else {
      return toast.error("Total Point Not correct");
    }
  }, [
    assignment,
    criteriaList,
    rubricName,
    AssignmentList,
    createRubric,
    onClose,
  ]);

  const selectedAssignmentPoints = useMemo(
    () =>
      assignment ? AssignmentList.find((a) => a._id === assignment)?.points : 0,
    [assignment, AssignmentList]
  );

  return (
    <div
      className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white w-full p-3 h-[97vh] rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-1">
          <h2 className="text-lg font-semibold">Add Rubric</h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-3xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="flex items-center px-2">
          <div className="p-2 flex-1">
            <label className="block mb-2 text-sm text-gray-700">
              Rubric Name
            </label>
            <input
              type="text"
              value={rubricName}
              onChange={(e) => setRubricName(e.target.value)}
              className="block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type here"
            />
          </div>
          <div className="p-2 flex-1 relative" ref={dropdownRef}>
            <label className="block text-gray-700 mb-1">Assignment</label>
            <div
              className="block w-full pl-3 pr-10 py-2 text-base border rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {AssignmentList.find((a) => a._id === assignment)?.name ||
                "Select"}
            </div>
            {dropdownOpen && (
              <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto bg-white border rounded-md shadow-lg z-10 py-2">
                {AssignmentList?.map((assignment) => (
                  <li
                    key={assignment._id}
                    onClick={() => handleSelectChange(assignment._id)}
                    className="px-4 py-2 hover:bg-gray-100 transition duration-300 transform cursor-pointer hover:translate-x-[-8px] ps-6"
                  >
                    {assignment.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="m-2 overflow-auto border h-[47vh]">
          <div className="flex px-4 font-semibold justify-between items-center p-2 w-full bg-gradient-to-r from-pink-100 to-purple-100">
            {["Criteria", "Ratings", "Point"].map((heading, idx) => (
              <div
                key={idx}
                className="w-2/8 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
              >
                {heading}
              </div>
            ))}
          </div>
          {criteriaList?.map((item, index) => (
            <RubricModalRow
              key={index}
              data={item}
              criteriaIndex={index}
              onDeleteCriteria={handleDeleteCriteria}
              onAddRating={handleAddRating}
            />
          ))}
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={onAddCriteria}
            className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
          >
            <HiOutlinePlus className="text-red-600 text-2xl" />
            <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              Add Criteria
            </span>
          </button>
          <div className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Total Points: {selectedAssignmentPoints}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
            disabled={loading}
          >
            <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              {loading ? "Creating..." : "Add To Assignment"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRubricModal;
