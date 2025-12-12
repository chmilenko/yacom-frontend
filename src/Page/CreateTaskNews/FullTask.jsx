import React, { useEffect } from "react";
import { useCreateTaskNews } from "../../Core/Context/CreateTaskNews";
import "./FullTask.scss";
import Button from "../../Ui/Button/Button";
function FullTask() {
  const { setFullTask, fullTasks } = useCreateTaskNews();

  useEffect(() => {
    setFullTask();
  }, []);

  if (!fullTasks.length) {
    return (
      <div className="task_list_empty">
        <div className="empty_icon">📋</div>
        <p className="empty_text">Нет активных задач</p>
        <p className="empty_hint">Создайте первую задачу</p>
      </div>
    );
  }

  return (
    <div>
      <div className="task_list_container">
        {fullTasks.map((task) => (
          <div key={task.id} className="task_card">
            <div className="task_header">
              <img
                src={task.mainTag}
                alt="Метка задачи"
                className="main_tag_icon"
              />
              <div className="task_tag_title">
                <span className="tag_badge">{task.tagTitle}</span>
              </div>
              <div className="task_date">
                <span className="date_icon">📅</span>
                <span className="date_text">{task.date}</span>
              </div>
            </div>

            <div className="task_divider"></div>

            <div className="task_body">
              <h3 className="task_title">{task.title}</h3>

              <div className="task_deadline">
                <span className="deadline_icon">⏰</span>
                <span className="deadline_label">Выполнить до:</span>
                <span className="deadline_date">{task.deadline}</span>
              </div>

              <div className="task_footer">
                <div className="task_creator">
                  <span className="creator_icon">👤</span>
                  <span className="creator_name">{task.creator}</span>
                </div>

                <div className="task_sub_tag">
                  <img
                    src={task.subTag}
                    alt="Дополнительная метка"
                    className="sub_tag_icon"
                  />
                  <div className="sub_tag_fallback">🔖</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="task_list_action">
        <Button text="Задачи за December" />
      </div>
    </div>
  );
}

export default FullTask;
