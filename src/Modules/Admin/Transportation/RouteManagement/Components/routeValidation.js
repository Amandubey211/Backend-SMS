export const validateRoute = (selectedStops) => {
  const hasStartPoint = selectedStops.some((s) => s.isStartingPoint);
  const hasEndPoint = selectedStops.some((s) => s.isEndingPoint);
  return { hasStartPoint, hasEndPoint };
};

export const validateUserAssignment = (assignment, allUsers) => {
  // Validation logic for user assignments
};
