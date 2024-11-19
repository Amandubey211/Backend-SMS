// src/pages/CookiePolicy.jsx

import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import Layout from "../../../Components/Common/Layout";
import { FaCookieBite } from "react-icons/fa";
import { Link, Element } from "react-scroll";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "what-are-cookies", title: "2. What Are Cookies?" },
  { id: "types-of-cookies", title: "3. Types of Cookies We Use" },
  { id: "how-we-use-cookies", title: "4. How We Use Cookies" },
  {
    id: "managing-cookie-preferences",
    title: "5. Managing Cookie Preferences",
  },
  { id: "third-party-cookies", title: "6. Third-Party Cookies" },
  { id: "data-privacy", title: "7. Data Privacy and Security" },
  { id: "changes-cookie-policy", title: "8. Changes to This Cookie Policy" },
  { id: "contact-us", title: "Contact Us" },
];

const CookiePolicy = () => {
  return (
    <Layout title="Cookie Policy | Student Diwan">
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
              <FaCookieBite
                className="text-pink-600 mr-2"
                size={42}
                aria-hidden="true"
              />
              <div className="flex flex-col items-start">
                <p className="text-2xl font-semibold font-serif">
                  Cookie Policy
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
              {sections.map((section) => (
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
          {sections.map((section) => (
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
          This Cookie Policy explains how Student Diwan ("we," "us," "our") uses
          cookies and similar tracking technologies on our platform. By using
          our services, you agree to our use of cookies as described in this
          policy. For further information on how we handle your data, please
          refer to our{" "}
          <Link
            to="privacy-policy"
            className="text-blue-600 hover:underline"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      );

    case "what-are-cookies":
      return (
        <p>
          Cookies are small files stored on your device when you access our
          platform. They allow us to recognize your device, improve your
          experience, and provide secure access to platform features.
        </p>
      );

    case "types-of-cookies":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Essential Cookies:</strong> These are necessary for the
            platform to function correctly. They enable core functionalities,
            such as user authentication and secure login.
          </li>
          <li>
            <strong>Performance and Analytics Cookies:</strong> These cookies
            help us understand how users interact with the platform, providing
            insights into areas for improvement. We use this data to optimize
            performance and enhance user experience.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These cookies remember your
            preferences and settings to improve functionality. They enable
            personalized experiences, such as remembering your language or
            layout preferences.
          </li>
        </ul>
      );

    case "how-we-use-cookies":
      return (
        <ul className="list-disc list-inside space-y-2">
          <li>Keeping users logged into the platform for secure sessions.</li>
          <li>Analyzing platform usage and performance metrics.</li>
          <li>
            Enhancing user experience by saving preferences and customizing
            functionality.
          </li>
        </ul>
      );

    case "managing-cookie-preferences":
      return (
        <>
          <p>
            Most browsers allow you to manage cookie settings. You can modify
            your browser settings to accept or refuse cookies or to notify you
            when cookies are set. Please note that disabling cookies may impact
            the functionality of the platform.
          </p>
          <p>
            <strong>Steps to Manage Cookies:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-6">
            <li>
              <strong>For Chrome:</strong> Go to Settings &gt; Privacy and
              Security &gt; Cookies and other site data.
            </li>
            <li>
              <strong>For Safari:</strong> Go to Preferences &gt; Privacy.
            </li>
            <li>
              <strong>For Firefox:</strong> Go to Options &gt; Privacy &
              Security &gt; Cookies and Site Data.
            </li>
            <li>
              <strong>For Edge:</strong> Go to Settings &gt; Site Permissions
              &gt; Cookies and site data.
            </li>
          </ul>
        </>
      );

    case "third-party-cookies":
      return (
        <p>
          Student Diwan uses third-party service providers, such as AWS for
          hosting, which may set cookies on our platform to facilitate their
          services. These providers are contractually bound to use information
          solely for authorized purposes and are restricted from using data for
          other activities.
        </p>
      );

    case "data-privacy":
      return (
        <p>
          All data collected via cookies is used in compliance with Qatar’s data
          protection laws. Any data obtained through cookies is processed in
          accordance with our{" "}
          <Link
            to="privacy-policy"
            className="text-blue-600 hover:underline"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          , ensuring data confidentiality and security.
        </p>
      );

    case "changes-cookie-policy":
      return (
        <p>
          We may update this Cookie Policy periodically. Any changes will be
          communicated to users via the platform. Continued use of the platform
          constitutes acceptance of the updated Cookie Policy.
        </p>
      );

    case "contact-us":
      return (
        <p>
          If you have any questions about our use of cookies, please contact us
          at:
          <br />
          Email:{" "}
          <a
            href="mailto:info@studentdiwan.com"
            className="text-blue-600 hover:underline"
          >
            info@studentdiwan.com
          </a>
          <br />
          Country: Qatar
        </p>
      );

    default:
      return null;
  }
};

export default CookiePolicy;
