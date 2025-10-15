import React, { createContext, useState, useCallback, useEffect } from "react";
import { setPageComponent } from "../../Utils/pageComponentManager";
import { useError } from "./ErrorContext";

export const ActionsContext = createContext();

export const ActionsProvider = ({ children }) => {
  const { addError } = useError();

  const [actions, setActionsState] = useState([]);

  const [loadingAdditionalInfo, setLoadingAdditionalInfo] = useState(false);

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
            const updated = [...prevActions];
            updated[existingIndex] = param;
            return updated;
          }
          return [...prevActions, param];
        });
      } catch (err) {
        const errorDescription = `Не удалось добавить Action в setActionsState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        addError({
          type: "addAction",
          message: "Failed to add action",
          severity: "error",
          details: errorDescription,
          context: "setActions",
        });
      }
    },
    [addError]
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
        const errorDescription = `Не удалось изменить статус Action в changeActionState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        addError({
          type: "changeActionState",
          message: "Failed to give changeActionState",
          severity: "error",
          details: errorDescription,
          context: "changeActionState",
        });
      }
    },
    [addError]
  );

  const getActiveActionsCount = useCallback(() => {
    try {
      return actions.filter((el) => el.active).length;
    } catch (err) {
      const errorDescription = `Не удалось получить количество активных Actions в getActiveActionsCount\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      addError({
        type: "getActiveActionsCount",
        message: "Failed to  getActiveActionsCount",
        severity: "error",
        details: errorDescription,
        context: "getActiveActionsCount",
      });
      return 0;
    }
  }, [actions, addError]);

  const getActiveActions = useCallback(() => {
    try {
      return JSON.stringify(actions.filter((el) => el.active));
    } catch (err) {
      const errorDescription = `Не удалось получить активные Actions в getActiveActions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      addError({
        type: "getActiveActions",
        message: "Failed to getActiveActions",
        severity: "error",
        details: errorDescription,
        context: "getActiveActions",
      });
      return "[]";
    }
  }, [actions, addError]);

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
        loadingAdditionalInfo,
        setLoadingAdditionalInfo,
      }}
    >
      {children}
    </ActionsContext.Provider>
  );
};
