import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooksThunk,
  issueBookThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import {
  fetchSectionsByClass,
  fetchSectionsNamesByClass,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import FormInput from "../../Accounting/subClass/component/FormInput";
import { useTranslation } from "react-i18next";

const AddIssue = ({ onClose, editIssueData }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.admin.library);
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const studentList = useSelector((state) => state.admin.students.studentsList);
  const classList = useSelector((state) => state.admin.class.classes);
  const { loading } = useSelector((state) => state.admin.students);

  const [issueData, setIssueData] = useState({
    class: "",
    section: "",
    student: "",
    book: "",
    authorName: "",
    issueDate: "",
    returnDate: "",
    status: "Pending",
  });

  // Reset form when switching between add and edit modes
  useEffect(() => {
    if (editIssueData) {
      // Populate the form with the data for editing
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

      // Fetch sections for the selected class
      // if (editIssueData.classId?._id) {
      //   dispatch(fetchSectionsNamesByClass(editIssueData.classId._id));
      // }

      // // Fetch students for the selected section
      // if (editIssueData.sectionId?._id) {
      //   dispatch(fetchStudentsByClassAndSection(editIssueData.sectionId._id));
      // }
    } else {
      // Reset form for adding a new issue
      setIssueData({
        class: "",
        section: "",
        student: "",
        book: "",
        authorName: "",
        issueDate: "",
        returnDate: "",
        status: "Pending",
      });
    }
  }, [editIssueData, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "class") {
      dispatch(fetchSectionsNamesByClass(value));
      dispatch(fetchStudentsByClassAndSection(value));
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
    <form className="flex flex-col h-full space-y-6" onSubmit={handleSubmit}>
      <div className="flex-1 overflow-auto no-scrollbar px-5 space-y-4">
        <div>
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Class")}
          </label>
          <select
            id="class"
            name="class"
            value={issueData.class}
            onChange={handleInputChange}
            required
            className="block w-full p-2 mt-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{t("Select Class")}</option>
            {classList?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Section")}
          </label>
          <select
            id="section"
            name="section"
            disabled={loading}
            value={issueData.section}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{t("Select Section")}</option>
            {sectionList?.map((section) => (
              <option key={section._id} value={section._id}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Student")}
          </label>
          <select
            id="student"
            name="student"
            disabled={loading}
            value={issueData.student}
            onChange={handleInputChange}
            required
            className="block w-full p-2 mt-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{t("Select Student")}</option>
            {studentList?.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="book"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Book")}
          </label>
          <select
            id="book"
            name="book"
            value={issueData.book}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">{t("Select Book")}</option>
            {books?.map((book) => (
              <option key={book._id} value={book._id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          id="authorName"
          name="authorName"
          label={t("Author Name")}
          value={issueData.authorName}
          onChange={handleInputChange}
        />
        <FormInput
          id="issueDate"
          name="issueDate"
          label={t("Issue Date")}
          type="date"
          value={issueData.issueDate}
          onChange={handleInputChange}
          required
        />
        <FormInput
          id="returnDate"
          name="returnDate"
          label={t("Return Date")}
          type="date"
          value={issueData.returnDate}
          onChange={handleInputChange}
          required
        />

        <div className="pb-8">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Status")}
          </label>
          <select
            id="status"
            name="status"
            value={issueData.status}
            onChange={handleInputChange}
            className="block w-full p-2 mt-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Pending">{t("Pending")}</option>
            <option value="Returned">{t("Returned")}</option>
          </select>
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-white pb-3 px-5">
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {editIssueData ? t("Edit Book Issue") : t("Add Book Issue")}
        </button>
      </div>
    </form>
  );
};

export default AddIssue;
