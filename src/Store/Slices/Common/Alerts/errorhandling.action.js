import { setErrorMsg, setShowError } from "./alertsSlice";

export const ErrorMsg = (error) => {
  // console.log("----msg", error);
  if (error.response) {
    const statusCode = error.response.status;
    const msg = error.response.data?.message || error.response.data?.msg;

    switch (statusCode) {
      case 400:
        return {
          message:
            msg ||
            "Oops! Something seems off. Please check your input and try again.",
          statusCode,
        };
      case 401:
        return {
          message: msg || "You need to log in to access this feature.",
          statusCode,
        };
      case 403:
        return {
          message:
            msg ||
            "Access denied. You do not have permission to view this resource.",
          statusCode,
        };
      case 404:
        return {
          message: msg || "Sorry! We couldn’t find what you’re looking for.",
          statusCode,
        };
        case 429:
        return {
          message:"Too many request try again after 15min.",
          statusCode,
        };
      case 500:
        return {
          message:
            "We’re experiencing technical difficulties. Please try again later.",
          statusCode,
        };
      case 503:
        return {
          message:
            "The service is temporarily unavailable. Please try again shortly.",
          statusCode,
        };
      default:
        return { message: "An unexpected error occurred.", statusCode };
    }
  } else if (error.request) {
    return {
      message:
        "Network error: Unable to reach the server. Please check your connection.",
      statusCode: null,
    };
  } else {
    return {
      message:
        "An error occurred while processing your request. Please try again.",
      statusCode: null,
    };
  }
};

export const handleError = (error, dispatch, rejectWithValue) => {
  console.error(error);
  const err = ErrorMsg(error);
  dispatch(setShowError(true)); // Show the error message
  dispatch(setErrorMsg(err.message)); // Set the error message
  return rejectWithValue(err.message);
};
