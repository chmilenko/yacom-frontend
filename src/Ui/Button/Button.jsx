import React, { useState, useRef, useEffect } from "react";
import "./Button.scss";

function Button({ text, onClick, icon, className, type = "default" }) {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);
  const touchStartedRef = useRef(false);

  const handleInteractionStart = () => {
    setIsActive(true);
    touchStartedRef.current = true;
  };

  const handleInteractionEnd = (e) => {
    if (!touchStartedRef.current) return;

    clearTimeout(timerRef.current);

    if (onClick) {
      setTimeout(() => onClick(e), 50);
    }

    timerRef.current = setTimeout(() => {
      setIsActive(false);
      touchStartedRef.current = false;
    }, 200);
  };

  const handleTouchCancel = () => {
    setIsActive(false);
    touchStartedRef.current = false;
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <button
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleTouchCancel}
      className={`button_base ${type}_button ${className || ""} ${
        isActive ? "active" : ""
      }`}
      onTouchMove={(e) => e.preventDefault()}
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
