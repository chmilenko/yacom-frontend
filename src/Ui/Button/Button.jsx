import React, { useState, useRef } from "react";
import "./Button.scss";

function Button({ text, onClick, icon, className, type = "default" }) {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    setIsActive(true);
    clearTimeout(timerRef.current);

    if (onClick) onClick(e);

    timerRef.current = setTimeout(() => {
      setIsActive(false);
    }, 200);
  };

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <button
      onClick={handleClick}
      className={`button_base ${type}_button ${className || ""} ${
        isActive ? "active" : ""
      }`}
    >
      {text}
      {icon && (
        <span className="button_icon-wrapper">
          {React.cloneElement(icon, {
            className: `${icon.props.className} button_icon`,
          })}
        </span>
      )}
    </button>
  );
}

export default Button;
