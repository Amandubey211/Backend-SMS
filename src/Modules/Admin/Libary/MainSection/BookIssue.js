import React, { useState, useMemo } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import FormField from "../../Accounting/subClass/component/FormField";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddIssue from "../SubClass/component/AddIssue";
import BookIssueRow from "../SubClass/component/BookIssueRow";
import { bookIssueData } from "../../dummyData/dummyData";

// const bookIssueData = [
//   {
//     id: 1,
//     studentName: "Arlene McCoy",
//     classSection: "10 - B",
//     bookTitle: "Goldfinch",
//     author: "Leslie Alexander",
//     issueDate: "02/10/2024",
//     dueDate: "06/10/2024",
//     status: "Pending",
//     classLevel: "10",
//     section: "B",
//     category: "Business Management",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 2,
//     studentName: "Albert Flores",
//     classSection: "10 - B",
//     bookTitle: "The Handmaid's Tale",
//     author: "Leslie Alexander",
//     issueDate: "02/10/2024",
//     dueDate: "06/10/2024",
//     status: "Return",
//     classLevel: "10",
//     section: "B",
//     category: "Business Management",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 3,
//     studentName: "Eleanor Pena",
//     classSection: "11 - A",
//     bookTitle: "To Kill a Mockingbird",
//     author: "Harper Lee",
//     issueDate: "03/10/2024",
//     dueDate: "07/10/2024",
//     status: "Pending",
//     classLevel: "11",
//     section: "A",
//     category: "Literature",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 4,
//     studentName: "Darlene Robertson",
//     classSection: "12 - C",
//     bookTitle: "1984",
//     author: "George Orwell",
//     issueDate: "01/10/2024",
//     dueDate: "05/10/2024",
//     status: "Return",
//     classLevel: "12",
//     section: "C",
//     category: "Science Fiction",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 5,
//     studentName: "Ronald Richards",
//     classSection: "9 - D",
//     bookTitle: "Moby Dick",
//     author: "Herman Melville",
//     issueDate: "04/10/2024",
//     dueDate: "08/10/2024",
//     status: "Pending",
//     classLevel: "9",
//     section: "D",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 6,
//     studentName: "Savannah Nguyen",
//     classSection: "11 - B",
//     bookTitle: "Pride and Prejudice",
//     author: "Jane Austen",
//     issueDate: "05/10/2024",
//     dueDate: "09/10/2024",
//     status: "Pending",
//     classLevel: "11",
//     section: "B",
//     category: "Literature",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 7,
//     studentName: "Francisco Alexander",
//     classSection: "10 - A",
//     bookTitle: "The Great Gatsby",
//     author: "F. Scott Fitzgerald",
//     issueDate: "06/10/2024",
//     dueDate: "10/10/2024",
//     status: "Pending",
//     classLevel: "10",
//     section: "A",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 8,
//     studentName: "Wade Warren",
//     classSection: "12 - A",
//     bookTitle: "Jane Eyre",
//     author: "Charlotte Brontë",
//     issueDate: "07/10/2024",
//     dueDate: "11/10/2024",
//     status: "Return",
//     classLevel: "12",
//     section: "A",
//     category: "Literature",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 9,
//     studentName: "Marvin McKinney",
//     classSection: "10 - D",
//     bookTitle: "War and Peace",
//     author: "Leo Tolstoy",
//     issueDate: "08/10/2024",
//     dueDate: "12/10/2024",
//     status: "Pending",
//     classLevel: "10",
//     section: "D",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 10,
//     studentName: "Cameron Williamson",
//     classSection: "9 - B",
//     bookTitle: "The Catcher in the Rye",
//     author: "J.D. Salinger",
//     issueDate: "09/10/2024",
//     dueDate: "13/10/2024",
//     status: "Return",
//     classLevel: "9",
//     section: "B",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 11,
//     studentName: "Esther Howard",
//     classSection: "11 - C",
//     bookTitle: "Frankenstein",
//     author: "Mary Shelley",
//     issueDate: "10/10/2024",
//     dueDate: "14/10/2024",
//     status: "Pending",
//     classLevel: "11",
//     section: "C",
//     category: "Science Fiction",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 12,
//     studentName: "Jerome Bell",
//     classSection: "12 - B",
//     bookTitle: "The Odyssey",
//     author: "Homer",
//     issueDate: "11/10/2024",
//     dueDate: "15/10/2024",
//     status: "Return",
//     classLevel: "12",
//     section: "B",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 13,
//     studentName: "Kathryn Murphy",
//     classSection: "10 - C",
//     bookTitle: "Brave New World",
//     author: "Aldous Huxley",
//     issueDate: "12/10/2024",
//     dueDate: "16/10/2024",
//     status: "Pending",
//     classLevel: "10",
//     section: "C",
//     category: "Science Fiction",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 14,
//     studentName: "Ethan Brown",
//     classSection: "9 - A",
//     bookTitle: "Wuthering Heights",
//     author: "Emily Brontë",
//     issueDate: "13/10/2024",
//     dueDate: "17/10/2024",
//     status: "Return",
//     classLevel: "9",
//     section: "A",
//     category: "Literature",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 15,
//     studentName: "Victoria Ortiz",
//     classSection: "11 - D",
//     bookTitle: "The Lord of the Rings",
//     author: "J.R.R. Tolkien",
//     issueDate: "14/10/2024",
//     dueDate: "18/10/2024",
//     status: "Pending",
//     classLevel: "11",
//     section: "D",
//     category: "Fantasy",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 16,
//     studentName: "Jacob Jones",
//     classSection: "12 - D",
//     bookTitle: "The Hobbit",
//     author: "J.R.R. Tolkien",
//     issueDate: "15/10/2024",
//     dueDate: "19/10/2024",
//     status: "Return",
//     classLevel: "12",
//     section: "D",
//     category: "Fantasy",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 17,
//     studentName: "Brooklyn Simmons",
//     classSection: "10 - A",
//     bookTitle: "A Tale of Two Cities",
//     author: "Charles Dickens",
//     issueDate: "16/10/2024",
//     dueDate: "20/10/2024",
//     status: "Pending",
//     classLevel: "10",
//     section: "A",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 18,
//     studentName: "Aiden Nguyen",
//     classSection: "9 - C",
//     bookTitle: "Great Expectations",
//     author: "Charles Dickens",
//     issueDate: "17/10/2024",
//     dueDate: "21/10/2024",
//     status: "Return",
//     classLevel: "9",
//     section: "C",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 19,
//     studentName: "Liam Martinez",
//     classSection: "11 - A",
//     bookTitle: "Fahrenheit 451",
//     author: "Ray Bradbury",
//     issueDate: "18/10/2024",
//     dueDate: "22/10/2024",
//     status: "Pending",
//     classLevel: "11",
//     section: "A",
//     category: "Science Fiction",
//     image: "https://via.placeholder.com/40",
//   },
//   {
//     id: 20,
//     studentName: "Avery Davis",
//     classSection: "12 - C",
//     bookTitle: "Crime and Punishment",
//     author: "Fyodor Dostoevsky",
//     issueDate: "19/10/2024",
//     dueDate: "23/10/2024",
//     status: "Paid",
//     classLevel: "12",
//     section: "C",
//     category: "Classics",
//     image: "https://via.placeholder.com/40",
//   },
// ];

const BookIssue = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    category: "",
  });

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const classLevels = useMemo(() => {
    const levels = bookIssueData.map((book) => book.classLevel.toString());
    return Array.from(new Set(levels));
  }, [bookIssueData]);


  const classSection = useMemo(() => {
    const levels = bookIssueData.map((book) => book.section.toString());
    return Array.from(new Set(levels));
  }, [bookIssueData]);


  const categories = useMemo(() => {
    const cats = bookIssueData.map((book) => book.category);
    return Array.from(new Set(cats));
  }, [bookIssueData]);

  const filteredData = bookIssueData.filter((item) => {
    return (
      (filters.classLevel === "" || item.classLevel === filters.classLevel) &&
      (filters.section === "" || item.section === filters.section) &&
      (filters.category === "" || item.category === filters.category)
    );
  });

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <FormField
            id="classLevel"
            label="Class"
            value={filters.classLevel}
            onChange={handleFilterChange}
            options={classLevels}
            placeholder="Select Class"
          />
          <FormField
            id="section"
            label="Section"
            value={filters.section}
            onChange={handleFilterChange}
            options={classSection}
            placeholder="Select Section"
          />
          <FormField
            id="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={categories}
            placeholder="Select Category"
          />
        </div>
        <button
          onClick={handleSidebarOpen}
          className="inline-flex items-center  bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          Add Book Issue
        </button>
      </div>

      <div className=" overflow-x-auto bg-white shadow rounded-lg">
      

        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200">Student</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Class & Section
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">
                Issue Book
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Author</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* {filteredData.map((item, index) => (
              <tr key={index} className="text-left text-gray-700 bg-gray-100">
                <td className="px-5 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span>{item.studentName}</span>
                
                  </div>
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                    <div className="text-base">class-{item.classLevel}</div>
                    <div className=" text-[12px]" >section-{item.section}</div>
                  
                </td>
                <td className="px-5 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt="Profile"
                      className="h-8 w-8  mr-2 "
                    />
                    <div className="flex flex-col">
                        <span>{item.bookTitle}</span>
                        <span className="text-[12px] text-green-600 ">{item.category}</span>
                    </div>
                    
                
                  </div>
                </td>
                
                
                <td className="px-5 py-2 border-b border-gray-200">
                  {item.author}
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                    <div>Issue: {item.issueDate}</div>
                    <div> Return: {item.dueDate}</div>
                    
                    </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      item.status === "Paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-2 border-b border-gray-200">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))} */}
                                    {filteredData.map(item => <BookIssueRow key={item.id} item={item} />)}

          </tbody>
        </table>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add Book Issue"
      >
        <AddIssue />
      </Sidebar>
    </div>
  );
};

export default BookIssue;


