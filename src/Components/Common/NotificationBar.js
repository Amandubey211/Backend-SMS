import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import logo from '../../Assets/SideBarAsset/smallLogo.png'
import { RxCross2 } from 'react-icons/rx'

export default function NotificationBar() {
const [notiarray,setNotiarray] = useState();
 const getNotifications = ()=>{
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
    setNotiarray(notifications);
    console.log('11',notifications);
    localStorage.setItem('NotificationCount',notifications.length)
    // Display notifications in your UI
  }).catch((error) => {
    console.error('Failed to retrieve notifications from IndexedDB:', error);
  });
 }
  function deleteNotificationFromIndexedDB(id) {
    return new Promise((resolve, reject) => {
      const dbPromise = indexedDB.open('firebase-messaging-store', 1);

      dbPromise.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['notifications'], 'readwrite');
        const objectStore = transaction.objectStore('notifications');
        const request = objectStore.delete(id);

        request.onsuccess = function() {
          resolve();
          getNotifications();
          localStorage.setItem('NotificationCount',notiarray.length);
        };

        request.onerror = function(event) {
          reject(event);
        };
      };

      dbPromise.onerror = function(event) {
        reject(event);
      };
    });
  }
  const handleDeleteNotification = (id) => {
    deleteNotificationFromIndexedDB(id).then(() => {
      setNotiarray((prevNotiarray) => prevNotiarray.filter(noti => noti.id !== id));
      console.log(`Notification with id ${id} deleted`);
      localStorage.setItem('NotificationCount',notiarray.length);
    }).catch((error) => {
      console.error('Failed to delete notification from IndexedDB:', error);
    });
  };
  useEffect(()=>{
    getNotifications()
  },[]);
  return (
    <div >
        {/* <Sidebar isOpen={isOpen} onClose={onClose} title={'Recent Notifications'} > */}
        <div className="  w-full h-[85vh] overflow-y-scroll  ">

     
        {
notiarray?.map((i)=>(
  <div className='flex w-[90%] flex-row border my-4 items-center  justify-center   h-auto p-2 relative ' id='children' key={i.messageId}>
       <button  className="p-1 m-1 opacity-70 absolute top-0 right-0" onClick={()=>handleDeleteNotification(i.messageId)}>
            <RxCross2 className="text-xl"  />
          </button>
  <div className='w-[30%] flex  items-center  justify-center  '>
    <img src={logo} alt='notication' className='w-[2.8rem] h-[3rem]'/>
  </div>
  <div className='w-[70%] flex  items-center  justify-center  flex-col'>
    <h1 className='font-bold '>{i?.title}</h1>
    <p className='text-gray-500'>{i?.body}
    </p>
  </div>


</div>
))

        }
        
        </div>
        <p className='text-purple-500' onClick={()=>setNotiarray([])}>Clear All Notification</p>
         {/* </Sidebar> */}
    </div>

  )
}

