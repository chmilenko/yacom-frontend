// store/useErrorsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useErrorsStore = create(
  persist(
    (set, get) => ({
      // State
      errors: [],
      errorHistory: [],
      isOnline: navigator.onLine,

      addError: (error) => {
        const errorWithId = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...error,
          type: error.type || "application",
          page: window.location.pathname,
        };

        set((state) => {
          const newHistory = [...state.errorHistory, errorWithId].slice(-100);
          return {
            errors: [...state.errors, errorWithId],
            errorHistory: newHistory,
          };
        });
        const { sendErrorTo1C } = get();
        if (sendErrorTo1C && error.severity !== "warning") {
          sendErrorTo1C(errorWithId);
        }
      },

      removeError: (errorId) =>
        set((state) => ({
          errors: state.errors.filter((error) => error.id !== errorId),
        })),

      removeErrorFromHistory: (errorId) =>
        set((state) => {
          const updatedHistory = state.errorHistory.filter(
            (error) => error.id !== errorId
          );
          return { errorHistory: updatedHistory };
        }),

      clearErrorHistory: () => set({ errorHistory: [] }),

      clearErrors: () => set({ errors: [] }),

      getErrorsByType: (type) => {
        const { errors } = get();
        return errors.filter((error) => error.type === type);
      },

      getErrorHistoryByType: (type) => {
        const { errorHistory } = get();
        return errorHistory.filter((error) =>
          type ? error.type === type : true
        );
      },

      checkReactAvailability: () => {
        if (!window.React) {
          get().addError({
            type: "library",
            message: "React library not loaded - no internet connection",
            severity: "critical",
            details: "The React library from CDN failed to load",
          });
          return false;
        }
        return true;
      },
      getAppStateJsonErrors: () => {
        let errorDescription = "";
        try {
          const { errors } = get();
          return JSON.stringify(errors);
        } catch (err) {
          errorDescription = `Не удалось обработать данные в setListState Ошибка 
                ${err.name}: ${err.message} ${err.stack}`;
        }

        return "getAppStateJsonErrors error: " + errorDescription;
      },
      sendErrorTo1C: async (errorData) => {
        try {
          const { clickTo1c } = await import("../../Utils/clicker");
          const { setActions } = await import("./ActionsContext").then(
            (module) => module.useActionsStore.getState()
          );

          const actionData = {
            actionName: "sendErrors",
            active: true,
            data: [errorData],
          };

          setActions(actionData);
          clickTo1c();
          console.log("Error sent to 1C:", errorData);
        } catch (sendError) {
          console.error("Failed to send error to 1C:", sendError);
        }
      },
      getErrorsJSON: () => {
        const { errors } = get();
        return JSON.stringify(errors);
      },
      setIsOnline: (online) => set({ isOnline: online }),
    }),
    {
      name: "errors-storage",
      partialize: (state) => ({
        errorHistory: state.errorHistory,
      }),
    }
  )
);
