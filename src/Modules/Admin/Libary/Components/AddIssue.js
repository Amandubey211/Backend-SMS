// src/Modules/Admin/Libary/Components/AddIssue.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { issueBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import FormInput from "../../Accounting/subClass/component/FormInput";

const AddIssue = ({ onClose }) => {
  const dispatch = useDispatch();
  const { books, editIssueData } = useSelector((state) => state.admin.library);
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const studentList = useSelector((state) => state.admin.students.studentsList);
  const classList = useSelector((state) => state.admin.class.classes);

  const [issueData, setIssueData] = useState({
    class: "",
    section: "",
    student: "",
    book: "",
    authorName: "",
    issueDate: "",
    returnDate: "",
    status: "",
  });

  useEffect(() => {
    if (editIssueData) {
      setIssueData({
        class: editIssueData.classId?._id || "",
        section: editIssueData.sectionId?._id || "",
        student: editIssueData.studentId?._id || "",
        book: editIssueData.bookId?._id || "",
        authorName: editIssueData.author || "",
        issueDate: editIssueData.issueDate?.slice(0, 10) || "",
        returnDate: editIssueData.returnDate?.slice(0, 10) || "",
        status: editIssueData.status || "",
      });
      if (editIssueData.classId?._id) {
        dispatch(fetchSectionsByClass(editIssueData.classId._id));
      }
      if (editIssueData.sectionId?._id) {
        dispatch(fetchStudentsByClassAndSection(editIssueData.sectionId._id));
      }
    }
  }, [editIssueData, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "class") {
      dispatch(fetchSectionsByClass(value));
    }
    if (name === "section") {
      dispatch(fetchStudentsByClassAndSection(value));
    }
    setIssueData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "book") {
      const selectedBook = books.find((book) => book._id === value);
      if (selectedBook) {
        setIssueData((prev) => ({
          ...prev,
          authorName: selectedBook.author,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      id: editIssueData?._id || null,
      status: issueData.status,
      returnDate: issueData.returnDate,
      issueDate: issueData.issueDate,
      author: issueData.authorName,
      bookId: issueData.book,
      studentId: issueData.student,
      sectionId: issueData.section,
      classId: issueData.class,
    };
    dispatch(issueBookThunk(submissionData));
    onClose();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label htmlFor="class">Class</label>
      <select
        id="class"
        name="class"
        value={issueData.class}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Class</option>
        {classList.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.className}
          </option>
        ))}
      </select>

      <label htmlFor="section">Section</label>
      <select
        id="section"
        name="section"
        value={issueData.section}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Section</option>
        {sectionList.map((section) => (
          <option key={section._id} value={section._id}>
            {section.sectionName}
          </option>
        ))}
      </select>

      <label htmlFor="student">Student</label>
      <select
        id="student"
        name="student"
        value={issueData.student}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Student</option>
        {studentList.map((student) => (
          <option key={student._id} value={student._id}>
            {student.firstName} {student.lastName}
          </option>
        ))}
      </select>

      <label htmlFor="book">Book</label>
      <select
        id="book"
        name="book"
        value={issueData.book}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.name}
          </option>
        ))}
      </select>

      <FormInput
        id="authorName"
        name="authorName"
        label="Author Name"
        value={issueData.authorName}
        onChange={handleInputChange}
      />
      <FormInput
        id="issueDate"
        name="issueDate"
        label="Issue Date"
        type="date"
        value={issueData.issueDate}
        onChange={handleInputChange}
        required
      />
      <FormInput
        id="returnDate"
        name="returnDate"
        label="Return Date"
        type="date"
        value={issueData.returnDate}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        value={issueData.status}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      >
        <option value="Pending">Pending</option>
        <option value="Returned">Returned</option>
      </select>

      <button
        type="submit"
        className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
      >
        {editIssueData ? "Edit Book Issue" : "Add Book Issue"}
      </button>
    </form>
  );
};

export default AddIssue;
