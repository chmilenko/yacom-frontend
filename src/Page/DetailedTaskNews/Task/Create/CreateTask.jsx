// src/components/CreateTask/CreateTask.jsx
import React, { useEffect } from "react";
import { useCreateTaskNews } from "../../../../Core/Context/CreateTaskNews";

import "./CreateTask.scss";
import CustomSelect from "../../../../Ui/CustomSelect/CustomSelect";
import { useAppStore } from "../../../../Core/Context/AppStateContext";

function CreateTask() {
  const {
    setChapters,
    setResultTypes,
    chapters,
    taskFormData,
    updateTaskFormData,
    createTaskError,
    clearErrors,
    resultTypes,
  } = useCreateTaskNews();
  const { user } = useAppStore();

  useEffect(() => {
    setChapters();
    setResultTypes();
    return () => clearErrors();
  }, []);

  const handleSelectChange = (name, value) => {
    updateTaskFormData(name, value);
  };

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
        <CustomSelect
          id="chapter"
          name="chapter"
          label="Раздел"
          value={taskFormData?.chapter}
          onChange={handleSelectChange}
          options={chapters || []}
          placeholder="Выберите раздел"
          required={true}
          disabled={!chapters?.length}
          error={createTaskError?.chapter}
          optionLabel="name"
          optionValue="id"
        />

        <div className="form_group">
          <label htmlFor="subdivision">Подразделение</label>
          <input
            type="text"
            id="subdivision"
            name="subdivision"
            value={user?.subdivisionName || ""}
            readOnly
            className="form_input readonly"
          />
          <div className="hint">Заполняется автоматически</div>
        </div>

        <CustomSelect
          id="resultType"
          name="resultType"
          label="Тип результата"
          value={taskFormData?.resultType}
          onChange={handleSelectChange}
          options={resultTypes || []}
          placeholder="Выберите тип результата"
          required={true}
          disabled={!resultTypes?.length}
          error={createTaskError?.resultType}
          optionLabel="name"
          optionValue="id"
        />

        <div className="form_group">
          <label htmlFor="title">
            Заголовок <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={getValue(taskFormData?.title)}
            onChange={handleChange}
            placeholder="Введите заголовок задачи"
            className={`form_input ${createTaskError?.title ? "error" : ""}`}
            maxLength={100}
          />
          <div className="under_text">
            <div className="char_counter">
              {String(taskFormData?.title || "")?.length}/100 символов
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
            value={getValue(taskFormData?.deadline)}
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
            value={getValue(taskFormData?.content)}
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
              {String(taskFormData?.content || "").length}/1000 символов
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
