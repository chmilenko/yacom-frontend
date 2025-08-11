import React, { useState, useRef } from "react";
import "./Button.scss";

function Button({ text, onClick, icon, className, type = "default" }) {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const handleClick = (e) => {
    // 1. Запускаем анимацию
    setIsActive(true);
    clearTimeout(timerRef.current);

    // 2. Вызываем переданный onClick (если есть)
    if (onClick) onClick(e);

    // 3. Сбрасываем анимацию через 200 мс, даже если onClick вызвал перерендер
    timerRef.current = setTimeout(() => {
      setIsActive(false);
    }, 200);
  };

  // Очистка таймера при размонтировании
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
