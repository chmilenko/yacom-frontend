import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../Ui/Button/Button";

import clickTo1C from "../../Utils/clicker";
import { useActionsStore } from "../../Core/Store/ActionsStore";
import { useAppStore } from "../../Core/Store/AppStore";
import { useCreateTaskStore } from "../../Core/Store/CreateTaskNews";
import { useAppModeStore } from "../../Core/Store/AppModeStore";

function LayoutButtons() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const { setActions } = useActionsStore();
  const { user } = useAppStore();
  const { useMockData } = useAppModeStore();
  const { postTask, isCreatingTask, createTaskError } = useCreateTaskStore();

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
    if (taskId) {
      console.log("Выполняем задачу с ID:", taskId);
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
          style={{ backgroundColor: "#4CAF50", color: "white" }}
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
        <Button
          onClick={() => console.log("Перейти к отчету")}
          type="navigation"
          text="Отчет"
        />
      </>
    );
  }

  if (isNewsPage) {
    return (
      <>
        <Button onClick={() => navigate("/")} type="navigation" text="Назад" />
        <Button
          onClick={() => console.log("Перейти к отбору")}
          type="navigation"
          text="Отбор"
        />
      </>
    );
  }

  return null;
}

export default LayoutButtons;
