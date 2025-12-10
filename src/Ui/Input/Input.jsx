import "./input.scss";

const SearchInput = ({ value, onChange, additionalFunc }) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="search-container">
      <span
        className={`material-symbols-outlined search ${value ? "hidden" : ""}`}
      >
        search
      </span>
      <input
        type="text"
        value={value}
        className={`input ${value && "focus_input"}`}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск..."
      />
      {value && (
        <span
          className="material-symbols-outlined clear-icon"
          onClick={() => {
            handleClear();
            if (additionalFunc) {
              additionalFunc();
            }
          }}
        >
          close
        </span>
      )}
    </div>
  );
};

export default SearchInput;
