import React from "react";

const InputField = ({ label, name, type, value, onChange, error, options }) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      {type === "select" ? (
        <select id={name} name={name} value={value} onChange={onChange}>
          <option value="">Select...</option>
          {options.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label}`}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;
