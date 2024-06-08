const PointsInput = ({ points, handleChange }) => (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-700">Points</label>
      <input
        type="number"
        name="points"
        value={points}
        onChange={handleChange}
        className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </>
  );
  
  export default PointsInput;