import React, { useEffect, useState } from 'react';
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from '../../../Accounting/subClass/component/FormSelect';
import { useSelector } from 'react-redux';
import useGetAllClasses from '../../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses';
import useFetchSection from '../../../../../Hooks/AuthHooks/Staff/Admin/Sections/useFetchSection';
import useGetStudentsByClassAndSection from '../../../../../Hooks/AuthHooks/Staff/Admin/Students/useGetStudentsByClassAndSection';
import { baseUrl } from '../../../../../config/Common';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddIssue = ({ editIssueData, onupdate }) => {
    const [issueData, setIssueData] = useState({
        class: '',
        section: '',
        student: '',
        book: '',
        authorName: '',
        issueDate: '',
        returnDate: '',
        status: ''
    });

    const [books, setBooks] = useState([]);
    const [classData, setClassData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const role = useSelector((store) => store.Auth.role);
    const token = localStorage.getItem(`${role}:token`);
    const { classList, sectionsList } = useSelector((store) => store.Class);
    const { fetchClasses } = useGetAllClasses();
    const { fetchSection } = useFetchSection();
    const { fetchStudentsByClassAndSection } = useGetStudentsByClassAndSection();

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
                status: editIssueData.status
            });
        }
    }, [editIssueData]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/all/book`, {
                headers: {
                    Authentication: `${token}`,
                },
            });
            if (response.data.success) {
                setBooks(response.data.books.map((item) => ({
                    value: item.name,
                    label: item.name,
                    id: item._id,
                    authorName: item.author
                })));
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchClasses();
            setClassData(classList.map((item) => ({
                value: item.className,
                label: item.className
            })));
        };
        fetchData();
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'class') {
            const findClass = classList.find((item) => item.className === value);
            if (findClass) {
                await fetchSection(findClass._id);
                const students = await fetchStudentsByClassAndSection(findClass._id);
                setStudentData(students.map((item) => ({
                    value: item.firstName + item.lastName,
                    label: item.firstName + item.lastName
                })));
                setSectionData(sectionsList.map((item) => ({
                    value: item.sectionName,
                    label: item.sectionName
                })));
            } else {
                console.log('Class not found');
            }
        }

        if (name === 'book') {
            const selectedBook = books.find(book => book.value === value);
            if (selectedBook) {
                setIssueData(prev => ({
                    ...prev,
                    authorName: selectedBook.authorName
                }));
            }
        }

        setIssueData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedClass = classList.find(item => item.className === issueData.class);
        const selectedSection = sectionsList.find(item => item.sectionName === issueData.section);
        const students = await fetchStudentsByClassAndSection(selectedClass?._id);
        const selectedStudent = students.find(item => item.firstName + item.lastName === issueData.student);
        const selectedBook = books.find(item => item.label === issueData.book);

        const submissionData = {
            status: issueData.status,
            returnDate: issueData.returnDate,
            issueDate: issueData.issueDate,
            author: issueData.authorName,
            bookId: selectedBook?.id || null,
            studentId: selectedStudent?._id || null,
            sectionId: selectedSection?._id || null,
            classId: selectedClass?._id || null
        };
        console.log(submissionData);

        try {
            if (editIssueData.class) {
                // If editing, make a PUT request
                await axios.put(`${baseUrl}/admin/update/bookIssue/${editIssueData.id}`, submissionData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authentication: `${token}`,
                    },
                });
                toast.success('Book issue updated');
                onupdate()
            } else {
                // If adding a new record, make a POST request
                await axios.post(`${baseUrl}/admin/issue_book`, submissionData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authentication: `${token}`,
                    },
                });
                toast.success('Book issued');
                onupdate()
            }
        } catch (error) {
            toast.error('Failed to process request');
        }
    };

    return (
        <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: '90vh' }}>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormSelect
                    id="class"
                    name="class"
                    label="Class"
                    options={classData}
                    value={issueData.class}
                    onChange={handleInputChange}
                />
                <FormSelect
                    id="section"
                    name="section"
                    label="Section"
                    options={sectionData}
                    value={issueData.section}
                    onChange={handleInputChange}
                />
                <FormSelect
                    id='student'
                    name='student'
                    label='Student'
                    options={studentData}
                    value={issueData.student}
                    onChange={handleInputChange}
                />
                <FormSelect
                    id='book'
                    name='book'
                    label='Book'
                    options={books}
                    value={issueData.book}
                    onChange={handleInputChange}
                />
                <FormInput
                    id='authorName'
                    name='authorName'
                    label='Author Name'
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
                <FormSelect
                    id="status"
                    name="status"
                    label="Status"
                    options={[{ value: "Pending", label: "Pending" }, { value: "Returned", label: "Returned" }]}
                    value={issueData.status}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="mt-4 w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                    {editIssueData.class ? 'Edit Book Issue' : 'Add Book Issue'}
                </button>
            </form>
        </div>
    );
};

export default AddIssue;
