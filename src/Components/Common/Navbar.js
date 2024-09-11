import React, { useState, useEffect } from "react";
import { TbBell } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import LeftHeading from "./LeftHeading";
import SearchBar from "./SearchBar";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import useStaffLogout from "../../Hooks/AuthHooks/Staff/useStaffLogOut";
import Sidebar from "./Sidebar";
import NotificationBar from "./NotificationBar";
import NotificationDropdown from "./NotificationDropdown";
import { IoSettingsOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const navigate = useNavigate();
  const leftHeading = useSelector(
    (store) => store.Common.NavbarData.leftHeading
  );
  const role = useSelector((store) => store.Auth.role);
  const { staffLogout } = useStaffLogout();

  // Function to fetch notifications from IndexedDB
  const getNotificationsFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
      const dbPromise = indexedDB.open("firebase-messaging-store", 1);

      dbPromise.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["notifications"], "readonly");
        const objectStore = transaction.objectStore("notifications");
        const request = objectStore.getAll();

        request.onsuccess = function () {
          resolve(request.result);
        };

        request.onerror = function (event) {
          reject(event);
        };
      };

      dbPromise.onerror = function (event) {
        reject(event);
      };
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotificationsFromIndexedDB();
        localStorage.setItem("NotificationCount", notifications?.length);
      } catch (error) {
        console.error("Failed to retrieve notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    setNotificationCount(localStorage.getItem("NotificationCount"));
  }, []);

  const navigateProfile = () => {
    const routes = {
      parent: "/users/parent/profile",
      admin: "/users/admin",
      student: "/users/student/profile",
      teacher: "/users/my/profile",
      accountant: "/users/my/profile",
      librarian: "/users/my/profile",
      staff: "/users/my/profile",
    };
    navigate(routes[role] || "/");
  };

  const logout = async () => {
    await staffLogout();
    setIsModalOpen(false);
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-20 bg-white border-b shadow-sm ">
      <div className="flex items-center p-2 py-3 bg-white ">
        <LeftHeading leftHeading={leftHeading} navigate={navigate} />

        <div className="flex items-center space-x-2 border-l ml-3 pl-3 relative">
          <IconButton
            icon={TbBell}
            label="Notifications"
            onClick={() => setIsOpenNotification(true)}
          />
          <p className="absolute top-[-5px] right-0 bg-purple-500 rounded-full text-white w-[20px] h-[20px] flex justify-center items-center ">
            {notificationCount || 0}
          </p>
          <IconButton
            icon={IoSettingsOutline}
            label="Settings"
            onClick={() => setShowSetting(!showSetting)}
          />
          <NotificationDropdown
            showSetting={showSetting}
            setShowSetting={setShowSetting}
            navigateProfile={navigateProfile}
            openModal={() => setIsModalOpen(true)}
            timeZone={timeZone}
          />
        </div>
      </div>
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={logout}
      />
      <Sidebar
        isOpen={isOpenNotification}
        onClose={() => setIsOpenNotification(false)}
        title="Recent Notifications"
      >
        <NotificationBar />
      </Sidebar>
    </div>
  );
};

export default Navbar;
