import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../Ui/Button/Button";
import { useCreateTaskNews } from "../../Core/Context/CreateTaskNews";
import { useActionsStore } from "../../Core/Context/ActionsContext";
import { useAppStore } from "../../Core/Context/AppStateContext";
import clickTo1C from "../../Utils/clicker";

function LayoutButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setActions } = useActionsStore();
  const { developer } = useAppStore();
  const { postTask, isCreatingTask, createTaskError } = useCreateTaskNews();

  const isCreatePage = location.pathname === "/task/create";
  const isFullPage = location.pathname === "/task/full";
  const isNewsPage = location.pathname === "/news/full";

  const handleNavigateCreateTask = () => {
    setActions({
      actionName: "clickElement",
      active: true,
      currentForm: "createTask",
    });
    navigate("/task/create");
    !developer && clickTo1C();
  };

  const handleCreateTask = async () => {
    try {
      const result = await postTask();

      if (result.success) {
        setActions({
          actionName: "postTask",
          active: true,
          data: result.data,
        });

        if (!developer) {
          clickTo1C();
        }
      }
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
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

  if (isFullPage) {
    return (
      <>
        <Button onClick={() => navigate("/")} type="navigation" text="Назад" />
        <Button
          onClick={() => handleNavigateCreateTask()}
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
