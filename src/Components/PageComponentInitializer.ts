import { useEffect } from "react";
import { useAppStore } from "../Core/Store/AppStore";
import { useActionsStore } from "../Core/Store/ActionsStore";
import { useErrorsStore } from "../Core/Store/ErrorsStore";
import { useAppModeStore } from "../Core/Store/AppModeStore";
import { useCreateTaskStore } from "../Core/Store/CreateTaskNews";
declare global {
  interface Window {
    pageComponent?: {
      // App State
      menuItems: ReturnType<typeof useAppStore.getState>["menuItems"];
      page: ReturnType<typeof useAppStore.getState>["page"];
      user: ReturnType<typeof useAppStore.getState>["user"];
      setPage: ReturnType<typeof useAppStore.getState>["setPage"];
      setUser: ReturnType<typeof useAppStore.getState>["setUser"];
      setAppState: ReturnType<typeof useAppStore.getState>["setAppState"];
      setInstructionsState: ReturnType<
        typeof useAppStore.getState
      >["setInstructionsState"];
      forState: ReturnType<typeof useAppStore.getState>["forState"];
      setOpenSwiper: ReturnType<typeof useAppStore.getState>["setOpenSwiper"];
      setListState: ReturnType<typeof useAppStore.getState>["setListState"];
      setTaskDoneStatus: ReturnType<
        typeof useAppStore.getState
      >["setTaskDoneStatus"];
      setListStateClear: ReturnType<
        typeof useAppStore.getState
      >["setListStateClear"];
      additionalInfo: ReturnType<typeof useAppStore.getState>["additionalInfo"];

      // Actions
      changeActionState: ReturnType<
        typeof useActionsStore.getState
      >["changeActionState"];
      getActiveActions: ReturnType<
        typeof useActionsStore.getState
      >["getActiveActions"];
      getActiveActionsCount: ReturnType<
        typeof useActionsStore.getState
      >["getActiveActionsCount"];
      actions: ReturnType<typeof useActionsStore.getState>["actions"];

      // Errors
      errors: ReturnType<typeof useErrorsStore.getState>["errors"];
      errorHistory: ReturnType<typeof useErrorsStore.getState>["errorHistory"];
      getErrorsJSON: ReturnType<
        typeof useErrorsStore.getState
      >["getErrorsJSON"];

      //CreateOpenTasksNews
      getOneTask: ReturnType<typeof useCreateTaskStore.getState>["getOneTask"];
      setFullTasks: ReturnType<
        typeof useCreateTaskStore.getState
      >["setFullTasks"];
      setChapters: ReturnType<
        typeof useCreateTaskStore.getState
      >["setChapters"];
      setResultTypes: ReturnType<
        typeof useCreateTaskStore.getState
      >["setResultTypes"];
      setFullNews: ReturnType<
        typeof useCreateTaskStore.getState
      >["setFullNews"];

      //debug
      isDebugMode: ReturnType<typeof useAppModeStore.getState>["isDebugMode"];
      setDebugMode: ReturnType<typeof useAppModeStore.getState>["setDebugMode"];
    };
  }
}

const PageComponentInitializer = () => {
  useEffect(() => {
    const appState = useAppStore.getState();
    const actionsState = useActionsStore.getState();
    const fullTasks = useCreateTaskStore.getState();
    const errorsState = useErrorsStore.getState();

    window.pageComponent = {
      menuItems: appState.menuItems,
      page: appState.page,
      user: appState.user,
      setUser: appState.setUser,
      setPage: appState.setPage,
      setAppState: appState.setAppState,
      setInstructionsState: appState.setInstructionsState,
      forState: appState.forState,
      setOpenSwiper: appState.setOpenSwiper,
      setListState: appState.setListState,
      setTaskDoneStatus: appState.setTaskDoneStatus,
      setListStateClear: appState.setListStateClear,
      additionalInfo: appState.additionalInfo,

      changeActionState: actionsState.changeActionState,
      getActiveActions: actionsState.getActiveActions,
      getActiveActionsCount: actionsState.getActiveActionsCount,
      actions: actionsState.actions,

      errors: errorsState.errors,
      errorHistory: errorsState.errorHistory,
      getErrorsJSON: errorsState.getErrorsJSON,

      getOneTask: fullTasks.getOneTask,
      setFullTasks: fullTasks.setFullTasks,
      setChapters: fullTasks.setChapters,
      setResultTypes: fullTasks.setResultTypes,
      setFullNews: fullTasks.setFullNews,

      //debug
      isDebugMode: useAppModeStore.getState().isDebugMode,
      setDebugMode: useAppModeStore.getState().setDebugMode,
    };

    console.log("✅ pageComponent initialized once");
  }, []);

  return null;
};

export default PageComponentInitializer;
