import { ChangeEvent } from "react";
import "./input.scss";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  additionalFunc?: () => void;
  placeholder?: string;
  className?: string;
  type?: "text" | "password" | "email" | "search";
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  minLength?: number;
  maxLength?: number;
}

const Input = ({
  value,
  onChange,
  additionalFunc,
  placeholder = "Поиск...",
  className = "",
  type = "text",
  disabled = false,
  autoFocus = false,
  name,
  minLength,
  maxLength,
}: InputProps) => {
  const handleClear = () => {
    onChange("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClearClick = () => {
    handleClear();
    if (additionalFunc) {
      additionalFunc();
    }
  };

  return (
    <div className={`search-container ${className}`.trim()}>
      <span
        className={`material-symbols-outlined search ${value ? "hidden" : ""}`}
        aria-hidden="true"
      >
        search
      </span>
      <input
        type={type}
        value={value}
        className={`input ${value && "focus_input"}`}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClearClick();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        aria-label={placeholder}
      />
      {value && (
        <span
          className="material-symbols-outlined clear-icon"
          onClick={handleClearClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClearClick();
            }
          }}
          aria-label="Очистить поле поиска"
        >
          close
        </span>
      )}
    </div>
  );
};

export default Input;
