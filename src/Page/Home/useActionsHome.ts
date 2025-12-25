import "./Home.scss";

import clickTo1C from "../../Utils/clicker";

import { useAppStore } from "../../Core/Store/AppStateStore";
import { useActionsStore } from "../../Core/Store/ActionsStore";
import { useErrorsStore } from "../../Core/Store/ErrorsStore";
import { IAdditionalInfo } from "../../Core/Types/AppState";

export const useHomeActions = () => {
  const { setActions } = useActionsStore();

  const {
    additionalInfo,
    setAdditionalInfo,
    developer,
    setTaskDoneStatus,
    setReadNews,
    openSwiper,
    setOpenSwiper,
    // setListState,
  } = useAppStore();

  const { errors } = useErrorsStore();

  const taskAction = (TypeResult) => {
    switch (TypeResult) {
      case "1":
        return "do";
      case "2":
        return "text";
      case "3":
        return "photo";
      case "4":
        return "photo";
      case "5":
        return "photoAndText";
      case "6":
        return "tsd";
      case "7":
        return "number";
      case "8":
        return "acquaintance";
      default:
        return "empty";
    }
  };

  const handleOpenSwiper = (info: IAdditionalInfo, type: string) => {
    let id: number | string;
    try {
      if (type === "Задачи" || type === "Tasks") {
        id = info.TaskID;
      } else if (type === "Новости" || type === "News") {
        id = info.ObjectID;
        setReadNews(id);
      }

      setActions({
        actionName: "clickElement",
        active: true,
        objectId: id,
        subSection: type,
        objectType: info.ObjectType && info.ObjectType,
      });

      developer && setAdditionalInfo(id, type);
      if (info.ObjectType && info.ObjectType === "Poll") {
        setOpenSwiper(false);
      } else setOpenSwiper(true);

      !developer && clickTo1C();
    } catch (err) {
      const errorDescription = "Ошибка в handleOpenSwiper";
      const errorWithId = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...err,
        type: err.type || "application",
        page: window.location.pathname,
        description: errorDescription,
      };
      errors.push(errorWithId);
    }
  };

  const onTaskExecute = (id) => {
    if (!additionalInfo.Done) {
      setActions({
        actionName: "TaskExecute",
        objectType: additionalInfo.ObjectType,
        taskCurrentAction: taskAction(additionalInfo.ResultType),
        objectId: additionalInfo.TaskID,
        ClientID: additionalInfo.ClientID,
        IsChecked: additionalInfo.Done,
        active: true,
      });
    }
    setTaskDoneStatus(id);
    !developer && clickTo1C();
  };

  const taskFulfill = (id) => {
    const obj = {
      actionName: "TaskFulfill",
      objectType: additionalInfo.ObjectType,
      taskCurrentAction: taskAction(additionalInfo.ResultType),
      objectId: additionalInfo.TaskID,
      ClientID: additionalInfo.ClientID,
      IsChecked: additionalInfo.Done,
      active: true,
    };
    if (id) {
      setTaskDoneStatus(id);
      //проверить состояние списка после выполнение action
      // setListState();
    }
    setActions(obj);
    !developer && clickTo1C();
  };

  const sectionAction = (Section) => {
    switch (Section) {
      case "Проблема при отправке данных":
        return "Проблема при отправке данных";
      case "Данные отправляются":
        return "Данные отправляются";
      case "Сигналы":
        return "Сигналы";
      case "Задачи":
        return "Задачи";
      case "Новости":
        return "Новости";
      default:
        return "empty";
    }
  };

  const openTasksOrNewsForm = (block) => {
    if (!openSwiper) {
      setActions({
        actionName: "clickElement",
        active: true,
        currentForm: sectionAction(block),
      });
      !developer && clickTo1C();
    } else return;
  };

  return {
    openTasksOrNewsForm,
    handleOpenSwiper,
    onTaskExecute,
    taskFulfill,
  };
};
