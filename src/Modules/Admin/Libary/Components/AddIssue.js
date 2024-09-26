// src/Modules/Admin/Library/Components/AddIssue.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import { issueBookThunk } from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchSectionsByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";

const AddIssue = ({ editIssueData, onClose, onUpdate }) => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.admin.library);

  const sectionList = useSelector(
    (store) => store.admin.group_section.sectionsList
  );
  const studentList = useSelector(
    (store) => store.admin?.students.studentsList
  );

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
    dispatch(fetchAllClasses());
  }, []);
  useEffect(() => {
    if (editIssueData) {
      setIssueData({
        class: editIssueData.class,
        section: editIssueData.section,
        student: editIssueData.student,
        book: editIssueData.book,
        authorName: editIssueData.authorName,
        issueDate: editIssueData.issueDate,
        returnDate: editIssueData.returnDate,
        status: editIssueData.status,
      });
    }
  }, [editIssueData]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(value, "sdfsd");
    console.log(issueData, "//////////");

    if (name === "class") {
      dispatch(fetchSectionsByClass(value));
    }

    if (name === "section") {
      dispatch(fetchStudentsByClassAndSection(issueData.class));
    }

    if (name === "book") {
      const selectedBook = books.find((book) => book.value === value);
      if (selectedBook) {
        setIssueData((prev) => ({
          ...prev,
          authorName: selectedBook.authorName,
        }));
      }
    }

    setIssueData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      status: issueData.status,
      returnDate: issueData.returnDate,
      issueDate: issueData.issueDate,
      author: issueData.authorName,
      bookId: books.find((item) => item.label === issueData.book)?.id || null,
      studentId:
        studentList.find(
          (item) => item.firstName + item.lastName === issueData.student
        )?._id || null,
      sectionId:
        sectionList.find((item) => item.sectionName === issueData.section)
          ?._id || null,
      classId:
        classList.find((item) => item.className === issueData.class)?._id ||
        null,
    };

    dispatch(issueBookThunk(submissionData));
    onUpdate();
    onClose();
  };

  return (
    <div
      className="p-4 bg-gray-50 border rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormSelect
          id="class"
          name="class"
          label="Class"
          options={classList?.map((cls) => ({
            value: cls._id,
            label: cls.className,
          }))}
          value={issueData.class}
          onChange={handleInputChange}
          required
        />
        <FormSelect
          id="section"
          name="section"
          label="Section"
          options={sectionList?.map((section) => ({
            value: section._id,
            label: section.sectionName,
          }))}
          value={issueData.section}
          onChange={handleInputChange}
        />
        <FormSelect
          id="student"
          name="student"
          label="Student"
          options={studentList?.map((student) => ({
            value: student.firstName + student.lastName,
            label: student.firstName + student.lastName,
          }))}
          value={issueData.student}
          onChange={handleInputChange}
          required
        />
        <FormSelect
          id="book"
          name="book"
          label="Book"
          options={books.map((book) => ({
            value: book.name,
            label: book.name,
          }))}
          value={issueData.book}
          onChange={handleInputChange}
        />
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
          value={issueData.issueDate.slice(0, 10)}
          onChange={handleInputChange}
          required
        />
        <FormInput
          id="returnDate"
          name="returnDate"
          label="Return Date"
          type="date"
          value={issueData.returnDate.slice(0, 10)}
          onChange={handleInputChange}
          required
        />
        <FormSelect
          id="status"
          name="status"
          label="Status"
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Returned", label: "Returned" },
          ]}
          value={issueData.status}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full mt-4 p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {editIssueData ? "Edit Book Issue" : "Add Book Issue"}
        </button>
      </form>
    </div>
  );
};

export default AddIssue;
