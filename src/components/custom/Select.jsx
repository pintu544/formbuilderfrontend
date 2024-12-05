/* eslint-disable react/prop-types */
const Select = ({
  id,
  label = "",
  placeholder = "",
  mandatory = false,
  list = [],
  disabled = false,
  value = "",
  onChange = () => {},
  name = "",
  isInvalid = false,
  size = "base",
}) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className="font-bold">
          {label}
          {mandatory && "*"}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-2 ${
          size === "lg" ? "text-lg py-2" : "text-sm py-1"
        } outline-none border-2 border-solid ${
          isInvalid ? "border-red-400" : "border-neutral-300"
        } rounded-md`}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && (
          <option disabled={true} value="" className="p-1">
            {placeholder}
          </option>
        )}
        {list.map((item, i) => (
          <option key={i} value={item.value} className="p-1">
            {item.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
