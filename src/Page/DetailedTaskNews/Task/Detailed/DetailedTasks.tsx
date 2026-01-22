import React, { useEffect } from "react";

import "./DetailedTask.scss";
import Button from "../../../../Ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useActionsStore } from "../../../../Core/Store/ActionsStore";
import clickTo1C from "../../../../Utils/clicker";
import { useCreateTaskStore } from "../../../../Core/Store/CreateTaskNews";
import { useAppModeStore } from "../../../../Core/Store/AppModeStore";
import DoneImg from "./DoneImg";

function DetailedTask() {
  const { setFullTasks, fullTasks } = useCreateTaskStore();
  const { useMockData } = useAppModeStore();

  const { setActions } = useActionsStore();

  const navigate = useNavigate();

  useEffect(() => {
    useMockData && setFullTasks("");
  }, []);

  const handleClickCard = (id) => {
    if (useMockData) {
      navigate(`/task/full/${id}`);
    } else {
      setActions({
        actionName: "clickElement",
        page: "oneTask",
        active: true,
        TaskId: id,
      });
      !useMockData && clickTo1C();
      navigate(`/task/full/${id}`);
    }
  };

  return (
    <div>
      <div className="task_list_container">
        {fullTasks.map((task) => (
          <div
            key={task.TaskID}
            className="task_card"
            onClick={() => handleClickCard(task.TaskID)}
          >
            <div className="task_header">
              <DoneImg done={task.Done} />
              <div className="task_tag_title">
                <span className="tag_badge">{task.tagTitle}</span>
              </div>
              <div className="task_date">
                <span className="date_icon">📅</span>
                <span className="date_text">
                  {task.date
                    ? new Date(task.date)
                        .toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, ".")
                    : ""}
                </span>
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
                  <img src={task.Tag} alt="" className="sub_tag_icon" />
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

export default DetailedTask;
