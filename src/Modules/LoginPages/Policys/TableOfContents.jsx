// src/components/TableOfContents.jsx

import React, { useState } from "react";
import Scrollspy from "react-scrollspy";
import { Link } from "react-scroll";
import { MdOutlinePrivacyTip, MdSecurity } from "react-icons/md";
import {
  FaUserGraduate,
  FaRegQuestionCircle,
  FaFileAlt,
  FaCookieBite,
} from "react-icons/fa";
import {
  IoIosArrowRoundBack,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/io";
import { motion } from "framer-motion";

const TableOfContents = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mapping section IDs to icons
  const sectionIcons = {
    introduction: <MdOutlinePrivacyTip className="inline mr-2" />,
    "data-we-collect": <FaUserGraduate className="inline mr-2" />,
    "how-we-use-data": <MdSecurity className="inline mr-2" />,
    // Add mappings for other sections
    "data-storage": <FaRegQuestionCircle className="inline mr-2" />,
    "access-controls": <FaFileAlt className="inline mr-2" />,
    "data-protection": <FaFileAlt className="inline mr-2" />,
    "data-sharing": <FaFileAlt className="inline mr-2" />,
    "data-security": <MdSecurity className="inline mr-2" />,
    "user-rights": <FaUserGraduate className="inline mr-2" />,
    "data-retention": <FaRegQuestionCircle className="inline mr-2" />,
    "children-privacy": <FaRegQuestionCircle className="inline mr-2" />,
    "changes-policy": <FaFileAlt className="inline mr-2" />,
    // Add for other policies
    "what-are-cookies": <FaCookieBite className="inline mr-2" />,
    "types-of-cookies": <FaCookieBite className="inline mr-2" />,
    "how-we-use-cookies": <FaCookieBite className="inline mr-2" />,
    "managing-cookie-preferences": <FaCookieBite className="inline mr-2" />,
    "third-party-cookies": <FaCookieBite className="inline mr-2" />,
    "data-privacy": <FaFileAlt className="inline mr-2" />,
    "changes-cookie-policy": <FaFileAlt className="inline mr-2" />,
    "contact-us": <FaFileAlt className="inline mr-2" />,
  };

  // Filter sections based on search term
  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-1 bg-blue-600"
          style={{
            width: `${
              (window.scrollY /
                (document.documentElement.scrollHeight -
                  document.documentElement.clientHeight)) *
              100
            }%`,
          }}
          animate={{
            width: `${
              (window.scrollY /
                (document.documentElement.scrollHeight -
                  document.documentElement.clientHeight)) *
              100
            }%`,
          }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>

      {/* Back to Home Link */}
      <NavLink
        to="/"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 items-center flex gap-2"
      >
        <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
          <IoIosArrowRoundBack aria-hidden="true" />
        </div>
        <span>LMS Home</span>
      </NavLink>

      {/* Company Branding with Icon */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Logo /> {/* Replace with your Logo component */}
        <div className="flex justify-center items-center mt-4">
          <MdOutlinePrivacyTip
            className="text-blue-600 mr-2"
            size={32}
            aria-hidden="true"
          />
          <p className="text-2xl font-semibold">Privacy Policy</p>
        </div>
        <p className="text-gray-600">Last Updated: 30 October 2024</p>
      </motion.div>

      {/* TOC Search and Toggle (Mobile) */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
        aria-label="Table of Contents"
      >
        {/* Search Input */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-expanded={isOpen}
            aria-controls="toc-list"
          >
            <span className="mr-2">Table of Contents</span>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isOpen && (
          <div id="toc-list" className="md:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search Table of Contents"
            />
            <Scrollspy
              items={filteredSections.map((section) => section.id)}
              currentClassName="text-blue-800 font-bold"
              className="list-disc list-inside space-y-2 md:space-y-4"
              offset={-100}
            >
              {filteredSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    to={section.id}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <motion.span whileHover={{ scale: 1.05 }} className="mr-2">
                      {sectionIcons[section.id]}
                    </motion.span>
                    {section.title}
                  </Link>
                </motion.li>
              ))}
            </Scrollspy>
          </div>
        )}

        {/* TOC for Desktop */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Search Table of Contents"
          />
          <Scrollspy
            items={filteredSections.map((section) => section.id)}
            currentClassName="text-blue-800 font-bold"
            className="list-disc list-inside space-y-4"
            offset={-100}
          >
            {filteredSections.map((section, index) => (
              <motion.li
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  to={section.id}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <motion.span whileHover={{ scale: 1.05 }} className="mr-2">
                    {sectionIcons[section.id]}
                  </motion.span>
                  {section.title}
                </Link>
              </motion.li>
            ))}
          </Scrollspy>
        </div>
      </motion.nav>
    </div>
  );
};

export default TableOfContents;
