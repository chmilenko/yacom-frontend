import { useContext } from "react";
import "./Home.scss";

import clickTo1C from "../../Utils/clicker";

import { AppStateContext } from "../../Core/Context/AppStateContext";
import { ActionsContext } from "../../Core/Context/ActionsContext";

export const useHomeActions = () => {
  const { setActions } = useContext(ActionsContext);

  const {
    forState,
    additionalInfo,
    setListData,
    setListName,
    setAdditionalInfo,
    developer,
    setTaskDoneStatus,
    setReadNews,
    openSwiper,
    setOpenSwiper,
    setListState,
    ListData,
    listName,
  } = useContext(AppStateContext);

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

  const handleOpenSwiper = (info, type) => {
    let id;
    
    if (type === "Задачи" || type === "Tasks") {
      id = info.TaskID;
    } else if (type === "Сообщения" || type === "Messages" || type === 'Новости') {
      id = info.ObjectID;
      setReadNews(id);
    }

    const section = forState.find((s) => s.SectionName === type);
    let dataToSend;

    if (section && section.sectionData?.list) {
      dataToSend = section.sectionData.list.find((item) => 
        item?.ObjectID === id || item?.TaskID === id
      );
    }

    setActions({
      actionName: "clickElement",
      active: true,
      objectId: id,
      subSection: type,
      objectType: info.ObjectType,
    });

    developer && setAdditionalInfo(info);

    setListData(dataToSend);
    setListName(type);
    setOpenSwiper(true);

    !developer && clickTo1C();
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
      setListState(listName, ListData);
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
        currentForm: sectionAction(block)
      });
      !developer && clickTo1C();
    } else return;
  };

  const openReport = () => {
    setTimeout(() => {
      setActions({
        actionName:
          additionalInfo.ObjectType === "News"
            ? "NewsReportClick"
            : "TaskReportClick",
        objectId: additionalInfo.ObjectID,
        active: true,
      });
      !developer && clickTo1C();
    }, 200); 
  };
  return {
    openTasksOrNewsForm,
    handleOpenSwiper,
    openReport,
    onTaskExecute,
    taskFulfill,
  };
};