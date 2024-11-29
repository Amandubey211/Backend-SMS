// src/pages/PrivacyPolicy.jsx

import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import Layout from "../../../Components/Common/Layout";
import { MdPrivacyTip } from "react-icons/md";
import { Link, Element, animateScroll as scroll } from "react-scroll";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "data-we-collect", title: "2. Data We Collect" },
  { id: "how-we-use-data", title: "3. How We Use Data" },
  { id: "data-storage", title: "4. Data Storage and Localization" },
  { id: "access-controls", title: "5. Access Controls and Permissions" },
  { id: "data-protection", title: "6. Data Protection and Privacy Compliance" },
  { id: "data-sharing", title: "7. Data Sharing" },
  { id: "data-security", title: "8. Data Security" },
  { id: "user-rights", title: "9. User Rights" },
  { id: "data-retention", title: "10. Data Retention" },
  { id: "children-privacy", title: "11. Children’s Privacy" },
  { id: "changes-policy", title: "12. Changes to the Privacy Policy" },
];

const PrivacyPolicy = () => {
  return (
    <Layout title="Privacy Policy | Student Diwan">
      <div className="min-h-screen bg-gray-50">
        {/* Header Component */}
        <Header />

        {/* Main Content */}
        <main className="max-w-4xl px-6 py-8 mx-auto text-gray-800 font-serif">
          {/* Company Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="flex justify-center items-center mt-4">
              <MdPrivacyTip
                className="text-pink-600 mr-2"
                size={42}
                aria-hidden="true"
              />
              <div className="flex flex-col items-start">
                <p className="text-2xl font-semibold">Privacy Policy</p>
                <p className="text-gray-600 ">Last Updated: 30 October 2024</p>
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
            <h3 className="text-2xl font-semibold mb-4">Table of Contents</h3>
            <ul className="list-disc list-inside space-y-2">
              {sections?.map((section) => (
                <li key={section.id}>
                  <Link
                    to={section.id}
                    smooth={true}
                    duration={500}
                    offset={-20} // Adjust if you have a fixed header
                    className="text-blue-600 cursor-pointer hover:underline"
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
                <h3 className="text-2xl font-semibold mt-4 mb-2">
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
          Student Diwan is committed to protecting the privacy of all users of
          our platform. This Privacy Policy outlines how we collect, use, store,
          and disclose personal data. By using the LMS, you agree to this
          policy.
        </p>
      );

    case "data-we-collect":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email, phone number,
            role (e.g., teacher, student), school information, and other data
            necessary for account creation and management.
          </li>
          <li>
            <strong>Academic Data:</strong> Data generated within the platform,
            such as grades, lesson plans, assignments, portfolios, and other
            educational records.
          </li>
          <li>
            <strong>Log Data:</strong> Device information, browser type, IP
            address, usage patterns, and session history to improve user
            experience and platform functionality.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies and similar tracking
            technologies to enhance your experience on our platform. Users can
            manage their cookie preferences in their browser settings.
          </li>
        </ul>
      );

    case "how-we-use-data":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>Allowing users to access and manage academic content.</li>
          <li>
            Enhancing platform functionality and personalized user experience.
          </li>
          <li>
            Sending notifications about updates or activities on user accounts.
          </li>
          <li>
            Monitoring usage patterns to prevent fraudulent activities and
            ensure secure access.
          </li>
          <li>Analyzing platform performance to improve user experience.</li>
        </ul>
      );

    case "data-storage":
      return (
        <p>
          Student Diwan stores all data within Qatar on AWS cloud servers. Data
          access is limited to authorized personnel and is protected by
          industry-standard security measures, including data encryption in
          transit and at rest.
        </p>
      );

    case "access-controls":
      return (
        <>
          <p>
            <strong>User Roles</strong>
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Teachers:</strong> Teachers can create, edit, and view
              student academic records and portfolios. Teachers have restricted
              access to data that only pertains to their assigned classes.
            </li>
            <li>
              <strong>Students:</strong> Students may access personal academic
              content, view their progress, and upload assignments or
              portfolios. They do not have access to data of other students.
            </li>
            <li>
              <strong>Parents:</strong> Parents linked to individual students
              can access their child's portfolio, academic records, and progress
              reports. Communication features allow direct messaging with
              teachers as permitted.
            </li>
            <li>
              <strong>School Administrators:</strong> Administrators have the
              highest level of access within a school’s platform. They can edit,
              approve, or restrict content, modify access levels, and oversee
              student and teacher data to ensure compliance with school
              policies.
            </li>
          </ul>
          <p>
            These roles are established to maintain strict data access controls,
            ensuring that only those with permission can access specific
            information.
          </p>
        </>
      );

    case "data-protection":
      return (
        <>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Compliance with Qatar’s Data Protection Law:</strong> We
              comply with local laws governing personal data handling in Qatar.
              For more information, please contact us at{" "}
              <a
                href="mailto:info@studentdiwan.com"
                className="text-blue-600 hover:underline"
              >
                info@studentdiwan.com
              </a>
              .
            </li>
            <li>
              <strong>Data Minimization:</strong> Only essential data is
              collected and retained as outlined in this policy.
            </li>
          </ul>
        </>
      );

    case "data-sharing":
      return (
        <>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Third-Party Processors:</strong> We may share data with
              trusted third-party service providers (e.g., AWS for hosting) to
              operate the platform. These providers are bound by strict data
              protection agreements and cannot use this data for any other
              purpose.
            </li>
            <li>
              <strong>Legal Compliance:</strong> In instances where we are
              legally required, we may disclose personal information in line
              with Qatar’s regulatory requirements.
            </li>
          </ul>
        </>
      );

    case "data-security":
      return (
        <p>
          We implement industry-standard security measures, including
          encryption, access controls, and secure data centers, to protect
          personal data from unauthorized access or disclosure. Users are
          responsible for securing login credentials to prevent unauthorized
          access.
        </p>
      );

    case "user-rights":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Access:</strong> Users may access their personal data at any
            time.
          </li>
          <li>
            <strong>Correction:</strong> Users can request corrections to any
            inaccurate or incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> Users may request the deletion of their
            personal data, subject to contractual or legal limitations.
          </li>
          <li>
            <strong>Data Portability:</strong> Users can request a copy of their
            data in a machine-readable format by contacting{" "}
            <a
              href="mailto:info@studentdiwan.com"
              className="text-blue-600 hover:underline"
            >
              info@studentdiwan.com
            </a>
            .
          </li>
        </ul>
      );

    case "data-retention":
      return (
        <p>
          Student Diwan retains personal data only as long as necessary to
          fulfill the purposes for which it was collected, or as required by
          applicable Qatar laws and regulations. Generally, personal data will
          be kept for up to five (5) years following the end of a user’s
          relationship with Student Diwan, unless a longer retention period is
          mandated by law. After the retention period expires, data is securely
          deleted or anonymized. Users may request the deletion or anonymization
          of their data at any time, subject to legal obligations that may
          require continued retention.
        </p>
      );

    case "children-privacy":
      return (
        <p>
          For users under the age of 18, schools must ensure that parental
          consent is obtained before sharing any personal data with us. We
          comply with local and international regulations on data protection for
          minors.
        </p>
      );

    case "changes-policy":
      return (
        <p>
          We may update this Privacy Policy periodically. Users will be notified
          of significant changes via email or platform notifications. Continued
          use of the platform after updates constitutes acceptance of the
          revised policy.
        </p>
      );

    default:
      return null;
  }
};

export default PrivacyPolicy;
