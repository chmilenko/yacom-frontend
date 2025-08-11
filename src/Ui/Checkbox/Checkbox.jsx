import React from "react";
import "./Checkbox.css";

function Checkbox({ id, checked, readonly, className }) {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={id}
        className="checkbox"
        checked={checked}
        readOnly={readonly}
      />
      <label
        htmlFor={id}
        className={`checkbox-label ${className && className}`}
      ></label>
    </div>
  );
}

export default Checkbox;
