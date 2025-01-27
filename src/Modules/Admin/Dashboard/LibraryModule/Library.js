import React, { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import BookItem from "./BookItem";
import { FaBook } from "react-icons/fa"; // For "No data found" icon
import Spinner from "../../../../Components/Common/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilteredIssueBooks } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action";
import { useTranslation } from 'react-i18next';
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
const Library = () => {
  const { t } = useTranslation('admLibrary');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state?.common?.auth?.role);

  // Extracting books, loading, and error from Redux state
  const { books, loadingBooks: loading, errorBooks: error } = useSelector((state) => state?.admin?.adminDashboard);

  // Fetch Books based on role
  useEffect(() => {
    dispatch(fetchFilteredIssueBooks());
  }, [dispatch]);

  const handleViewAllClick = () => {
    navigate("/library");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <FaBook className="text-red-400 text-6xl mb-4" />
        <p className="text-gray-500 text-xl">{t("Error")}: {error}</p>
      </div>
    );
  }

  // Ensure only the top 5 latest books are displayed
  const latestBooks = books?.slice(0, 3) || [];

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t("Library")}</h2>
        <button
          className="text-black border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300 ease-in-out"
          onClick={handleViewAllClick}
        >
          {t("View All")}
        </button>
      </div>
      <ProtectedSection requiredPermission={PERMISSIONS.GET_ALL_BOOKS}>
        {latestBooks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <FaBook className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-xl">{t("No library data found")}</p>
          </div>
        ) : (
          latestBooks?.map((book) => (
            <BookItem
              key={book?._id}
              image={book?.image || "https://via.placeholder.com/50"}
              title={book?.name || t("Untitled Book")}
              category={book?.category || t("Uncategorized")}
              copies={book?.copies || 0}
              author={book?.author || t("Unknown")}
              className={book?.classId?.className || t("Unknown Class")}
              role={role}
            />
          ))
        )}
      </ProtectedSection>
    </div>
  );
};

export default memo(Library);
