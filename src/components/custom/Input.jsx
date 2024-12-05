/* eslint-disable react/prop-types */
const Input = ({
  id,
  label = "",
  type = "text",
  placeholder = "",
  mandatory = false,
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
        <label htmlFor={id} className="font-medium">
          {label}
          {mandatory && "*"}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full px-2 ${
          size === "lg" ? "text-lg py-2" : "py-1"
        } outline-none border-2 border-solid ${
          isInvalid ? "border-red-400 animate-shake" : "border-neutral-300"
        }  rounded-md`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
      />
    </>
  );
};

export default Input;
