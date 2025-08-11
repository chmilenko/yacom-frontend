import React, { createContext, useState, useCallback, useEffect } from "react";
import { setPageComponent } from "../../Utils/pageComponentManager";

export const ActionsContext = createContext();

export const ActionsProvider = ({ children }) => {
  const [actions, setActionsState] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAdditionalInfo, setLoadingAdditionalInfo] = useState(false);

  const handleError = useCallback((err, context) => {
    const errorDescription = `${context}. Ошибка ${err.name}: ${err.message}\n${err.stack}`;
    setError(errorDescription);
    console.error(errorDescription);
  }, []);

  const setActions = useCallback(
    (param) => {
      try {
        setActionsState((prevActions) => {
          const existingIndex = prevActions.findIndex(
            (el) =>
              (el.objectId === param.objectId &&
                el.actionName === param.actionName) ||
              (el.attachmentId === param.attachmentId &&
                el.actionName === param.actionName)
          );
          if (existingIndex > -1) {
            // Заменяем существующий
            const updated = [...prevActions];
            updated[existingIndex] = param;
            return updated;
          }
          // Добавляем новый
          return [...prevActions, param];
        });
      } catch (err) {
        handleError(err, "Не удалось вызвать процедуру в setActions");
      }
    },
    [handleError]
  );

  const changeActionState = useCallback(
    (action, id, newState) => {
      try {
        setActionsState((prevActions) =>
          prevActions.map((el) =>
            el.objectId === id && el.actionName === action
              ? { ...el, active: newState }
              : el
          )
        );
      } catch (err) {
        handleError(err, "Не удалось изменить статус в Action");
      }
    },
    [handleError]
  );

  const getActiveActionsCount = useCallback(() => {
    try {
      return actions.filter((el) => el.active).length;
    } catch (err) {
      handleError(err, "Не удалось получить активные Actions");
      return 0;
    }
  }, [actions, handleError]);

  const getActiveActions = useCallback(() => {
    try {
      return JSON.stringify(actions.filter((el) => el.active));
    } catch (err) {
      handleError(err, "Не удалось получить активные Actions");
      return "[]";
    }
  }, [actions, handleError]);

  useEffect(() => {
    setPageComponent({
      changeActionState,
      getActiveActions,
      getActiveActionsCount,
      actions,
    });
  }, [changeActionState, getActiveActions, getActiveActionsCount, actions]);

  return (
    <ActionsContext.Provider
      value={{
        setActions,
        actions,
        getActiveActions,
        changeActionState,
        getActiveActionsCount,
        error,
        loadingAdditionalInfo,
        setLoadingAdditionalInfo,
      }}
    >
      {children}
    </ActionsContext.Provider>
  );
};
