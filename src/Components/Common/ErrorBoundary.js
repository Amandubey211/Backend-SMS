// ./Components/Common/ErrorBoundary.jsx
import React from "react";
import { motion } from "framer-motion"; // for smooth animations
import { Button } from "antd"; // for Ant Design components

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(/* error */) {
    // Update state so next render shows a fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to a service or console
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  handleRefresh = () => {
    // Optionally, you could also navigate back or do something else
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          {/* Animate the wrapper to fade in & slide up */}
          <motion.div
            className="p-6 bg-white shadow-lg rounded-md flex flex-col items-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-2xl font-semibold mb-2 text-red-600">
              Oops! Something went wrong.
            </h1>
            <p className="text-gray-600 mb-4 text-center max-w-xs">
              We’re sorry for the inconvenience. Please try refreshing the page
              or contact support if the issue persists.
            </p>
            <Button type="primary" onClick={this.handleRefresh}>
              Refresh Page
            </Button>
          </motion.div>
        </div>
      );
    }

    // If no error, just render the children
    return this.props.children;
  }
}

export default ErrorBoundary;
