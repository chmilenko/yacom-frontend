// Errors.js
import { useState } from "react";
import { useErrorsStore } from "../../Core/Store/ErrorsStore";
import "./Errors.scss";

const Errors = () => {
  const {
    errorHistory,
    clearErrorHistory,
    removeErrorFromHistory,
    getErrorHistoryByType,
  } = useErrorsStore();

  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredErrors = getErrorHistoryByType(selectedType).filter(
    (error) =>
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.context?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#ff4444";
      case "error":
        return "#ff6666";
      case "warning":
        return "#ffbb33";
      default:
        return "#33aaff";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("ru-RU");
  };

  const errorTypes = [
    { value: "", label: "Все ошибки" },
    { value: "parsing", label: "Ошибки парсинга" },
    { value: "network", label: "Сетевые ошибки" },
    { value: "library", label: "Ошибки библиотек" },
    { value: "application", label: "Ошибки приложения" },
  ];

  return (
    <div className="errors-page">
      <div className="errors-header">
        <h1>Журнал ошибок React</h1>
        <div className="errors-controls">
          <input
            type="text"
            placeholder="Поиск по ошибкам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="errors-search"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="errors-type-filter"
          >
            {errorTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button
            onClick={clearErrorHistory}
            className="clear-history-btn"
            disabled={errorHistory.length === 0}
          >
            Очистить историю
          </button>
        </div>
      </div>

      <div className="errors-stats">
        <div className="stat-item">
          <span className="stat-label">Всего ошибок:</span>
          <span className="stat-value">{errorHistory.length}</span>
        </div>
        {errorTypes.slice(1).map((type) => (
          <div key={type.value} className="stat-item">
            <span className="stat-label">{type.label}:</span>
            <span className="stat-value">
              {getErrorHistoryByType(type.value).length}
            </span>
          </div>
        ))}
      </div>

      <div className="errors-list">
        {filteredErrors.length === 0 ? (
          <div className="no-errors">
            {errorHistory.length === 0
              ? "Ошибок не зарегистрировано"
              : "Ошибки не найдены по текущим фильтрам"}
          </div>
        ) : (
          filteredErrors.map((error) => (
            <div key={error.id} className="error-item">
              <div
                className="error-severity-indicator"
                style={{ backgroundColor: getSeverityColor(error.severity) }}
              />
              <div className="error-content">
                <div className="error-header">
                  <span className="error-message">{error.message}</span>
                  <div className="error-actions">
                    <span className="error-time">
                      {formatDate(error.timestamp)}
                    </span>
                    <button
                      onClick={() => removeErrorFromHistory(error.id)}
                      className="remove-error-btn"
                      title="Удалить из истории"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="error-meta">
                  <span className="error-type">Тип: {error.type}</span>
                  <span className="error-severity">
                    Важность: {error.severity}
                  </span>
                  {error.context && (
                    <span className="error-context">
                      Контекст: {error.context}
                    </span>
                  )}
                  {error.page && (
                    <span className="error-page">Страница: {error.page}</span>
                  )}
                </div>
                {error.details && (
                  <div className="error-details">
                    <details>
                      <summary>Подробности ошибки</summary>
                      <pre>{error.details}</pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Errors;
