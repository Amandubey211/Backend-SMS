
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import announcementIcon from "../../../../Assets/StudentAssets/announcement.png";
import { setActiveIndex } from "../../../../Store/Slices/Student/Noticeboard/noticeSlice";
import { useDispatch, useSelector } from "react-redux";
import { gt } from "../../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";


const NoticeItem = ({
    notice,
    index,
    formatDate,
}) => {
    const { activeIndex } = useSelector((store) => store.student.studentAnnouncement);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const toggleAccordion = (index) => {
        dispatch(setActiveIndex(activeIndex === index ? null : index));
    };

    return (
        <div className="border-t">
            <div
                className="cursor-pointer p-2 flex flex-col bg-white"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index ? "true" : "false"}
            >
                <div className="flex gap-6 px-3 py-2 items-center">
                    {/* Icon */}
                    <div
                        className="border bg-blue-300 rounded-md flex items-center justify-center"
                        style={{ height: "60px", width: "60px" }}
                    >
                        <img
                            className="h-[80%] w-[80%] rounded-sm"
                            src={announcementIcon}
                            alt="Announcement Icon"
                        />
                    </div>

                    {/* Title and Date */}
                    <div className="flex-1 flex flex-col gap-2">
                        <h2 className="font-[500] text-[#4D4D4D] text-sm leading-5">
                            {notice.title}
                        </h2>
                        <div className="flex items-center text-xs">
                            <IoCalendarOutline
                                className="text-gray-400 text-lg"
                                aria-hidden="true"
                            />
                            <span className="text-sm font-[400] text-[#7F7F7F] ml-2">
                                {formatDate(notice.startDate)}
                            </span>
                            <div className="ml-3 px-3 py-[2px] bg-gray-100 text-center flex justify-center items-center rounded-full">
                                <span
                                    className={`text-xs ${notice.priority === "High Priority"
                                        ? "font-semibold text-pink-500 bg-pink-100 px-2 rounded-full"
                                        : "text-gray-500"
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
                    <div className="p-4 text-sm text-[#4D4D4D] bg-white">
                        <p>{notice.description}</p>
                    </div>
                )}
            </div>
        </div>
    )
};


export default NoticeItem;