import { useEffect } from "react";
import { useAppStore } from "../Core/Store/AppStore";
import { useActionsStore } from "../Core/Store/ActionsStore";
import { useErrorsStore } from "../Core/Store/ErrorsStore";

declare global {
  interface Window {
    pageComponent?: {
      // App State
      menuItems: ReturnType<typeof useAppStore.getState>["menuItems"];
      page: ReturnType<typeof useAppStore.getState>["page"];
      setPage: ReturnType<typeof useAppStore.getState>["setPage"];
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
    };
  }
}

const PageComponentInitializer = () => {
  useEffect(() => {
    const appState = useAppStore.getState();
    const actionsState = useActionsStore.getState();
    const errorsState = useErrorsStore.getState();

    window.pageComponent = {
      menuItems: appState.menuItems,
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

      changeActionState: actionsState.changeActionState,
      getActiveActions: actionsState.getActiveActions,
      getActiveActionsCount: actionsState.getActiveActionsCount,
      actions: actionsState.actions,

      errors: errorsState.errors,
      errorHistory: errorsState.errorHistory,
      getErrorsJSON: errorsState.getErrorsJSON,
    };

    console.log("✅ pageComponent initialized once");
  }, []);

  return null;
};

export default PageComponentInitializer;
