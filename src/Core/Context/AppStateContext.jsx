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
      .flatMap((section) => section.sectionData?.list || [])
      .filter((news) => news.New);
    setState((prev) => ({ ...prev, countUnreadNews: unreadNews.length }));
  }, [state.forState]);

  const updateTaskCount = useCallback(() => {
    console.log("Обновление счетчика задач...");

    const tasks = state.forState
      .flatMap((section) => section.sectionData?.list || [])
      .filter((item) => !item.Done);
    setState((prev) => ({ ...prev, countActualTasks: tasks.length }));
  }, [state.forState]);

  const setAppState = useCallback(
    (appData) => {
      try {
        const res = !state.developer ? JSON.parse(appData) : data;
        setState((prev) => {
          const newState = { ...prev, forState: res };

          const tasksSection = res.find(
            (section) =>
              section.SectionName === "Задачи" ||
              section.SectionName === "Tasks"
          );
          const tasks =
            tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

          const newsSection = res.find(
            (section) =>
              section.SectionName === "Новости" ||
              section.SectionName === "News"
          );
          const unreadNews =
            newsSection?.sectionData?.list?.filter((item) => item.New) || [];

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
    [state.developer]
  );

  const setOpenSwiper = useCallback((swiperState) => {
    setState((prev) => ({ ...prev, openSwiper: swiperState }));
  }, []);

  const setTaskDoneStatus = useCallback(
    (id) => {
      if (state.developer) {
        const updatedData = JSON.parse(JSON.stringify(state.forState));
        let taskToMove = null;

        const updatedSections = updatedData.map((section) => {
          if (!section.sectionData?.list) return section;

          const updatedList = section.sectionData.list
            .map((item) => {
              if ((item.TaskID !== id && item.ObjectID !== id) || item.Done)
                return item;

              if (item.ResultType != 8 && item.ObjectType === "Task") {
                return { ...item, Done: true };
              }

              if (item.ResultType == 8 && item.ObjectType === "News") {
                taskToMove = {
                  ...item,
                  isReport: true,
                  Done: true,
                  New: false,
                };
                delete taskToMove.ResultType;
                return null;
              }

              return item;
            })
            .filter(Boolean);

          return {
            ...section,
            sectionData: { ...section.sectionData, list: updatedList },
          };
        });

        if (taskToMove) {
          let newsSection = updatedSections.find(
            (s) => s.SectionName === "Новости"
          );

          if (!newsSection) {
            newsSection = {
              SectionCounter: 0,
              SectionName: "Новости",
              Sort: 1,
              SectionUpdate: "Обновлено недавно",
              SectionNeedsUpdate: false,
              sectionData: {
                list: [],
              },
            };
            updatedSections.push(newsSection);
          }

          newsSection.sectionData = newsSection.sectionData || { list: [] };
          newsSection.sectionData.list.unshift(taskToMove);
        }

        setState((prev) => {
          const newState = { ...prev, forState: updatedSections };

          const tasksSection = updatedSections.find(
            (section) =>
              section.SectionName === "Задачи" ||
              section.SectionName === "Tasks"
          );
          const tasks =
            tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

          const newsSection = updatedSections.find(
            (section) =>
              section.SectionName === "Новости" ||
              section.SectionName === "News"
          );
          const unreadNews =
            newsSection?.sectionData?.list?.filter((item) => item.New) || [];

          return {
            ...newState,
            countActualTasks: tasks.length,
            countUnreadNews: unreadNews.length,
          };
        });
      } else {
        setState((prev) => {
          const updatedData = JSON.parse(JSON.stringify(prev.forState));
          let taskToMove = null;

          const updatedSections = updatedData.map((section) => {
            if (!section.sectionData?.list) return section;

            const updatedList = section.sectionData.list
              .map((item) => {
                if ((item.TaskID !== id && item.ObjectID !== id) || item.Done)
                  return item;

                if (item.ResultType != 8 && item.ObjectType === "Task") {
                  return { ...item, Done: true };
                }

                if (item.ResultType == 8 && item.ObjectType === "News") {
                  taskToMove = {
                    ...item,
                    isReport: true,
                    Done: true,
                    New: false,
                  };
                  delete taskToMove.ResultType;
                  return null;
                }

                return item;
              })
              .filter(Boolean);

            return {
              ...section,
              sectionData: { ...section.sectionData, list: updatedList },
            };
          });

          if (taskToMove) {
            let newsSection = updatedSections.find(
              (s) => s.SectionName === "Новости"
            );

            if (!newsSection) {
              newsSection = {
                SectionCounter: 0,
                SectionName: "Новости",
                Sort: 1,
                SectionUpdate: "Обновлено недавно",
                SectionNeedsUpdate: false,
                sectionData: {
                  list: [],
                },
              };
              updatedSections.push(newsSection);
            }

            newsSection.sectionData = newsSection.sectionData || { list: [] };
            newsSection.sectionData.list.unshift(taskToMove);
          }

          const tasksSection = updatedSections.find(
            (section) =>
              section.SectionName === "Задачи" ||
              section.SectionName === "Tasks"
          );
          const tasks =
            tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

          const newsSection = updatedSections.find(
            (section) =>
              section.SectionName === "Новости" ||
              section.SectionName === "News"
          );
          const unreadNews =
            newsSection?.sectionData?.list?.filter((item) => item.New) || [];

          return {
            ...prev,
            forState: updatedSections,
            countActualTasks: tasks.length,
            countUnreadNews: unreadNews.length,
          };
        });
      }
    },
    [state.developer, state.forState] // убрал updateTaskCount из зависимостей
  );

  const setReadNews = useCallback(
    (id) => {
      console.log(id);

      if (state.developer) {
        const updatedData = state.forState.map((section) => {
          if (!section.sectionData?.list) return section;

          const updatedList = section.sectionData.list.map((item) =>
            item.ObjectID === id && item.New ? { ...item, New: false } : item
          );
          console.log(updatedList);

          return {
            ...section,
            sectionData: { ...section.sectionData, list: updatedList },
          };
        });

        state.forState.length = 0;
        state.forState.push(...updatedData);
        updateNewsCount();
      } else {
        setState((prev) => {
          const updatedData = prev.forState.map((section) => {
            if (!section.sectionData?.list) return section;

            const updatedList = section.sectionData.list.map((item) =>
              item.ObjectID === id && item.New && item.ObjectType === "News"
                ? { ...item, New: false }
                : item
            );

            return {
              ...section,
              sectionData: { ...section.sectionData, list: updatedList },
            };
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
      const updatedForState = prev.forState.map((section) => {
        if (section.SectionName === sectionToUpdate.SectionName) {
          const newView = !section.View;
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
