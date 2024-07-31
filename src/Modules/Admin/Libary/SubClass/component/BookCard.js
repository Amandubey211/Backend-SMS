import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { MdCancel } from "react-icons/md";
import Sidebar from "../../../../../Components/Common/Sidebar";
import EditBook from "./EditBook";
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const BookCard = ({
  key,
  id,
  title,
  author,
  category,
  classLevel,
  copies,
  available,
  coverImageUrl,
  onupdate
}) => {
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const [bookData, setBookData] = useState();
  const role = useSelector((store) => store.Auth.role);
  const token   = localStorage.getItem(`${role}:token`);
  const DeleteBook = async()=>{
    try {
      const response = await fetch(`${baseUrl}/admin/delete/book/${id}`, {
        method: "Delete",
        headers: {
          Authentication: `${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to edit book");
      }
  
      const result = await response.json();
      toast.success('Book delete successfully');
      onupdate()
      
    } catch (error) {
      console.error("Error delete book:", error);
      toast.error(error.message || "Failed delete book. Please try again.");
    }
   
  };
  return (
    <div className="border p-2 bg-white rounded-lg shadow overflow-hidden relative">
      <div className="w-full h-40 flex ">

        <img
          src={coverImageUrl}
          alt={title}
          className="w-[70%] h-full object-cover rounded-md"
        />

        <div className="flex flex-col  p-2 space-y-1">
          <span className=" font-semibold text-[#7F7F7F]text-sm ">Class: </span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text">{classLevel}</span>
          <span className="text-sm font-semibold text-gray-700">Copies:</span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text"> {copies}</span>
          <span className="text-sm font-semibold text-gray-700"> Available</span>
          <span className="text-base font-semibold bg-gradient-to-r from-pink-500  via-green-500 to-purple-500 inline-block text-transparent bg-clip-text"> {available}</span>
        </div>
      </div>
      <div className=" relative p-4 ">
        <h3 className="text-lg font-bold text-[#333333]">{title}</h3>
        <p className="text-base font-semibold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">{category}</p>

        <p className=" mt-2  text-sm font-medium text-gray-500">Author</p>
        <p className="text-sm font-medium text-gray-600"> {author}</p>
        <div className=" absolute right-2  bottom-2 text-indigo-600 hover:text-indigo-900 cursor-pointer font-bold" onClick={() => setShowEditMenu(true)}><HiDotsVertical /></div>
        {
          showEditMenu ?
            <div className="absolute bottom-0 right-0 bg-white shadow-lg flex flex-col items-center w-[6rem] h-[3rem] border rounded-lg">
              <button className=" absolute left-[-1.5rem] top-[-2rem]  bottom-2 text-indigo-600 hover:text-indigo-900" onClick={() => setShowEditMenu(false)} ><MdCancel className="text-2xl text-black" /></button>
              <button className="  bottom-2 text-indigo-600 hover:text-indigo-900"  onClick={() => {
                setBookData({
                  id,
                  title,
                  author,
                  category,
                  classLevel,
                  copies,
                  available,
                  coverImageUrl,
                  
                });
                handleSidebarOpen();
              }}>Edit </button>
              <button className=" bottom-2 text-indigo-600 hover:text-indigo-900 " onClick={DeleteBook}>Delete</button>
            </div> : null
        }

      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Edit Book"

      >
        <EditBook
        data={bookData} 
        onupdate= {onupdate}
        />
      </Sidebar>
    </div>
  );
};

export default BookCard;
