// src/pages/TermsAndConditions.jsx

import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import Layout from "../../../Components/Common/Layout";
import { FaFileAlt } from "react-icons/fa";
import { Link, Element } from "react-scroll";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "definitions", title: "2. Definitions" },
  { id: "user-accounts", title: "3. User Accounts" },
  { id: "acceptable-use", title: "4. Acceptable Use Policy" },
  { id: "content-ip", title: "5. Content and Intellectual Property" },
  { id: "user-roles", title: "6. User Roles and Permissions" },
  { id: "fees-payment", title: "7. Fees and Payment Terms" },
  { id: "data-protection", title: "8. Data Protection and Privacy" },
  { id: "termination", title: "9. Termination of Services" },
  { id: "limitation-liability", title: "10. Limitation of Liability" },
  { id: "governing-law", title: "11. Governing Law and Dispute Resolution" },
  { id: "changes-terms", title: "12. Changes to the Terms" },
];

const TermsAndConditions = () => {
  return (
    <Layout title="Terms and Conditions | Student Diwan">
      <div className="min-h-screen bg-gray-50">
        {/* Header Component */}
        <Header />

        {/* Main Content */}
        <main className="max-w-4xl px-6 py-8 mx-auto text-gray-800 font-sans">
          {/* Company Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="flex justify-center items-center mt-4">
              <FaFileAlt
                className="text-pink-600 mr-2"
                size={42}
                aria-hidden="true"
              />
              <div className="flex flex-col items-start">
                <p className="text-2xl font-semibold font-serif">
                  Terms and Conditions
                </p>
                <p className="text-gray-600">Last Updated: 30 October 2024</p>
              </div>
            </div>
          </motion.div>

          {/* Table of Contents */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-4 font-serif">
              Table of Contents
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {sections?.map((section) => (
                <li key={section.id}>
                  <Link
                    to={section.id}
                    smooth={true}
                    duration={500}
                    offset={-20} // Adjust based on your header height
                    className="text-blue-600 cursor-pointer hover:underline"
                    activeClass="text-pink-600 font-semibold"
                    spy={true}
                    exact="true"
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Policy Sections */}
          {sections?.map((section) => (
            <Element key={section.id} name={section.id} className="mb-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-semibold mt-4 mb-2 font-serif">
                  {section.title}
                </h3>
                {getSectionContent(section.id)}
              </motion.section>
            </Element>
          ))}
        </main>
      </div>
    </Layout>
  );
};

// Helper function to return content based on section id
const getSectionContent = (id) => {
  switch (id) {
    case "introduction":
      return (
        <p>
          Welcome to Student Diwan LMS! These Terms and Conditions ("Terms")
          govern your access to and use of our platform, including all tools,
          services, and content provided by Student Diwan ("we," "us," "our").
          By using our services, you agree to comply with these Terms. If you do
          not agree, you must cease using the platform immediately.
        </p>
      );

    case "definitions":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>User:</strong> Any individual (teacher, student, parent,
            school admin) accessing or using the platform.
          </li>
          <li>
            <strong>School:</strong> Any educational institution using Student
            Diwan services under a subscription agreement.
          </li>
          <li>
            <strong>Content:</strong> Any material submitted, uploaded, or
            created on the platform, including assignments, grades, portfolios,
            or academic content.
          </li>
        </ul>
      );

    case "user-accounts":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Account Creation:</strong> Users must register with accurate
            information, including name, email, and role within the school.
            Student Diwan reserves the right to verify user identity.
          </li>
          <li>
            <strong>Security of Accounts:</strong> Users are responsible for
            maintaining the confidentiality of their account information. Any
            unauthorized use of an account must be reported immediately. We are
            not responsible for any damage or loss caused by unauthorized access
            due to user negligence.
          </li>
          <li>
            <strong>Teacher and Admin Roles:</strong> School administrators and
            teachers have additional responsibilities, including managing
            student data and complying with applicable laws, including those
            related to data privacy.
          </li>
        </ul>
      );

    case "acceptable-use":
      return (
        <>
          <p>
            <strong>Purpose:</strong> The platform is designed for educational
            purposes, including teaching, learning, assessment, and
            administrative functions. Users must use the services responsibly
            and only for these approved activities.
          </p>
          <p>
            <strong>Prohibited Conduct:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-6">
            <li>Uploading harmful, offensive, or illegal content.</li>
            <li>Sharing personal data without authorization.</li>
            <li>Hacking or attempting to bypass security measures.</li>
            <li>
              Posting content that violates third-party intellectual property
              rights.
            </li>
            <li>
              Using the platform for any commercial purpose without express
              written consent from Student Diwan.
            </li>
          </ul>
        </>
      );

    case "content-ip":
      return (
        <>
          <p>
            <strong>Ownership of Content:</strong> Any content uploaded by users
            (e.g., academic work, student portfolios) remains the property of
            the user or their school. By uploading content, users grant Student
            Diwan a non-exclusive, royalty-free license to use, store, and
            display the content to deliver services.
          </p>
          <p>
            <strong>Intellectual Property Rights:</strong> All intellectual
            property related to the LMS (e.g., platform code, design,
            trademarks) belongs to Student Diwan. Unauthorized use,
            reproduction, or distribution of platform IP is strictly prohibited.
          </p>
        </>
      );

    case "user-roles":
      return (
        <>
          <p>
            The platform includes role-based permissions to maintain data
            confidentiality and comply with privacy laws:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-6">
            <li>
              <strong>Teachers:</strong> Teachers can manage student
              assignments, academic content, and portfolios within their
              assigned classes and are responsible for respecting student
              privacy and data security.
            </li>
            <li>
              <strong>Students:</strong> Students may access personal academic
              content, view their progress, and upload assignments or
              portfolios. They do not have access to data of other students.
            </li>
            <li>
              <strong>Parents:</strong> Parents linked to individual students
              can view their child's portfolios, academic records, and progress
              reports. Communication tools allow for secure messaging with
              teachers and school administrators.
            </li>
            <li>
              <strong>School Administrators:</strong> Administrators can edit
              and approve academic content, set permissions for all users within
              their school, and oversee data security and policy compliance.
            </li>
          </ul>
        </>
      );

    case "fees-payment":
      return (
        <>
          <p>
            <strong>Subscription Fees:</strong> Schools subscribing to premium
            services agree to pay all applicable fees as outlined in their
            contract. Invoices are due as per the agreement, and non-payment may
            result in service suspension.
          </p>
          <p>
            <strong>Late Payments:</strong> Delayed payments may incur
            penalties, including interest charges. We reserve the right to
            terminate services for failure to pay after multiple reminders.
          </p>
        </>
      );

    case "data-protection":
      return (
        <>
          <p>
            <strong>Compliance with Laws:</strong> We are committed to complying
            with relevant data protection laws, including but not limited to
            Qatar’s Data Protection Law and other applicable regulations. For
            more information, please see our{" "}
            <Link
              to="privacy-policy"
              className="text-blue-600 hover:underline"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            <strong>Parental Consent:</strong> Schools using the platform must
            ensure that they have obtained the necessary consent from parents
            for the collection of student data, particularly for users under the
            age of 18.
          </p>
        </>
      );

    case "termination":
      return (
        <>
          <p>
            <strong>By the User:</strong> Users or schools may terminate their
            account or subscription in accordance with the terms set out in
            their contract.
          </p>
          <p>
            <strong>By Student Diwan:</strong> We reserve the right to terminate
            or suspend accounts without notice for violations of these terms or
            failure to pay applicable fees. Upon termination, users may lose
            access to their data stored on the platform.
          </p>
        </>
      );

    case "limitation-liability":
      return (
        <p>
          To the fullest extent permitted by law, Student Diwan disclaims all
          warranties, express or implied, regarding the performance,
          availability, and quality of the platform. We are not responsible for
          any indirect, incidental, or consequential damages arising from the
          use of the platform, including data loss.
        </p>
      );

    case "governing-law":
      return (
        <p>
          These Terms are governed by the laws of Qatar. Any disputes arising
          from or related to these Terms shall be settled in the courts of
          Qatar.
        </p>
      );

    case "changes-terms":
      return (
        <p>
          We may revise these Terms from time to time. When changes are made, we
          will notify users. Continued use of the platform constitutes
          acceptance of the modified Terms.
        </p>
      );

    default:
      return null;
  }
};

export default TermsAndConditions;
