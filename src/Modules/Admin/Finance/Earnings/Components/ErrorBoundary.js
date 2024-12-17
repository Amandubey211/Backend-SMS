// src/components/ErrorBoundary.jsx

import React from "react";
import { Alert } from "antd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI
      return (
        <Alert
          message="Something went wrong."
          description="An unexpected error occurred. Please try again later."
          type="error"
          showIcon
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
