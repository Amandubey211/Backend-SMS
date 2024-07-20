import React from "react";

const EventItem = ({ image, eventName, eventType, startDate }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full mr-4"
          src={
            image ||
            "https://s3-alpha-sig.figma.com/img/f636/7e20/0cc907d7a02394649ceba400d904098f?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Flt7AuzK5TVaS4-wXMljvvcD2gJf0ht0u6TfRf0QB0JPX2cCb0DNNj2Y-gkePphVR3-C9Je67Omz9bVF-YQ-kWi~EciNrCTGPAE5C3JPfGT~MR4l0AVUnFzf7AJhHhskg99~iNzl2QEEUi2I~gNALmxLXlkn7owJmeLDCZrTI38ADwFER7QTiUWi-RO7~wrXgw1skWNTbVcCFamMqY7awJvV6q52VU4y2pfOckIz6q9vD9S7R-3sO-o0nQKF45-nBuwTzYSoWvfQREbb3bFmpmry3bptvHMfBT~eXNKox-OT7sn4QOKn5RaED5HqRKgt8MIyj2MpQzpJDUK6TXOVSA__"
          }
          alt={eventName}
        />
        <p className="text-md   text-gray-900 truncate" title={eventName}>
          {eventName}
        </p>
      </div>
      <p className="text-sm text-gray-500">{eventType}</p>
      <p className="text-sm text-gray-500">{startDate}</p>
    </div>
  );
};

export default EventItem;
