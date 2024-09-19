import React from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
const Layout = ({ children, title, description, keywords, author }) => {
  // const role = useSelector((store) => store.common.auth.role);
  // useNavHeading(role);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <main style={{ minHeight: "100vh" }}>
        <Toaster />

        {children}
      </main>
    </div>
  );
};

export default Layout;
