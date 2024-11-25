// Helper function to format the date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to format the academic year
export const formatAcademicYear = (academicYear, startDate, endDate) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  return {
    academicYear,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};
