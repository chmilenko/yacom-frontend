import { useEffect } from "react";
import { useAppStore } from "../Core/Store/AppStateStore";
import { useActionsStore } from "../Core/Store/ActionsStore";

import { useErrorsStore } from "../Core/Store/ErrorsStore";

const PageComponentInitializer = () => {
  useEffect(() => {
    const appState = useAppStore.getState();
    const actionsState = useActionsStore.getState();
    const errorsState = useErrorsStore.getState();

    window.pageComponent = {
      // App State
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
