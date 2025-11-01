// store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let userData, data, dataInstructions;
if (process.env.REACT_APP_DEVELOPER === "true") {
  userData = require("../../Core/Mock/mock").user;
  data = require("../../Core/Mock/mock").data;
  dataInstructions = require("../../Core/Mock/instructions").instructions;
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
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

      setUser: (appData) => {
        try {
          const { developer } = get();
          const res = !developer ? JSON.parse(appData) : userData;
          const userInfoObject = res.reduce(
            (acc, cur) => ({ ...acc, ...cur }),
            {}
          );
          set({ user: userInfoObject });
        } catch (err) {
          const errorDescription = `Не удалось распарсить в setUser\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
          console.error("setUser error:", errorDescription);
        }
      },

      setPage: (newPage) => set({ page: newPage }),

      setAppState: (appData) => {
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
          const errorDescription = `Не удалось распарсить в setAppState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
          console.error("setAppState error:", errorDescription);
        }
      },

      setOpenSwiper: (swiperState) => set({ openSwiper: swiperState }),

      setTaskDoneStatus: (id) => {
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
            section.SectionName === "Задачи" || section.SectionName === "Tasks"
        );
        const tasks =
          tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

        const newsSection = updatedSections.find(
          (section) =>
            section.SectionName === "Новости" || section.SectionName === "News"
        );
        const unreadNews =
          newsSection?.sectionData?.list?.filter((item) => item.New) || [];

        set({
          forState: updatedSections,
          countActualTasks: tasks.length,
          countUnreadNews: unreadNews.length,
        });
      },

      setReadNews: (id) => {
        const { developer, forState } = get();

        if (developer) {
          const updatedData = forState.map((section) => {
            if (!section.sectionData?.list) return section;

            const updatedList = section.sectionData.list.map((item) =>
              item.ObjectID === id && item.New ? { ...item, New: false } : item
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
      },

      setAdditionalInfo: (additional) => {
        set({ additionalInfo: additional });
      },

      setListStateClear: () => {
        set({ additionalInfo: {} });
      },

      setListName: (type) => {
        set({ listName: type });
      },

      setListData: (list) => {
        set({ ListData: list });
      },

      setListState: (listName, ListData, updateRecords = true) => {
        try {
          const { developer } = get();
          let res;

          if (developer) {
            res = ListData;
          } else {
            res = JSON.parse(ListData);
          }

          let additionalInfoObject;

          if (Array.isArray(res)) {
            additionalInfoObject = res.reduce(
              (acc, cur) => ({ ...acc, ...cur }),
              {}
            );
          } else if (typeof res === "object" && res !== null) {
            additionalInfoObject = res;
          } else {
            throw new Error(`Неожиданный формат данных: ${typeof res}`);
          }

          set({ additionalInfo: additionalInfoObject });
        } catch (err) {
          const errorDescription = `Не удалось обработать данные в setListState\nОшибка ${
            err.name
          }: ${err.message}\nТип данных: ${typeof ListData}\nФормат: ${
            Array.isArray("res") ? "array" : typeof res
          }\n${err.stack}`;
          console.error("setListState error:", errorDescription);
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

      setInstructionsState: (appData) => {
        try {
          const { developer } = get();
          const res = !developer ? JSON.parse(appData) : dataInstructions;
          set({ instructions: res });
        } catch (err) {
          const errorDescription = `Не удалось распарсить в setInstructionsState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
          console.error("setInstructionsState error:", errorDescription);
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
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        menuItems: state.menuItems,
        forState: state.forState,
        instructions: state.instructions,
        developer: state.developer,
      }),
    }
  )
);
