import {
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
  const [errorHistory, setErrorHistory] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const addError = useCallback((error) => {
    const errorWithId = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...error,
      type: error.type || "application",
      page: window.location.pathname,
    };

    setErrorHistory((prev) => {
      const newHistory = [...prev, errorWithId];
      localStorage.setItem(
        "errorHistory",
        JSON.stringify(newHistory.slice(-100))
      );
      return newHistory;
    });
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors((prev) => prev.filter((error) => error.id !== errorId));
  }, []);

  const removeErrorFromHistory = useCallback(
    (errorId) => {
      setErrorHistory((prev) => prev.filter((error) => error.id !== errorId));
      const updatedHistory = errorHistory.filter(
        (error) => error.id !== errorId
      );
      localStorage.setItem("errorHistory", JSON.stringify(updatedHistory));
    },
    [errorHistory]
  );

  const clearErrorHistory = useCallback(() => {
    setErrorHistory([]);
    localStorage.removeItem("errorHistory");
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

  const getErrorHistoryByType = useCallback(
    (type) => {
      return errorHistory.filter((error) =>
        type ? error.type === type : true
      );
    },
    [errorHistory]
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

  useEffect(() => {
    const savedHistory = localStorage.getItem("errorHistory");
    if (savedHistory) {
      try {
        setErrorHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load error history:", e);
      }
    }
  }, []);

  useEffect(() => {
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
      errorHistory,
    });
    console.log(window.pageComponent.errorHistory);
  }, [errors, errorHistory]);

  const value = {
    errors,
    errorHistory,
    isOnline,
    addError,
    removeError,
    removeErrorFromHistory,
    clearErrors,
    clearErrorHistory,
    getErrorsByType,
    getErrorHistoryByType,
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
