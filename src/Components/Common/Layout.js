import React from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMsg,
  setShowError,
} from "../../Store/Slices/Common/Alerts/alertsSlice";
import OfflineModal from "./Offline";
const Layout = ({ children, title, description, keywords, author }) => {
  const dispatch = useDispatch();
  const { showError, errorMsg } = useSelector(
    (store) => store?.common?.alertMsg
  );
  const handleDismiss = () => {
    dispatch(setShowError(false));
    dispatch(setErrorMsg(""));
  };
  return (
    <div>
      {showError && errorMsg && (
        <OfflineModal error={errorMsg} onDismiss={handleDismiss} />
      )}
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
