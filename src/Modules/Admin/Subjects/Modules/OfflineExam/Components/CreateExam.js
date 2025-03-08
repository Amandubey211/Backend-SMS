// CreateExam.js
import React, { useRef, useState } from "react";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { RiAddFill } from "react-icons/ri";
import { Tooltip, Segmented } from "antd";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { PERMISSIONS } from "../../../../../../config/permission";

// Child Components
import CreateManually from "./CreateManually";
import UploadExcel from "./UploadExcel";
import { FiInfo } from "react-icons/fi";
import GuidelinesModel from "./GuidelinesModel";

function CreateExam() {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  // State controlling the Sidebar
  const [isOpen, setIsOpen] = useState(false);

  // Segmented control for switching between "Manual" and "Excel"
  const [activeSegment, setActiveSegment] = useState("manual");

  // Guidelines Modal
  const [guidelinesModalVisible, setGuidelinesModalVisible] = useState(false);

  // Colors & Gradients
  const pinkColor = "#EC407A";
  const purpleColor = "#AB47BC";
  const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

  return (
    <ProtectedAction requiredPermission={PERMISSIONS.ADD_OFFLINE_EXAM}>
      <Tooltip title="Create Offline Exam" placement="left">
        <button
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 fixed rounded-full shadow-md bottom-4 right-4 transform transition-transform duration-300 hover:scale-110"
          aria-label="Add Offline Exam"
          onClick={() => setIsOpen(true)}
        >
          <RiAddFill size={24} />
        </button>
      </Tooltip>

      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          title={"Create Offline Exam"}
          onClose={(event) => {
            // Close only if the user clicked outside the Handsontable area
            if (
              event &&
              event.target &&
              !event.target.closest(".handsontable")
            ) {
              setIsOpen(false);
            }
          }}
          width={"100%"}
        >
          {/* Segmented Controls + Guidelines Button */}
          <div className="flex items-center justify-between px-2 pt-1 mb-4">
            <Segmented
              options={["Create Manually", "Upload Excel"]}
              value={
                activeSegment === "manual" ? "Create Manually" : "Upload Excel"
              }
              onChange={(val) =>
                setActiveSegment(val === "Create Manually" ? "manual" : "excel")
              }
            />

            <div className="flex items-center space-x-3 pr-4">
              {/* Guidelines Button - content changes based on activeSegment */}
              <Tooltip
                title={
                  activeSegment === "manual"
                    ? "View Manual Creation Guidelines"
                    : "View Upload Excel Guidelines"
                }
                placement="bottom"
              >
                <button
                  onClick={() => setGuidelinesModalVisible(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <FiInfo className="text-base" />
                  <span>Guidelines</span>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Guidelines Modal - pass activeSegment to show different content */}
          <GuidelinesModel
            guidelinesModalVisible={guidelinesModalVisible}
            setGuidelinesModalVisible={setGuidelinesModalVisible}
            activeSegment={activeSegment}
          />

          {/* Segment Content */}
          <div className="mt-2 px-2">
            {activeSegment === "manual" ? (
              <CreateManually
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cid={cid}
                sid={sid}
                f
              />
            ) : (
              <UploadExcel
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cid={cid}
                sid={sid}
                dispatch={dispatch}
                primaryGradient={primaryGradient}
              />
            )}
          </div>
        </Sidebar>
      )}
    </ProtectedAction>
  );
}

export default CreateExam;
