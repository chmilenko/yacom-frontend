// src/components/UI/CustomSelect/CustomSelect.jsx
import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.scss";

const CustomSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Выберите значение",
  required = false,
  disabled = false,
  error = null,
  className = "",
  optionLabel = "name",
  optionValue = "id",
  showError = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  // Фильтрация опций по поиску
  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option[optionLabel].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Фокус на поле поиска при открытии
  useEffect(() => {
    if (isOpen && searchRef.current && options.length > 10) {
      searchRef.current.focus();
    }
  }, [isOpen, options.length]);

  // Получение выбранной метки
  const getSelectedLabel = () => {
    if (!value) return placeholder;
    const selected = options.find((option) => option[optionValue] === value);
    return selected ? selected[optionLabel] : placeholder;
  };

  // Обработка выбора опции
  const handleOptionClick = (option) => {
    onChange(name, option[optionValue], option[optionLabel]);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Обработка клавиатуры
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
    if (e.key === "Enter" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`custom-select-container ${className}`}>
      {label && (
        <label htmlFor={id} className="custom-select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div
        ref={wrapperRef}
        className={`custom-select-wrapper ${error ? "error" : ""}`}
      >
        <div
          className={`custom-select ${isOpen ? "open" : ""} ${
            disabled ? "disabled" : ""
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-options`}
        >
          <div className="custom-select__selected">{getSelectedLabel()}</div>
          <div className="custom-select__arrow">▼</div>
        </div>

        {isOpen && !disabled && (
          <div className="custom-select__dropdown" id={`${id}-options`}>
            {/* Поле поиска для длинных списков */}
            {options.length > 10 && (
              <div className="custom-select__search">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="custom-select__search-input"
                />
              </div>
            )}

            {/* Список опций */}
            <div className="custom-select__options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option[optionValue]}
                    className={`custom-select__option ${
                      value === option[optionValue] ? "selected" : ""
                    }`}
                    onClick={() => handleOptionClick(option)}
                    role="option"
                    aria-selected={value === option[optionValue]}
                  >
                    {option[optionLabel]}
                  </div>
                ))
              ) : (
                <div className="custom-select__no-results">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showError && error && (
        <span className="custom-select-error">{error}</span>
      )}
    </div>
  );
};

export default CustomSelect;
