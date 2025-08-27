import React, { createContext, useState, useEffect, useCallback } from "react";
import { setPageComponent } from "../../Utils/pageComponentManager.js";

export const AppStateContext = createContext();

let userData;
if (process.env.REACT_APP_DEVELOPER === "true") {
  userData = require("../../Core/Mock/mock").user;
}

let data;
if (process.env.REACT_APP_DEVELOPER === "true") {
  data = require("../../Core/Mock/mock").data;
}

let dataInstructions;
if (process.env.REACT_APP_DEVELOPER === "true") {
  dataInstructions = require("../../Core/Mock/instructions").instructions;
}

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    forState: [],
    instructions: [],
    additionalInfo: [],
    error: null,
    openSwiper: false,
    errorDescription: null,
    listName: null,
    ListData: null,
    actions: [],
    developer: process.env.REACT_APP_DEVELOPER === "true",
    page: "",
    loadingAdditionalInfo: false,
    countActualTasks: 0,
    countUnreadNews: 0,
  });

  // Глобальные сеттеры
  const setUser = useCallback(
    (appData) => {
      try {
        const res = !state.developer ? JSON.parse(appData) : userData;
        const userInfoObject = res.reduce(
          (acc, cur) => ({ ...acc, ...cur }),
          {}
        );
        setState((prev) => ({ ...prev, user: userInfoObject }));
      } catch (err) {
        const errorDescription = `Не удалось распарсить в setUser\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        setState((prev) => ({ ...prev, error: errorDescription }));
      }
    },
    [state.developer]
  );

  const setPage = useCallback((newPage) => {
    setState((prev) => ({ ...prev, page: newPage }));
  }, []);

  //Рабочий стол

  // Обновление счетчиков на рабочем столе
  const updateNewsCount = useCallback(() => {
    const unreadNews = state.forState
      .flatMap((section) => section.NewsList || [])
      .filter((news) => news && news.New);
    setState((prev) => ({ ...prev, countUnreadNews: unreadNews.length }));
  }, [state.forState]);

  const updateTaskCount = useCallback(() => {
    const tasks = state.forState
      .flatMap((section) => section.TaskList || [])
      .filter((task) => !task.Done);
    setState((prev) => ({ ...prev, countActualTasks: tasks.length }));
  }, [state.forState]);

  const setAppState = useCallback(
    (appData) => {
      try {
        const res = !state.developer ? JSON.parse(appData) : data;
        setState((prev) => {
          // Сначала обновляем forState
          const newState = { ...prev, forState: res };

          // Затем immediately вычисляем счетчики из НОВЫХ данных
          const tasks = res
            .flatMap((section) => section.TaskList || [])
            .filter((task) => !task.Done);

          const unreadNews = res
            .flatMap((section) => section.NewsList || [])
            .filter((news) => news && news.New);

          // Возвращаем полное обновленное состояние
          return {
            ...newState,
            countActualTasks: tasks.length,
            countUnreadNews: unreadNews.length,
          };
        });
      } catch (err) {
        const errorDescription = `Не удалось распарсить в setAppState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        setState((prev) => ({ ...prev, error: errorDescription }));
      }
    },
    [state.developer] // ← updateTaskCount и updateNewsCount больше не нужны!
  );

  const setOpenSwiper = useCallback((swiperState) => {
    setState((prev) => ({ ...prev, openSwiper: swiperState }));
  }, []);

  const setTaskDoneStatus = useCallback(
    (id) => {
      if (state.developer) {
        // Developer режим - мутируем существующий state
        const updatedData = JSON.parse(JSON.stringify(state.forState));
        let taskToMove = null;

        const updatedSections = updatedData.map((section) => {
          if (!section.TaskList) return section;

          const updatedTaskList = section.TaskList.map((task) => {
            if (task.TaskID !== id) return task;

            if (task.ResultType != 8 && task.ObjectType !== "News") {
              return { ...task, Done: true };
            }

            if (task.ResultType == 8 && task.ObjectType === "News") {
              taskToMove = {
                ...task,
                isReport: true,
              };
              delete taskToMove.ResultType;
              return null;
            }

            return task;
          }).filter(Boolean);

          return { ...section, TaskList: updatedTaskList };
        });

        if (taskToMove) {
          let newsSection = updatedSections.find(
            (s) => s.SectionName === "News" || s.NewsList
          );

          if (!newsSection) {
            newsSection = {
              SectionCounter: 0,
              SectionName: "Messages",
              Sort: 1,
              SectionUpdate: "Обновлено недавно",
              SectionNeedsUpdate: false,
              NewsList: [],
            };
            updatedSections.push(newsSection);
          }

          newsSection.NewsList = newsSection.NewsList || [];
          newsSection.NewsList.push(taskToMove);
        }

        // Мутация state в developer режиме
        state.forState.length = 0;
        state.forState.push(...updatedSections);
        updateTaskCount();
      } else {
        // Обычный режим - используем setState
        setState((prev) => {
          const updatedData = JSON.parse(JSON.stringify(prev.forState));
          let taskToMove = null;

          const updatedSections = updatedData.map((section) => {
            if (!section.TaskList) return section;

            const updatedTaskList = section.TaskList.map((task) => {
              if (task.TaskID !== id) return task;

              if (task.ResultType != 8 && task.ObjectType !== "News") {
                return { ...task, Done: true };
              }

              if (task.ResultType == 8 && task.ObjectType === "News") {
                taskToMove = {
                  ...task,
                  isReport: true,
                };
                delete taskToMove.ResultType;
                return null;
              }

              return task;
            }).filter(Boolean);

            return { ...section, TaskList: updatedTaskList };
          });

          if (taskToMove) {
            let newsSection = updatedSections.find(
              (s) => s.SectionName === "News" || s.NewsList
            );

            if (!newsSection) {
              newsSection = {
                SectionCounter: 0,
                SectionName: "Messages",
                Sort: 1,
                SectionUpdate: "Обновлено недавно",
                SectionNeedsUpdate: false,
                NewsList: [],
              };
              updatedSections.push(newsSection);
            }

            newsSection.NewsList = newsSection.NewsList || [];
            newsSection.NewsList.push(taskToMove);
          }

          return { ...prev, forState: updatedSections };
        });
        updateTaskCount();
      }
    },
    [state.developer, state.forState, updateTaskCount]
  );

  const setReadNews = useCallback(
    (id) => {
      if (state.developer) {
        const updatedData = state.forState.map((section) => {
          const updatedNewsList = (section.NewsList || []).map((newsItem) =>
            newsItem.ObjectID === id && newsItem.New
              ? { ...newsItem, New: false }
              : newsItem
          );
          console.log(updatedNewsList);

          return { ...section, NewsList: updatedNewsList };
        });
        state.forState.length = 0;
        state.forState.push(...updatedData);
        updateNewsCount();
      } else {
        setState((prev) => {
          const updatedData = prev.forState.map((section) => {
            const updatedNewsList = (section.NewsList || []).map((newsItem) =>
              newsItem.ObjectID === id && newsItem.New
                ? { ...newsItem, New: false }
                : newsItem
            );
            return { ...section, NewsList: updatedNewsList };
          });
          return { ...prev, forState: updatedData };
        });
        updateNewsCount();
      }
    },
    [state.developer, state.forState, updateNewsCount]
  );

  const setAdditionalInfo = useCallback((additional) => {
    setState((prev) => ({ ...prev, loadingAdditionalInfo: true }));
    try {
      setState((prev) => ({
        ...prev,
        additionalInfo: additional,
        loadingAdditionalInfo: false,
      }));
    } catch (err) {
      const errorDescription = `Не удалось распарсить в setAdditionalInfo\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      setState((prev) => ({
        ...prev,
        error: errorDescription,
        loadingAdditionalInfo: false,
      }));
    }
  }, []);

  const setListStateClear = useCallback(() => {
    setState((prev) => ({ ...prev, additionalInfo: {} }));
  }, []);

  const setListName = useCallback((type) => {
    setState((prev) => ({ ...prev, listName: type }));
  }, []);

  const setListData = useCallback((list) => {
    setState((prev) => ({ ...prev, ListData: list }));
  }, []);

  const setListState = useCallback(
    (listName, ListData, updateRecords = true) => {
      try {
        const res = JSON.parse(ListData);
        const additionalInfoObject = res.reduce(
          (acc, cur) => ({ ...acc, ...cur }),
          {}
        );
        setState((prev) => ({ ...prev, additionalInfo: additionalInfoObject }));
      } catch (err) {
        const errorDescription = `Не удалось распарсить в setListState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        setState((prev) => ({ ...prev, error: errorDescription }));
      }
    },
    []
  );

  const setViewSection = useCallback((sectionToUpdate) => {
    setState((prev) => {
      // Используем prev.forState вместо state.forState
      const updatedForState = prev.forState.map((section) => {
        console.log("Проверяем секцию:", section.SectionName);

        if (section.SectionName === sectionToUpdate.SectionName) {
          console.log("Нашли совпадение! Старое View:", section.View);
          const newView = !section.View;
          console.log("Новое View:", newView);

          return {
            ...section,
            View: newView,
          };
        }
        return section;
      });
      return { ...prev, forState: updatedForState };
    });
  }, []);

  // Раздел инструкций
  const setInstructionsState = useCallback(
    (appData) => {
      try {
        const res = !state.developer ? JSON.parse(appData) : dataInstructions;
        setState((prev) => ({ ...prev, instructions: res }));
      } catch (err) {
        const errorDescription = `Не удалось распарсить в setInstructionsState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        setState((prev) => ({ ...prev, error: errorDescription }));
      }
    },
    [state.developer]
  );

  useEffect(() => {
    setPageComponent({
      setUser,
      page: state.page,
      setPage,
      setAppState,
      setInstructionsState,
      error: state.error,
      forState: state.forState,
      setOpenSwiper,
      setListState,
      setTaskDoneStatus,
      setListStateClear,
    });
  }, [
    state.page,
    state.error,
    state.forState,
    setUser,
    setPage,
    setAppState,
    setInstructionsState,
    setOpenSwiper,
    setListState,
    setTaskDoneStatus,
    setListStateClear,
  ]);

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setUser,
        setPage,
        setAppState,
        setInstructionsState,
        setAdditionalInfo,
        setListState,
        setListData,
        setListName,
        setTaskDoneStatus,
        setReadNews,
        setOpenSwiper,
        setListStateClear,
        updateNewsCount,
        updateTaskCount,
        setViewSection,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
