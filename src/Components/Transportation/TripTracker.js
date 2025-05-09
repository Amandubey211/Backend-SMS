import React, { useState } from "react";
import { useTripLocationSocket } from "../../Hooks/Transportation/useTripLocationSocket";

const TripTracker = ({ tripId }) => {
  const [location, setLocation] = useState(null);

  useTripLocationSocket(tripId, (data) => {
    setLocation(data);
  });

  console.log("location is--->",location)

  return (
    <div>
      <h2>Live Trip Location</h2>
    </div>
  );
};

export default TripTracker;
