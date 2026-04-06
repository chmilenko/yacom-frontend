import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../Ui/Button/Button";

import clickTo1C from "../../Utils/clicker";
import { useActionsStore } from "../../Core/Store/ActionsStore";
import { useAppStore } from "../../Core/Store/AppStore";
import { useCreateTaskStore } from "../../Core/Store/CreateTaskNews";
import { useAppModeStore } from "../../Core/Store/AppModeStore";
import { useHomeActions } from "../../Page/Home/useActionsHome";
function LayoutButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const { setActions } = useActionsStore();
  const { user } = useAppStore();
  const { useMockData } = useAppModeStore();
  const { postTask, isCreatingTask, createTaskError, oneTask } =
    useCreateTaskStore();
  const { taskFulfill, onTaskExecute } = useHomeActions();

  const isCreatePage = location.pathname === "/task/create";
  const isFullPage = location.pathname.startsWith("/task/full");
  const isNewsPage = location.pathname === "/news/full";

  const taskId =
    params.id || location.pathname.split("/").filter(Boolean)[2] || null;

  const isTaskListPage = location.pathname === "/task/full";
  const isSingleTaskPage = isFullPage && taskId;

  const handleNavigateCreateTask = () => {
    setActions({
      actionName: "clickElement",
      active: true,
      currentForm: "createTask",
    });
    navigate("/task/create");
    !useMockData && clickTo1C();
  };

  const handleGetReport = () => {
    setActions({
      actionName: "clickElement",
      active: true,
      action: "getReport",
    });
    !useMockData && clickTo1C();
  };

  const handleCreateTask = async () => {
    try {
      const result = await postTask();
      if (result.success) {
        setActions({
          actionName: "postTask",
          active: true,
          data: {
            ...result.data,
            userGuid: user.userGuid,
            subdivisionGuid: user.subdivisionGuid,
          },
        });
        !useMockData && clickTo1C();
      }
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
    }
  };

  const handleCompleteTask = () => {
    // Приводим тип задачи к строке для единообразного сравнения
    const resultType = String(
      oneTask.resultTypeNumber || oneTask.resultType || "",
    );
    const isTaskDone = oneTask.Done || oneTask.Done === true;

    // Типы задач с фото/файлами (3,4,5)
    const isPhotoFileType = ["3", "4", "5"].includes(resultType);

    // Специальные типы задач (2,7)
    const isSpecialType = ["2", "7"].includes(resultType);

    // Информационные задачи (8)
    const isInfoType = resultType === "8";

    // Простые задачи (1)
    const isSimpleType = resultType === "1";

    // Логика выполнения в зависимости от типа и статуса задачи
    if (isInfoType) {
      // Тип 8: Ознакомление
      if (isTaskDone) {
        // Уже ознакомлен - ничего не делаем
        console.log("Уже ознакомлен");
        return { action: "none", message: "Уже ознакомлен" };
      } else {
        // Нужно ознакомиться
        onTaskExecute(oneTask, oneTask.TaskID);
        return { action: "acknowledge", taskId: oneTask.TaskID };
      }
    }

    // Типы 3,4,5 (с фото/файлами)
    if (isPhotoFileType) {
      if (isTaskDone) {
        // Уже выполнено - показываем результат
        taskFulfill(null, oneTask);
        return { action: "showResult", type: resultType };
      } else {
        // ⭐ НЕ ВЫПОЛНЯЕМ СРАЗУ, а открываем форму
        taskFulfill(null, oneTask); // null вместо id
        return { action: "openForm", type: resultType };
      }
    }

    // Типы 2,7 (специальные) и 1 (простые)
    if (isSpecialType || isSimpleType) {
      if (isTaskDone) {
        // Уже выполнено - показываем результат
        taskFulfill(null, oneTask);
        return { action: "showResult", type: resultType };
      } else {
        // Выполняем сразу
        taskFulfill(oneTask.TaskID, oneTask);
        return { action: "execute", type: resultType };
      }
    }

    // Дефолтная логика для других типов
    if (isTaskDone) {
      taskFulfill(null, oneTask);
      return { action: "defaultDone", taskId: oneTask.TaskID };
    } else {
      taskFulfill(oneTask.TaskID, oneTask);
      return { action: "defaultExecute", taskId: oneTask.TaskID };
    }
  };

  if (isCreatePage) {
    return (
      <>
        <Button
          onClick={() => navigate("/task/full")}
          type="secondary"
          text="Отмена"
          disabled={isCreatingTask}
        />
        <Button
          onClick={handleCreateTask}
          type="primary"
          text={isCreatingTask ? "Создание..." : "Создать задачу"}
          disabled={isCreatingTask}
        />
        {createTaskError?.general && (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            {createTaskError.general}
          </div>
        )}
      </>
    );
  }

  if (isSingleTaskPage) {
    const isTaskDone = oneTask?.Done || oneTask?.Done === true;

    return (
      <>
        <Button
          onClick={() => navigate("task/full")}
          type="navigation"
          text="Назад"
        />
        <Button
          onClick={handleCompleteTask}
          type="primary"
          text="Выполнить задачу"
          style={{
            color: isTaskDone ? "#666" : "",
            cursor: isTaskDone ? "not-allowed" : "",
          }}
          disabled={isTaskDone}
        />
      </>
    );
  }

  if (isTaskListPage) {
    return (
      <>
        <Button onClick={() => navigate("/")} type="navigation" text="Назад" />
        <Button
          onClick={handleNavigateCreateTask}
          type="navigation"
          text="Создать"
        />
        <Button type="navigation" text="Отчет" onClick={handleGetReport} />
      </>
    );
  }

  if (isNewsPage) {
    return (
      <>
        <Button onClick={() => navigate("/")} type="navigation" text="Назад" />
        <Button type="navigation" text="Отбор" />
      </>
    );
  }

  return null;
}

export default LayoutButtons;
