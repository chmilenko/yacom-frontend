import React, { useEffect, useState } from "react";

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

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    useMockData && setFullTasks("");
    initMonths();
  }, []);

  const initMonths = () => {
    const monthsArray: string[] = [];

    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArray.push(formatMonthFor1C(date));
    }

    setMonths(monthsArray);
  };

  const formatMonthFor1C = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}${month}${day}`;
  };

  const formatMonthForDisplay = (yyyyMMdd: string): string => {
    if (!yyyyMMdd || yyyyMMdd.length !== 8) {
      return "текущий месяц";
    }

    // Извлекаем месяц из "20260101"
    const monthCode = yyyyMMdd.slice(4, 6); // "01"
    const monthNumber = parseInt(monthCode, 10) - 1; // 0 для января

    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    return monthNames[monthNumber] || "текущий месяц";
  };

  const getCurrentMonthName = (): string => {
    if (months.length === 0) return "текущий месяц";

    const currentMonthCode = months[currentMonthIndex];
    return formatMonthForDisplay(currentMonthCode);
  };

  const handleMonthButtonClick = () => {
    if (months.length === 0) return;

    const monthFor1C = months[currentMonthIndex];

    setActions({
      actionName: "clickElement",
      active: true,
      currentForm: "Задачи",
      month: monthFor1C,
      filter: false,
    });

    if (!useMockData) {
      clickTo1C();
    }

    if (currentMonthIndex + 1 < months.length) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const getButtonText = (): string => {
    const currentMonth = getCurrentMonthName();
    return `Раннее за ${currentMonth}`;
  };

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
    <div className="task_list">
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
        <Button text={getButtonText()} onClick={handleMonthButtonClick} />
      </div>
    </div>
  );
}

export default DetailedTask;
