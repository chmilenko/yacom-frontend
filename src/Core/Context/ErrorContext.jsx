import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { setPageComponent } from "../../Utils/pageComponentManager";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const addError = useCallback((error) => {
    const errorWithId = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...error,
      type: error.type || "application",
    };

    setErrors((prev) => [...prev, errorWithId]);

    setTimeout(() => {
      removeError(errorWithId.id);
    }, 30000);
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors((prev) => prev.filter((error) => error.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorsByType = useCallback(
    (type) => {
      return errors.filter((error) => error.type === type);
    },
    [errors]
  );

  const checkReactAvailability = useCallback(() => {
    if (!window.React) {
      addError({
        type: "library",
        message: "React library not loaded - no internet connection",
        severity: "critical",
        details: "The React library from CDN failed to load",
      });
      return false;
    }
    return true;
  }, [addError]);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      addError({
        type: "network",
        message: "No internet connection",
        severity: "warning",
        details: "Please check your network connection",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkReactAvailability();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [addError, checkReactAvailability]);

  useEffect(() => {
    setPageComponent({
      errors,
    });
  }, [errors]);

  const value = {
    errors,
    isOnline,
    addError,
    removeError,
    clearErrors,
    getErrorsByType,
    checkReactAvailability,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
