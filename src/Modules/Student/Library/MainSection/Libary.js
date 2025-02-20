import React, { useEffect } from "react";
import BookCard from "../SubClass/component/BookCard";
import Layout from "../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import BookIssue from "./BookIssue";
import Spinner from "../../../../Components/Common/Spinner";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setActiveTab } from "../../../../Store/Slices/Student/Library/libararySlice";
import { GoAlertFill } from "react-icons/go";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import { gt } from "../../../../Utils/translator/translation";
import { studentIssueBooks } from "../../../../Store/Slices/Student/Library/bookIssues.action";
import { libraryBooksStudent } from "../../../../Store/Slices/Student/Library/libarary.action";
import TabButton from "../../../Admin/Libary/Components/TabButton";
import OfflineModal from "../../../../Components/Common/Offline";
import { setShowError } from "../../../../Store/Slices/Common/Alerts/alertsSlice";

const Library = () => {
  const dispatch = useDispatch();
  const {
    loading: libraryLoading,
    error: libraryError,
    libararyBooks,
    filters,
    activeTab,
  } = useSelector((store) => store.student.studentLibraryBooks);
  const { showError } = useSelector((store) => store?.common?.alertMsg);
  const { t } = useTranslation();

  useNavHeading("Library");

  const handleSwitchTab = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const filteredBooks = libararyBooks?.filter(
    (book) =>
      (filters.class === "" || book.classLevel.toString() === filters.class) &&
      (filters.category === "" || book.category === filters.category)
  );

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  useEffect(() => {
    if (activeTab === "Library") {
      dispatch(libraryBooksStudent());
    } else if (activeTab === "BookIssue") {
      dispatch(studentIssueBooks());
    }
  }, [dispatch, libraryBooksStudent, studentIssueBooks, activeTab]);

  const libraryContent = () => {
    if (libraryLoading) {
      return (
        <div className="text-center py-20">
          <Spinner />
        </div>
      );
    }

    // if (libraryError && activeTab === "Library") {
    //   return (
    //     <div className="flex flex-col justify-center items-center text-center min-h-[300px] py-20 text-red-600">
    //       <GoAlertFill className="mb-2 w-12 h-12" />
    //       <p className="text-lg font-semibold">{libraryError}</p>
    //     </div>
    //   );
    // }

    if (
      !libraryLoading &&
      filteredBooks?.length === 0 &&
      activeTab === "Library"
    ) {
      return (
        <div className="text-center py-20">
          <NoDataFound />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-3 px-5">
        {filteredBooks?.reverse()?.map((book) => (
          <BookCard
            key={book?._id}
            title={book?.title}
            author={book?.author}
            category={book?.category}
            classLevel={book?.classLevel?.className}
            copies={book?.copies}
            available={book?.available}
            coverImageUrl={book?.image}
            name={book?.name}
            totalCopies={book?.TotalCopies}
            issuedCount={book?.issuedCount}
          />
        ))}
      </div>
    );
  };

  const bookIssueContent = () => {
    return <BookIssue />;
  };

  return (
    <Layout title="Library | Student Diwan">
      <StudentDashLayout>
        <div>
          <div className="flex items-center gap-5 p-5">
            <TabButton
              isActive={activeTab === "Library"}
              onClick={() => handleSwitchTab("Library")}
              aria-label="Library tab"
            >
              {t("Library", gt.stdLibrary)}
            </TabButton>
            <TabButton
              isActive={activeTab === "BookIssue"}
              onClick={() => handleSwitchTab("BookIssue")}
              aria-label="Book Issue tab"
            >
              {t("Book Issue", gt.stdLibrary)}
            </TabButton>
          </div>

          {activeTab === "Library" ? libraryContent() : bookIssueContent()}
        </div>
        {!libraryLoading && showError && (
          <OfflineModal error={libraryError} onDismiss={handleDismiss} />
        )}
      </StudentDashLayout>
    </Layout>
  );
};

export default Library;
