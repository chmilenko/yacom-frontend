import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IError {
  id: number;
  timestamp: string;
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
  details?: string;
  context?: string;
  page?: string;
  userAgent?: string;
  originalError?: {
    name?: string;
    message?: string;
    stack?: string;
    code?: string | number;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
}

export interface IErrorInput {
  type?: ErrorType;
  message: string;
  severity?: ErrorSeverity;
  details?: string;
  context?: string;
  page?: string;
  originalError?: any;
  metadata?: Record<string, any>;
}

export type ErrorType =
  | "application"
  | "parsing"
  | "network"
  | "library"
  | "validation"
  | "ui"
  | "api"
  | "auth"
  | "database"
  | "unknown";

export type ErrorSeverity = "info" | "warning" | "error" | "critical";

interface ErrorsStoreConfig {
  maxHistorySize?: number;
  autoSendTo1C?: boolean;
  autoSendSeverities?: ErrorSeverity[];
}

interface ErrorsStore {
  errors: IError[];
  errorHistory: IError[];
  isOnline: boolean;
  config: ErrorsStoreConfig;

  addError: (error: IErrorInput) => void;
  addErrorFromException: (error: Error | unknown, context?: string) => void;
  removeError: (errorId: number) => void;
  removeErrorFromHistory: (errorId: number) => void;
  clearErrorHistory: () => void;
  clearErrors: () => void;
  clearAll: () => void;
  getErrorsByType: (type?: ErrorType) => IError[];
  getErrorsBySeverity: (severity: ErrorSeverity) => IError[];
  getErrorHistoryByType: (type?: ErrorType) => IError[];
  checkReactAvailability: () => boolean;
  getAppStateJsonErrors: () => string;
  sendErrorTo1C: (errorData: IError) => Promise<void>;
  sendAllErrorsTo1C: () => Promise<void>;
  getErrorsJSON: () => string;
  getErrorStats: () => {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
  };
  setIsOnline: (online: boolean) => void;
  updateConfig: (config: Partial<ErrorsStoreConfig>) => void;
}

const defaultConfig: ErrorsStoreConfig = {
  maxHistorySize: 100,
  autoSendTo1C: true,
  autoSendSeverities: ["error", "critical"],
};

export const useErrorsStore = create<ErrorsStore>()(
  persist(
    (set, get) => ({
      errors: [],
      errorHistory: [],
      isOnline: navigator.onLine,
      config: defaultConfig,

      addError: (errorInput: IErrorInput) => {
        const { config } = get();
        const errorWithId: IError = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type: errorInput.type || "application",
          severity: errorInput.severity || "error",
          page: errorInput.page || window.location.pathname,
          userAgent: navigator.userAgent,
          ...errorInput,
          message: errorInput.message,
        };

        set((state) => {
          const newHistory = [...state.errorHistory, errorWithId];
          if (newHistory.length > config.maxHistorySize!) {
            newHistory.splice(0, newHistory.length - config.maxHistorySize!);
          }

          return {
            errors: [...state.errors, errorWithId],
            errorHistory: newHistory,
          };
        });

        const { sendErrorTo1C } = get();
        if (
          config.autoSendTo1C &&
          config.autoSendSeverities?.includes(errorWithId.severity)
        ) {
          sendErrorTo1C(errorWithId);
        }
      },

      addErrorFromException: (error: Error | unknown, context?: string) => {
        if (error instanceof Error) {
          get().addError({
            type: "application",
            message: error.message,
            severity: "error",
            context: context || "unhandled_exception",
            originalError: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        } else {
          get().addError({
            type: "unknown",
            message: String(error),
            severity: "error",
            context: context || "unknown_exception",
            originalError: error,
          });
        }
      },

      removeError: (errorId: number) =>
        set((state) => ({
          errors: state.errors.filter((error) => error.id !== errorId),
        })),

      removeErrorFromHistory: (errorId: number) =>
        set((state) => ({
          errorHistory: state.errorHistory.filter(
            (error) => error.id !== errorId
          ),
        })),

      clearErrorHistory: () => set({ errorHistory: [] }),

      clearErrors: () => set({ errors: [] }),

      clearAll: () => set({ errors: [], errorHistory: [] }),

      getErrorsByType: (type?: ErrorType) => {
        const { errors } = get();
        if (!type) return errors;
        return errors.filter((error) => error.type === type);
      },

      getErrorsBySeverity: (severity: ErrorSeverity) => {
        const { errors } = get();
        return errors.filter((error) => error.severity === severity);
      },

      getErrorHistoryByType: (type?: ErrorType) => {
        const { errorHistory } = get();
        if (!type) return errorHistory;
        return errorHistory.filter((error) => error.type === type);
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
        try {
          const { errors } = get();
          return JSON.stringify(errors, null, 2);
        } catch (err: any) {
          const errorDescription = `Не удалось обработать данные в getAppStateJsonErrors Ошибка ${err.name}: ${err.message} ${err.stack}`;
          return `{"error": "${errorDescription}"}`;
        }
      },

      sendErrorTo1C: async (errorData: IError) => {
        try {
          const clickerModule = await import("../../Utils/clicker");
          const clickTo1C = clickerModule.default;

          const { useActionsStore } = await import("./ActionsStore");
          const { setActions } = useActionsStore.getState();

          const actionData = {
            actionName: "sendErrors",
            active: true,
            data: [errorData],
          };

          setActions(actionData);
          clickTo1C();
          console.log("Error sent to 1C:", errorData);
        } catch (sendError: any) {
          console.error("Failed to send error to 1C:", sendError);
          get().addError({
            type: "network",
            message: "Failed to send error to 1C",
            severity: "warning",
            originalError: sendError,
          });
        }
      },

      sendAllErrorsTo1C: async () => {
        const { errors, sendErrorTo1C } = get();
        for (const error of errors) {
          await sendErrorTo1C(error);
        }
      },

      getErrorsJSON: () => {
        const { errors } = get();
        return JSON.stringify(errors);
      },

      getErrorStats: () => {
        const { errors } = get();
        const stats = {
          total: errors.length,
          byType: {} as Record<ErrorType, number>,
          bySeverity: {} as Record<ErrorSeverity, number>,
        };

        errors.forEach((error) => {
          stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
          stats.bySeverity[error.severity] =
            (stats.bySeverity[error.severity] || 0) + 1;
        });

        return stats;
      },

      setIsOnline: (online: boolean) => set({ isOnline: online }),

      updateConfig: (newConfig: Partial<ErrorsStoreConfig>) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
    }),
    {
      name: "errors-storage",
      partialize: (state) => ({
        errorHistory: state.errorHistory,
        config: state.config,
      }),
    }
  )
);
