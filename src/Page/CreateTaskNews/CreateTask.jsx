import React, { useEffect } from "react";
import { useCreateTaskNews } from "../../Core/Context/CreateTaskNews";
import "./CreateTask.scss";

function CreateTask() {
  const {
    setChapters,
    setResultTypes,
    chapters,
    tasksType,
    taskFormData,
    updateTaskFormData,
    createTaskError,
    clearErrors,
  } = useCreateTaskNews();

  useEffect(() => {
    setChapters();
    setResultTypes();

    return () => clearErrors();
  }, [clearErrors, setChapters, setResultTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTaskFormData(name, value);
  };

  const getValue = (value) => {
    return value === null ? "" : value;
  };

  return (
    <div className="tasks_container">
      <div className="create_task_form">
        <div className="form_group">
          <label htmlFor="chapter">
            Раздел <span className="required">*</span>
          </label>
          <select
            id="chapter"
            name="chapter"
            value={getValue(taskFormData.chapter)}
            onChange={handleChange}
            className={`form_select ${createTaskError?.chapter ? "error" : ""}`}
            disabled={!chapters.length}
          >
            <option value="">Выберите раздел</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
          {createTaskError?.chapter && (
            <span className="error_text">{createTaskError.chapter}</span>
          )}
        </div>

        <div className="form_group">
          <label htmlFor="subdivision">Подразделение</label>
          <input
            type="text"
            id="subdivision"
            name="subdivision"
            value={taskFormData.subdivision || "Т054 Томск, Тверская 81"}
            readOnly
            className="form_input readonly"
          />
          <div className="hint">Заполняется автоматически</div>
        </div>

        <div className="form_group">
          <label htmlFor="resultType">
            Тип результата <span className="required">*</span>
          </label>
          <select
            id="resultType"
            name="resultType"
            value={getValue(taskFormData.resultType)}
            onChange={handleChange}
            className={`form_select ${
              createTaskError?.resultType ? "error" : ""
            }`}
            disabled={!tasksType.length}
          >
            <option value="">Выберите тип результата</option>
            {tasksType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {createTaskError?.resultType && (
            <span className="error_text">{createTaskError.resultType}</span>
          )}
        </div>

        <div className="form_group">
          <label htmlFor="title">
            Заголовок <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={getValue(taskFormData.title)}
            onChange={handleChange}
            placeholder="Введите заголовок задачи"
            className={`form_input ${createTaskError?.title ? "error" : ""}`}
            maxLength={100}
          />
          <div className="under_text">
            <div className="char_counter">
              {String(taskFormData.title || "").length}/100 символов
            </div>
            {createTaskError?.title && (
              <span className="error_text">{createTaskError.title}</span>
            )}
          </div>
        </div>

        <div className="form_group">
          <label htmlFor="deadline">
            Выполнить до <span className="required">*</span>
          </label>
          <input
            type="date"
            name="deadline"
            id="deadline"
            className={`form_select ${
              createTaskError?.deadline ? "error" : ""
            }`}
            value={getValue(taskFormData.deadline)}
            onChange={handleChange}
          />
          {createTaskError?.deadline && (
            <span className="error_text">{createTaskError.deadline}</span>
          )}
        </div>

        <div className="form_group">
          <label htmlFor="content">
            Содержание <span className="required">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={getValue(taskFormData.content)}
            onChange={handleChange}
            placeholder="Опишите подробности задачи..."
            className={`form_textarea ${
              createTaskError?.content ? "error" : ""
            }`}
            rows={5}
            maxLength={1000}
          />
          <div className="under_text">
            <div className="char_counter">
              {String(taskFormData.content || "").length}/1000 символов
            </div>
            {createTaskError?.content && (
              <span className="error_text">{createTaskError.content}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
