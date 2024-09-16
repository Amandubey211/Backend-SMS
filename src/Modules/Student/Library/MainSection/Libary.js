import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import TabButton from "../../../Admin/Libary/Subclasss/component/TabButton";
import Spinner from "../../../../Components/Common/Spinner";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { libraryBooksStudent } from "../../../../Store/Slices/Student/Library/libarary.action";
import { useTranslation } from "react-i18next";
import { setActiveTab } from "../../../../Store/Slices/Student/Library/libararySlice";
import { GoAlertFill } from "react-icons/go";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { gt } from "../../../../Utils/translator/translation";


const Library = () => {
  const dispatch = useDispatch();
  const { loading, error, libararyBooks, filters, activeTab } = useSelector((store) => store.studentLibraryBooks);
  const { t } = useTranslation();

  useNavHeading("Library");

  const handleSwitchTab = (tab) => {
    dispatch(setActiveTab(tab))
  }

  const filteredBooks = libararyBooks?.filter(
    (book) =>
      (filters.class === "" || book.classLevel.toString() === filters.class) &&
      (filters.category === "" || book.category === filters.category)
  );

  useEffect(() => {
    dispatch(libraryBooksStudent());
  }, [dispatch]);

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div className="">
          <div className="flex items-center gap-5 p-5">
            <TabButton
              isActive={activeTab === "Library"}
              onClick={() => handleSwitchTab("Library")}
              aria-label="Library tab"
            >
              {t('Library', gt.stdLibrary)}
            </TabButton>
            <TabButton
              isActive={activeTab === "BookIssue"}
              onClick={() => handleSwitchTab("BookIssue")}
              aria-label="Book Issue tab"
            >
              {t('Book Issue', gt.stdLibrary)}
            </TabButton>
          </div>


          {loading && (

            <div className="text-center py-20">
              <Spinner />
            </div>

          )}

          {/* Display Error Message */}
          {error && (
            <div className="flex flex-col justify-center items-center text-center min-h-[300px] py-20 text-red-600">
              <GoAlertFill className="mb-2 w-12 h-12" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          )}



          {/* Display No Data Found */}
          {!loading && !error && filteredBooks?.length === 0 && activeTab === "Library" && (
            <div className="text-center py-20">
              <NoDataFound />
            </div>
          )}

          {/* Display Library */}
          {!loading && !error && (
            activeTab === "Library" ? (
              <div className="grid grid-cols-4 gap-3 px-5">
                {filteredBooks?.reverse()?.map((book) => (
                  <BookCard
                    key={book._id}
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    classLevel={book.classLevel.className}
                    copies={book.copies}
                    available={book.available}
                    coverImageUrl={book.image}
                  />
                ))}
              </div>
            ) : activeTab === "BookIssue" ? (
              <BookIssue />
            ) : null
          )}
        </div>
      </StudentDashLayout>
    </Layout>
  );
};
export default Library;
