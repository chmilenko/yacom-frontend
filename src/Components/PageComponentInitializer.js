import { useEffect } from "react";
import { useAppStore } from "../Core/Context/AppStateContext";
import { useActionsStore } from "../Core/Context/ActionsContext";

import { useErrorsStore } from "../Core/Context/ErrorContext";
import { useCreateTaskNews } from "../Core/Context/CreateTaskNews";

const PageComponentInitializer = () => {
  useEffect(() => {
    const appState = useAppStore.getState();
    const actionsState = useActionsStore.getState();
    const useCreateTaskNewsState = useCreateTaskNews.getState();
    const errorsState = useErrorsStore.getState();

    window.pageComponent = {
      // App State
      setUser: appState.setUser,
      menuItems: appState.menuItems,
      setUser: appState.setUser,
      page: appState.page,
      setPage: appState.setPage,
      setAppState: appState.setAppState,
      setInstructionsState: appState.setInstructionsState,
      forState: appState.forState,
      setOpenSwiper: appState.setOpenSwiper,
      setListState: appState.setListState,
      setTaskDoneStatus: appState.setTaskDoneStatus,
      setListStateClear: appState.setListStateClear,
      additionalInfo: appState.additionalInfo,
      getListState: appState.getListState,
      tryJsonParse: appState.tryJsonParse,
      getAppStateJsonErrors: appState.getAppStateJsonErrors,
      getCurrentadditionalInfo: appState.getCurrentadditionalInfo,

      // Actions
      changeActionState: actionsState.changeActionState,
      getActiveActions: actionsState.getActiveActions,
      getActiveActionsCount: actionsState.getActiveActionsCount,
      actions: actionsState.actions,

      //CreateTaskNews
      setChapters: useCreateTaskNewsState.setChapters,
      setResultTypes: useCreateTaskNewsState.setResultTypes,
      setFullTasks: useCreateTaskNewsState.setFullTasks,
      getFullTask: useCreateTaskNewsState.getFullTask,
      getOneTask: useCreateTaskNewsState.getOneTask,
      // Errors
      errors: errorsState.errors,
      errorHistory: errorsState.errorHistory,
      getErrorsJSON: errorsState.getErrorsJSON,
    };

    console.log("✅ pageComponent initialized once");
  }, []);

  return null;
};

export default PageComponentInitializer;
