// dummyData.js
import { FaCircle } from 'react-icons/fa';

import { IoCloseCircle,IoCheckmarkCircle  } from "react-icons/io5";

export const students = [
  { id: '548696', name: 'Esther Howard' },
  { id: '548696', name: 'Dianne Russell' },
  { id: '548696', name: 'Jenny Wilson' },
  { id: '548696', name: 'Leslie Alexander' },
  { id: '548696', name: 'Wade Warren' },
  { id: '548696', name: 'Jerome Bell' },
  { id: '548696', name: 'Jacob Jones' },
  { id: '548696', name: 'Kathryn Murphy' },
];

export const attendanceData = students.map(student => {
  return {
    ...student,
    attendance: [...Array(20).keys()].map(() => {
      const statuses = [<IoCheckmarkCircle className="text-green-500" />, <IoCloseCircle className="text-red-500" />, <FaCircle className="text-yellow-500" />];
      return statuses[Math.floor(Math.random() * statuses.length)];
    })
  };
});
