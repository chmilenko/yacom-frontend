// store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let userMock, data, dataInstructions, additionalMock;

if (process.env.REACT_APP_DEVELOPER === "true") {
  userMock = require("../../Core/Mock/mock").user;
  data = require("../../Core/Mock/mock").data;
  dataInstructions = require("../../Core/Mock/instructions").instructions;
  additionalMock = require("../../Core/Mock/mock").additionalData;
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: {},
      menuItems: [],
      forState: [],
      instructions: [],
      additionalInfo: [],
      openSwiper: false,
      listName: null,
      ListData: null,
      actions: [],
      developer: process.env.REACT_APP_DEVELOPER === "true",
      page: "",
      countActualTasks: 0,
      countUnreadNews: 0,

      setUser: (user) => {
        try {
          const { developer } = get();
          const res = !developer ? JSON.parse(user) : userMock;
          set({ user: res });
        } catch (err) {
          console.error(err);
        }
      },

      setPage: (newPage) => set({ page: newPage }),

      setAppState: async (appData) => {
        try {
          const { developer } = get();
          const res = !developer
            ? JSON.parse(appData).reduce((acc, val) => {
                acc = val.Sections;
                return acc;
              }, {})
            : data.reduce((acc, val) => {
                acc = val.Sections;
                return acc;
              }, {});

          const menuItems = !developer
            ? JSON.parse(appData).reduce((acc, val) => {
                acc = val.Tabs;
                return acc;
              }, [])
            : data.reduce((acc, val) => {
                acc = val.Tabs;
                return acc;
              }, []);

          const tasksSection = res.find(
            (section) =>
              section.SectionName === "Задачи" ||
              section.SectionName === "Tasks"
          );

          const newsSection = res.find(
            (section) =>
              section.SectionName === "Новости" ||
              section.SectionName === "News"
          );

          const tasks =
            tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

          const unreadNews =
            newsSection?.sectionData?.list?.filter((item) => item.New) || [];

          set({
            forState: res || [],
            menuItems: menuItems || [],
            countActualTasks: tasks.length,
            countUnreadNews: unreadNews.length,
          });
        } catch (err) {
          const { addError } = (
            await import("./ErrorContext")
          ).useErrorsStore.getState();

          addError({
            type: "parsing",
            message: "Ошибка парсинга данных приложения",
            severity: "error",
            context: "setAppState",
            details: `Не удалось распарсить данные в setAppState\nОшибка ${
              err.name
            }: ${err.message}\nДанные: ${
              typeof appData === "string"
                ? appData.substring(0, 200) + "..."
                : typeof appData
            }\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          });

          console.error("setAppState error:", err);
        }
      },

      setOpenSwiper: (swiperState) => set({ openSwiper: swiperState }),

      setTaskDoneStatus: async (id) => {
        try {
          const { forState } = get();

          const updatedData = JSON.parse(JSON.stringify(forState));
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
              (s) => s.SectionName === "Новости" || s.SectionName === "News"
            );

            if (!newsSection) {
              newsSection = {
                SectionCounter: 0,
                SectionName: "News",
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

          // Обновление счетчиков
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

          set({
            forState: updatedSections,
            countActualTasks: tasks.length,
            countUnreadNews: unreadNews.length,
          });
        } catch (err) {
          const { addError } = (
            await import("./ErrorContext")
          ).useErrorsStore.getState();

          addError({
            type: "application",
            message: "Ошибка обновления статуса задачи",
            severity: "error",
            context: "setTaskDoneStatus",
            details: `Не удалось обновить статус задачи ID: ${id}\nОшибка ${err.name}: ${err.message}\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          });

          console.error("setTaskDoneStatus error:", err);
        }
      },

      setReadNews: async (id) => {
        try {
          const { developer, forState } = get();

          if (developer) {
            const updatedData = forState.map((section) => {
              if (!section.sectionData?.list) return section;

              const updatedList = section?.sectionData?.list?.map((item) =>
                item.ObjectID === id && item.New
                  ? { ...item, New: false }
                  : item
              );

              return {
                ...section,
                sectionData: { ...section.sectionData, list: updatedList },
              };
            });

            const newsSection = updatedData.find(
              (section) =>
                section.SectionName === "Новости" ||
                section.SectionName === "News"
            );
            const unreadNews =
              newsSection?.sectionData?.list?.filter((item) => item.New) || [];

            set({
              forState: updatedData,
              countUnreadNews: unreadNews.length,
            });
          } else {
            const updatedData = forState.map((section) => {
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

            const newsSection = updatedData.find(
              (section) =>
                section.SectionName === "Новости" ||
                section.SectionName === "News"
            );
            const unreadNews =
              newsSection?.sectionData?.list?.filter((item) => item.New) || [];

            set({
              forState: updatedData,
              countUnreadNews: unreadNews.length,
            });
          }
        } catch (err) {
          const { addError } = (
            await import("./ErrorContext")
          ).useErrorsStore.getState();

          addError({
            type: "application",
            message: "Ошибка отметки новости как прочитанной",
            severity: "error",
            context: "setReadNews",
            details: `Не удалось обновить статус новости ID: ${id}\nОшибка ${err.name}: ${err.message}\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          });

          console.error("setReadNews error:", err);
        }
      },

      setAdditionalInfo: (id, type) => {
        try {
          let findAdditionalInfo;

          if (type === "Task" || type === "Задачи") {
            findAdditionalInfo = additionalMock.find(
              (info) => info.TaskID === id
            );
          } else {
            findAdditionalInfo = additionalMock.find(
              (info) => info.ObjectID === id
            );
          }

          if (!findAdditionalInfo) {
            console.warn(`Данные не найдены для ID: ${id}, тип: ${type}`);
          }

          set({ additionalInfo: findAdditionalInfo || {} });
        } catch (err) {
          console.error("setAdditionalInfo error:", err);
        }
      },

      setListStateClear: () => {
        set({ additionalInfo: {} });
      },

      setListState: async (ListData) => {
        try {
          const res = JSON.parse(ListData).reduce((acc, val) => {
            acc = val;
            return acc;
          }, {});

          set({ additionalInfo: res });
        } catch (err) {
          const { addError } = (
            await import("./ErrorContext")
          ).useErrorsStore.getState();

          addError({
            type: "parsing",
            message: "Ошибка обработки данных списка",
            severity: "error",
            context: "setListState",
            details: `Не удалось обработать данные в setListState\nОшибка ${
              err.name
            }: ${err.message}\nТип данных: ${typeof ListData}\nФормат: ${
              Array.isArray(ListData) ? "array" : typeof ListData
            }\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          });

          console.error("setListState error:", err);
        }
      },

      setViewSection: (sectionToUpdate) => {
        const { forState } = get();

        const updatedForState = forState.map((section) => {
          if (section.SectionName === sectionToUpdate.SectionName) {
            const newView = !section.View;
            return {
              ...section,
              View: newView,
            };
          }
          return section;
        });

        set({ forState: updatedForState });
      },

      setInstructionsState: async (appData) => {
        try {
          const { developer } = get();
          const res = !developer ? JSON.parse(appData) : dataInstructions;
          set({ instructions: res });
        } catch (err) {
          const { addError } = (
            await import("./ErrorContext")
          ).useErrorsStore.getState();

          addError({
            type: "parsing",
            message: "Ошибка парсинга инструкций",
            severity: "error",
            context: "setInstructionsState",
            details: `Не удалось распарсить инструкции\nОшибка ${err.name}: ${err.message}\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          });

          console.error("setInstructionsState error:", err);
        }
      },

      // Вспомогательные методы для счетчиков
      updateNewsCount: () => {
        const { forState } = get();
        const unreadNews = forState
          .flatMap((section) => section.sectionData?.list || [])
          .filter((news) => news.New);
        set({ countUnreadNews: unreadNews.length });
      },

      updateTaskCount: () => {
        const { forState } = get();
        const tasks = forState
          .flatMap((section) => section.sectionData?.list || [])
          .filter((item) => !item.Done);
        set({ countActualTasks: tasks.length });
      },

      updateState: (newState) => set((state) => ({ ...state, ...newState })),

      /* { i.bezryadin / 2025.11.11 */
      getListState: (listName) => {
        const { forState } = get();
        return JSON.stringify(
          forState.find((obj) => obj.SectionKey === listName)
        );
      },
      tryJsonParse: (JSONData) => {
        try {
          let obj = JSON.parse(JSONData);
          return "Удалось распарсить";
        } catch (err) {
          return `Не удалось распарсить в tryJsonParse\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
        }
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
      getCurrentadditionalInfo: () => {
        try {
          const { additionalInfo } = get();
          return JSON.stringify(additionalInfo);
        } catch (err) {
          const errorDescription = `Ошибка в getCurrentadditionalInfo Ошибка 
            ${err.name}: ${err.message} ${err.stack}`;

          return "getAppStateJsonErrors error: " + errorDescription;
        }
      },
      addErrorAppStore: (errorWithId) => {
        const { errors } = get();
        set({ errors: [errorWithId, ...errors] });
      },
      /* } i.bezryadin / 2025.11.11 */
    }),
    {
      name: "app-storage",
      partialize: (state) => ({}),
    }
  )
);
