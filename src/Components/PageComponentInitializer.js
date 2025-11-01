import { useEffect } from 'react';
import { useAppStore } from '../Core/Context/AppStateContext';
import { useActionsStore } from '../Core/Context/ActionsContext';

import { useErrorsStore } from '../Core/Context/ErrorContext';

const PageComponentInitializer = () => {
  useEffect(() => {
    // Получаем текущее состояние один раз при монтировании
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
      // Actions
      changeActionState: actionsState.changeActionState,
      getActiveActions: actionsState.getActiveActions,
      getActiveActionsCount: actionsState.getActiveActionsCount,
      actions: actionsState.actions,

      // Errors
      errors: errorsState.errors,
      errorHistory: errorsState.errorHistory,
    };

    console.log('✅ pageComponent initialized once');
  }, []); // Пустой массив - только при монтировании

  return null;
};

export default PageComponentInitializer;