import { useState } from "react";

export function InputField({
  placeholder = "",
  type = "text",
  value = "",
  name = "",
  onChange,
  constraints = {},
  fClassName,
  lClassName,
  iClassName,
  colors: {
    success = "text-green-500 border-green-500",
    initial = "text-amber-500 border-amber-500",
    error = "text-red-500 border-red-500",
  } = {},
}) {
  const [focused, setFocused] = useState(false);

  function validate(v) {
    if (Object.keys(constraints).includes("dataType")) {
      if (constraints["dataType"] === "integer") {
        if (!isValidInteger(v)) {
          return false;
        }
      }
      if (constraints["dataType"] === "float") {
        if (!isValidFloat(v)) {
          return false;
        }
      }
    }
    if (Object.keys(constraints).includes("length")) {
      if (v.length > constraints["length"]) {
        return false;
      }
    }

    return true;
  }

  function handleChange(e) {
    if (validate(e.target.value)) {
      onChange(e.target.name, e.target.value);
    }
  }

  const isValidInteger = (v) => {
    if ((v + "").match(/[^0-9]/)) {
      return false;
    }
    return true;
  };

  const isValidFloat = (v) => {
    if ((v + "").match(/[^\.0-9]/)) {
      return false;
    }
    if ((v + "").match(/\./g)) {
      if ((v + "").match(/\./g).length > 1) {
        return false;
      }
    }
    return true;
  };

  let lengthSatisfied = Object.keys(constraints).includes("length")
    ? constraints["length"] === (value + "").length
      ? true
      : false
    : true;

  if (Object.keys(constraints).includes("min")) {
    if (constraints["min"] > (parseFloat(value) ? parseFloat(value) : 0)) {
      lengthSatisfied = false;
    }
  }

  if (Object.keys(constraints).includes("max")) {
    if ((parseFloat(value) ? parseFloat(value) : 0) > constraints["max"]) {
      lengthSatisfied = false;
    }
  }

  return (
    <fieldset
      className={`border float-none px-2 rounded ${
        constraints["disabled"]
          ? "border-2 border-gray-500"
          : focused
          ? validate(value)
            ? Object.keys(constraints).includes("length") ||
              Object.keys(constraints).includes("max") ||
              Object.keys(constraints).includes("min")
              ? lengthSatisfied
                ? success
                : error
              : success
            : error
          : initial
      } ${fClassName}`}
    >
      <legend
        className={`float-none w-auto text-sm ${
          (value + "").length > 0 ? "block " : "hidden"
        } ${lClassName}`}
      >
        {placeholder}
      </legend>
      <input
        onFocus={() => {
          setFocused(true);
        }}
        value={value}
        name={name}
        onChange={handleChange}
        type={type}
        className={`${
          (value + "").length > 0 ? "mb-2" : "py-2"
        } outline-none peer-aria-hidden:py-2 px-4 w-full bg-transparent ${iClassName}`}
        placeholder={placeholder}
        required
        disabled={Boolean(constraints["disabled"])}
      />
    </fieldset>
  );
}
