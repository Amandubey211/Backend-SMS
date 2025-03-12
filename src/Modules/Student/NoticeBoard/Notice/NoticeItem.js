import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import announcementIcon from "../../../../Assets/StudentAssets/announcement.png";
import { setActiveIndex } from "../../../../Store/Slices/Student/Noticeboard/noticeSlice";
import { useDispatch, useSelector } from "react-redux";
import { gt } from "../../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";
import notificationImg from "../../../../Assets/StudentAssets/notification.webp";

const NoticeItem = ({ notice, index, formatDate }) => {
  const { activeIndex } = useSelector(
    (store) => store.student.studentAnnouncement
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleAccordion = (index) => {
    dispatch(setActiveIndex(activeIndex === index ? null : index));
  };

  return (
    <div className="border-t">
      <div
        className={`cursor-pointer p-2 flex flex-col ${
          activeIndex === index ? "bg-pink-50" : "bg-white"
        }`}
        onClick={() => toggleAccordion(index)}
        aria-expanded={activeIndex === index ? "true" : "false"}
      >
        <div className="flex gap-6 px-3 py-2 items-center">
          <div
            className="rounded-md flex items-center justify-center overflow-hidden"
            style={{ height: "100%", width: "100px" }}
          >
            <picture>
              <source srcSet={notificationImg} type="image/webp" />
              <img
                className="h-full w-full object-cover"
                src={announcementIcon}
                alt="Announcement Icon"
              />
            </picture>
          </div>
          {/* Title and Date */}
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="font-[500] text-gray-600 text-md leading-5 capitalize break-words">
              {notice?.title}
            </h2>
            <p className="text-sm text-purple-600">
              (Posted by{" "}
              <span className="text-sm text-purple-600">
                {notice?.authorName || "-"}
              </span>
              )
            </p>
            <div className="flex items-center text-sm gap-x-3">
              <div className="flex gap-1">
                <IoCalendarOutline
                  className="text-gray-400 text-lg"
                  aria-hidden="true"
                />
                <span className="font-[400] text-[#7F7F7F]">
                  {formatDate(notice.startDate)}
                </span>
              </div>
              <div className="flex gap-1">
                <IoCalendarOutline
                  className="text-gray-400 text-lg"
                  aria-hidden="true"
                />
                <span className="font-[400] text-[#7F7F7F]">
                  {formatDate(notice.endDate)}
                </span>
              </div>
              <div className="px-3 py-[2px] text-center flex justify-center items-center rounded-full">
                <span
                  className={`text-xs capitalize ${
                    notice.priority === "High priority"
                      ? "font-semibold text-pink-500 bg-pink-100 px-2 rounded-full"
                      : "text-gray-500 bg-gray-100 font-semibold px-2 rounded-full"
                  }`}
                >
                  {t(notice.priority, gt.stdNoticeboard)}
                </span>
              </div>
            </div>
          </div>
          {/* Expand Icon */}
          <div className="flex items-center justify-center">
            {activeIndex === index ? (
              <MdExpandLess
                className="text-xl text-gray-500"
                aria-label="Collapse"
              />
            ) : (
              <MdExpandMore
                className="text-xl text-gray-500"
                aria-label="Expand"
              />
            )}
          </div>
        </div>
        {/* Description */}
        {activeIndex === index && (
          <div
            className="p-4 text-sm text-gray-600 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div dangerouslySetInnerHTML={{ __html: notice.description }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeItem;
