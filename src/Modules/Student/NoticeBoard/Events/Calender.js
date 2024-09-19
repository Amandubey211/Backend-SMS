<Calendar
dateCellRender={handleDateCellRender}
headerRender={({ value, type, onChange, onTypeChange }) => {
  const start = 0;
  const end = 12;
  const monthOptions = [];

  const localeData = value.localeData();
  const months = localeData.monthsShort();

  for (let index = start; index < end; index++) {
    monthOptions.push(
      <option key={index} value={index}>
        {months[index]}
      </option>
    );
  }

  const year = value.year();
  const month = value.month();
  const options = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    options.push(
      <option className="bg-white" key={i} value={i}>
        {i}
      </option>
    );
  }
  return (
    <div className="flex items-center space-x-2 justify-end mt-2 pt-2 mb-4">
      <select
        className="border rounded px-2 py-1"
        value={year}
        onChange={(event) => {
          const newYear = parseInt(event.target.value, 10);
          const now = value.clone().year(newYear);
          setSelectedMonthYear((prev) => ({
            ...prev,
            year: newYear,
          }));
          onChange(now);
        }}
      >
        {options}
      </select>
      <select
        className="border rounded px-2 py-1"
        value={month}
        onChange={(event) => {
          const newMonth = parseInt(event.target.value, 10);
          const now = value.clone().month(newMonth);
          setSelectedMonthYear((prev) => ({
            ...prev,
            month: newMonth,
          }));
          onChange(now);
        }}
      >
        {monthOptions}
      </select>
      <div className="flex space-x-2">
        <button
          className={`border rounded px-2 py-1 ${type === "month"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              : ""
            }`}
          onClick={() => onTypeChange("month")}
        >
          Month
        </button>
        <button
          className={`border rounded px-2 py-1 ${type === "year"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              : ""
            }`}
          onClick={() => onTypeChange("year")}
        >
          Year
        </button>
      </div>
    </div>
  );
}}
/>

export default ca