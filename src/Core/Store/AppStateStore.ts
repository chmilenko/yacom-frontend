// store/useAppStore.js
import { create } from "zustand";
import {
  ITab,
  ISection,
  IInstructions,
  IAdditionalInfo,
  AppState,
} from "@core/Types/AppState";

interface I1CData {
  Sections: ISection[];
  Tabs: ITab[];
}

let forStateMock: I1CData[] | undefined;
let dataInstructions: IInstructions[] | undefined;
let additionalMock: IAdditionalInfo[] | undefined;

if (process.env.REACT_APP_DEVELOPER === "true") {
  const mockModule = require("../Mock/mock") as {
    data: I1CData[];
    additionalData: IAdditionalInfo[];
  };
  const instructionsModule = require("../Mock/instructions") as {
    instructions: IInstructions[];
  };

  forStateMock = mockModule.data;
  additionalMock = mockModule.additionalData;
  dataInstructions = instructionsModule.instructions;
}

interface AppStore extends AppState {
  setAppState: (appData: string) => Promise<void>;
  // setUser: (user: any) => void;
  setPage: (page: string) => void;
  setInstructionsState: (appData: string) => Promise<void>;
  setOpenSwiper: (open: boolean) => void;
  setAdditionalInfo: (id: string | number, type: string) => void;
  setListStateClear: () => void;
  setListState: (ListData: string) => Promise<void>;
  setTaskDoneStatus: (id: string | number) => Promise<void>;
  setReadNews: (id: string | number) => Promise<void>;
}

export const useAppStore = create<AppStore>()((set, get) => ({
  menuItems: [] as ITab[],
  forState: [] as ISection[],
  instructions: [] as IInstructions[],
  additionalInfo: null as IAdditionalInfo | null,
  openSwiper: false,
  developer: process.env.REACT_APP_DEVELOPER === "true",
  page: "",
  countActualTasks: 0,
  countUnreadNews: 0,

  setPage: (newPage) => set({ page: newPage }),

  setAppState: async (appData: string) => {
    try {
      const { developer } = get();
      const res = !developer
        ? JSON.parse(appData)[0].Sections
        : forStateMock[0].Sections;

      const menuItems = !developer
        ? JSON.parse(appData)[0].Tabs
        : forStateMock[0].Tabs;

      const tasksSection = res.find(
        (section) =>
          section.SectionName === "Задачи" || section.SectionName === "Tasks"
      );

      const newsSection = res.find(
        (section: ISection) =>
          section.SectionName === "Новости" || section.SectionName === "News"
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
        await import("./ErrorsStore")
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

  setTaskDoneStatus: async (id: number | string) => {
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
          (s: ISection) =>
            s.SectionName === "Новости" || s.SectionName === "News"
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

      const tasksSection = updatedSections.find(
        (section: ISection) =>
          section.SectionName === "Задачи" || section.SectionName === "Tasks"
      );
      const tasks =
        tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

      const newsSection = updatedSections.find(
        (section: ISection) =>
          section.SectionName === "Новости" || section.SectionName === "News"
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
        await import("./ErrorsStore")
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

  setReadNews: async (id: number | string) => {
    try {
      const { developer, forState } = get();

      if (developer) {
        const updatedData = forState.map((section) => {
          if (!section.sectionData?.list) return section;

          const updatedList = section?.sectionData?.list?.map((item) =>
            item.ObjectID === id && item.New ? { ...item, New: false } : item
          );

          return {
            ...section,
            sectionData: { ...section.sectionData, list: updatedList },
          };
        });

        const newsSection = updatedData.find(
          (section) =>
            section.SectionName === "Новости" || section.SectionName === "News"
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
            section.SectionName === "Новости" || section.SectionName === "News"
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
        await import("./ErrorsStore")
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

  setAdditionalInfo: (id: number | string, type: string) => {
    try {
      let findAdditionalInfo: IAdditionalInfo;

      if (type === "Task" || type === "Задачи") {
        findAdditionalInfo = additionalMock?.find(
          (info) => info.TaskID === id.toString()
        );
      } else {
        findAdditionalInfo = additionalMock?.find(
          (info) => info.ObjectID === id.toString()
        );
      }

      if (!findAdditionalInfo) {
        console.warn(`Данные не найдены для ID: ${id}, тип: ${type}`);
        set({ additionalInfo: null });
      } else {
        set({ additionalInfo: findAdditionalInfo });
      }
    } catch (err) {
      console.error("setAdditionalInfo error:", err);
      set({ additionalInfo: null });
    }
  },

  setListStateClear: () => {
    set({ additionalInfo: null });
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
        await import("./ErrorsStore")
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

  setInstructionsState: async (appData) => {
    try {
      const { developer } = get();
      const res = !developer ? JSON.parse(appData) : dataInstructions;
      set({ instructions: res });
    } catch (err) {
      const { addError } = (
        await import("./ErrorsStore")
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
}));
