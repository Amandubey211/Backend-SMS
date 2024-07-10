
import React, { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { TbBell } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import AvatarsList from "./AvataList";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import NotificationBar from "./NotificationBar";
import Sidebar from "./Sidebar";

const Navbar = ({ hideSearchbar, hideAvatarList, hideStudentView }) => {
  const LeftNavHeading = useSelector(
    (store) => store.Common.NavbarData.leftHeading
  );
  const navigate = useNavigate();
  const [isOpenNotification,setIsOpenNotification] = useState(false);
  const [notificationCount,setNotificationCount] = useState(0);
  useEffect(()=>{
    function getNotificationsFromIndexedDB() {
      return new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('firebase-messaging-store', 1);
        dbPromise.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(['notifications'], 'readonly');
          const objectStore = transaction.objectStore('notifications');
          const request = objectStore.getAll();
    
          request.onsuccess = function() {
            resolve(request.result);
           
          };
    
          request.onerror = function(event) {
            reject(event);
          };
        };
    
        dbPromise.onerror = function(event) {
          reject(event);
        };
      });
    };
    getNotificationsFromIndexedDB().then((notifications) => {
      console.log('Retrieved notifications from IndexedDB:', notifications);
      localStorage.setItem('NotificationCount',notifications.length)
      // Display notifications in your UI
    }).catch((error) => {
      console.error('Failed to retrieve notifications from IndexedDB:', error);
    });
  },[])
  useEffect(()=>{
    setNotificationCount(localStorage.getItem('NotificationCount'));
  },[localStorage.getItem('NotificationCount'),notificationCount]);
 const openNotification = ()=>{
 setIsOpenNotification(true)
 }
//  const handleSidebarClose = () => {
 
//   setIsOpen(false)
//   alert(isOpen)
// };
  return (
    <div className="relative z-0">
      <div className="flex items-center p-2 bg-white border-b">
        <div className="flex-1 text-md font-semibold capitalize">
          {LeftNavHeading[1] === undefined ? (
            <span className=" text-gradient capitalize">{LeftNavHeading[0]}</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="opacity-55 font-bold flex items-center text-gray-500">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-1 capitalize"
                  title="Back"
                  aria-label="Go back"
                >
                  {LeftNavHeading[0]}
                </button>
                <MdOutlineKeyboardDoubleArrowRight
                  className="text-2xl"
                  aria-hidden="true"
                />
              </span>
              <h1 className="text-gradient text-md font-bold">
                {LeftNavHeading[1]}
              </h1>
            </div>
          )}
        </div>
        {!hideAvatarList && (
          <>
            <div className="flex-1">
              <AvatarsList />
            </div>
            {!hideStudentView && (
              <button
                className="flex mr-3 items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-white py-1 px-3 rounded-full"
                aria-label="Switch to Student View"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaArrowRightArrowLeft aria-hidden="true" />
                </div>
                <span className="text-sm text-gradient font-medium">
                  Student View
                </span>
              </button>
            )}
          </>
        )}
        {!hideSearchbar && (
          <div className="relative flex items-center max-w-xs w-full mr-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search here"
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              aria-label="Search here"
            />
            <button className="absolute right-3" aria-label="Search">
              <CiSearch className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 border-l ml-3 pl-3">
          <button aria-label="Mail">
            <CiMail className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
          </button>
          <button aria-label="Notifications" onClick={openNotification} className="relative">
            <TbBell className="w-8 h-8 text-purple-500 p-1 border rounded-full"  />
            {/* {
           isOpen?<NotificationBar isOpen={isOpen} onClose={onClose} />:null
            } */}
            <Sidebar  isOpen={isOpenNotification} onClose={()=> setIsOpenNotification(false)} title={'Recent Notifications'} >
              <NotificationBar/>
            </Sidebar>
            <p className="absolute top-[-5px]  right-0 bg-purple-500 rounded-full text-white w-[20px] h-[20px] flex  justify-center items-center ">{notificationCount}</p>
          </button>
          <button aria-label="Settings">
            <IoSettingsOutline className="w-8 h-8 text-purple-500 p-1 border rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

