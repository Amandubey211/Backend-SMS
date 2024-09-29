import React, { useState, useEffect } from "react";
import { TbBell } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import LeftHeading from "./LeftHeading";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import useStaffLogout from "../../Hooks/AuthHooks/Staff/useStaffLogOut";
import Sidebar from "./Sidebar";
import NotificationBar from "./NotificationBar";
import SettingDropdown from "./SettingDropdown";

const Navbar = () => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const leftHeading = useSelector(
    (store) => store.common.user.navbar.leftHeading
  );
  const role = useSelector((store) => store.common.auth.role);
  const activeAcademicYear = useSelector((store) => {
    if (role === "admin" || role === "teacher" || role === "accountant") {
      return store.common.auth?.AcademicYear?.find((year) => year?.isActive)
        ?.academicYear;
    }
    return null; // Or provide a default value if necessary
  });

  const { staffLogout } = useStaffLogout();

  // Fetch notifications from IndexedDB
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
    <div className="sticky top-0 left-0 right-0 z-20 bg-white border-b shadow-sm">
      <div className="flex items-center p-2 py-2.5 bg-white">
        {/* Left Heading */}
        <LeftHeading leftHeading={leftHeading} navigate={navigate} />

        <div className="flex items-center space-x-2 relative ">
          {role === "admin" || role === "teacher" || role === "accountant" ? (
            <div className="border-r px-4 font-semibold text-gradient">
              {activeAcademicYear && activeAcademicYear}
            </div>
          ) : null}

          {/* Notification Icon with Count */}

          <div className="relative ">
            <IconButton
              icon={TbBell}
              label="Notifications"
              onClick={() => setIsOpenNotification(true)}
              className="hover:bg-gray-200 rounded-full transition-all duration-200"
            />
            {/* Notification Count */}
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-purple-200 rounded-full  w-[20px] h-[20px] flex justify-center items-center text-sm">
                <span className="text-gradient">{notificationCount || 0}</span>
              </div>
            )}
          </div>

          {/* Settings Icon */}
          <IconButton
            icon={IoSettingsOutline}
            label="Settings"
            onClick={() => setShowSetting(!showSetting)}
            className="hover:bg-gray-200 rounded-full transition-all duration-200"
          />

          {/* Dropdown for Settings */}
          <SettingDropdown
            showSetting={showSetting}
            setShowSetting={setShowSetting}
            navigateProfile={navigateProfile}
            openModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={logout}
      />

      {/* Notification Sidebar */}
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
