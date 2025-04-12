import AsyncSelect from "react-select/async";
import { components } from "react-select";

const SearchableSelect = ({
  name,
  icon,
  tooltip,
  placeholder,
  loadOptions,
  defaultOptions,
  value,
  onChange,
}) => {
  const CustomControl = ({ children, ...props }) => (
    <components.Control {...props}>
      {icon && (
        <span className="mr-2 text-gray-400" title={tooltip}>
          {icon}
        </span>
      )}
      {children}
    </components.Control>
  );

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      onChange={(selected) => onChange(selected)}
      components={{ Control: CustomControl }}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "32px",
          height: "32px",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: "4px",
        }),
        clearIndicator: (base) => ({
          ...base,
          padding: "4px",
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0px 8px",
        }),
        input: (base) => ({
          ...base,
          margin: "0px",
          paddingBottom: "0px",
          paddingTop: "0px",
        }),
      }}
    />
  );
};
