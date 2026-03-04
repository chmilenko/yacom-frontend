import { create } from "zustand";
import {
  ITab,
  ISection,
  IInstructions,
  IAdditionalInfo,
  AppState,
  User,
} from "@core/Types/AppState";
import { useAppModeStore } from "./AppModeStore";
import { notify } from "../../Utils/oneSNotification";

interface AppStore extends AppState {
  setAppState: (appData: string) => Promise<void>;
  setUser: (user: any) => void;
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
  user: {} as User,
  developer: process.env.REACT_APP_DEVELOPER === "true",
  page: "",
  countActualTasks: 0,
  countUnreadNews: 0,

  setPage: (newPage) => set({ page: newPage }),

  setUser: async (user) => {
    try {
      const { useMockData } = useAppModeStore.getState();

      let userMock;

      if (useMockData) {
        const mockModule = await import("../Mock/mock");
        userMock = mockModule.user;
      }
      const res = !useMockData ? JSON.parse(user) : userMock;
      set({ user: res });
    } catch (err) {
      const { addError } = (
        await import("./ErrorsStore")
      ).useErrorsStore.getState();

      addError({
        type: "parsing",
        message: "Ошибка получения данных о пользователе",
        severity: "error",
        context: "setAppState",
        details: `Не удалось получить данные в setUser\nОшибка ${err.name}: ${
          err.message
        }\nДанные: ${
          typeof user === "string"
            ? user.substring(0, 200) + "..."
            : typeof user
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

  setAppState: async (appData: string) => {
    const isDebugMode = useAppModeStore.getState().isDebugMode;
    try {
      const useMockData = useAppModeStore.getState().useMockData;
      // Получаем моки ТОЛЬКО если нужны
      let forStateMock;

      if (useMockData) {
        // Динамический импорт моков
        const mockModule = await import("../Mock/mock");
        forStateMock = mockModule.data;
      }
      const res = !useMockData
        ? JSON.parse(appData)[0].Sections
        : forStateMock[0].Sections;

      const menuItems = !useMockData
        ? JSON.parse(appData)[0].Tabs
        : forStateMock[0].Tabs;

      const tasksSection = res.find(
        (section) =>
          section.SectionName === "Задачи" || section.SectionName === "Tasks",
      );

      const newsSection = res.find(
        (section: ISection) =>
          section.SectionName === "Новости" || section.SectionName === "News",
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

      addError(
        {
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
        },
        isDebugMode,
      );

      console.error("setAppState error:", err);
    }
  },

  setOpenSwiper: (swiperState) => set({ openSwiper: swiperState }),

  setTaskDoneStatus: async (id: number | string) => {
    const isDebugMode = useAppModeStore.getState().isDebugMode;
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
            s.SectionName === "Новости" || s.SectionName === "News",
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
          section.SectionName === "Задачи" || section.SectionName === "Tasks",
      );
      const tasks =
        tasksSection?.sectionData?.list?.filter((item) => !item.Done) || [];

      const newsSection = updatedSections.find(
        (section: ISection) =>
          section.SectionName === "Новости" || section.SectionName === "News",
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

      addError(
        {
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
        },
        isDebugMode,
      );

      console.error("setTaskDoneStatus error:", err);
    }
  },

  setReadNews: async (id: number | string) => {
    const isDebugMode = useAppModeStore.getState().isDebugMode;
    try {
      const { forState } = get();
      const useMockData = useAppModeStore.getState().useMockData;

      if (useMockData) {
        const updatedData = forState.map((section) => {
          if (!section.sectionData?.list) return section;

          const updatedList = section?.sectionData?.list?.map((item) =>
            item.ObjectID === id && item.New ? { ...item, New: false } : item,
          );
          return {
            ...section,
            sectionData: { ...section.sectionData, list: updatedList },
          };
        });

        const newsSection = updatedData.find(
          (section) =>
            section.SectionName === "Новости" || section.SectionName === "News",
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

          const updatedList = section?.sectionData?.list?.map((item) =>
            item.ObjectID === id && item.New ? { ...item, New: false } : item,
          );

          return {
            ...section,
            sectionData: { ...section.sectionData, list: updatedList },
          };
        });

        const newsSection = updatedData.find(
          (section) =>
            section.SectionName === "Новости" || section.SectionName === "News",
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

      addError(
        {
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
        },
        isDebugMode,
      );

      console.error("setReadNews error:", err);
    }
  },

  setAdditionalInfo: async (id: number | string, type: string) => {
    try {
      const useMockData = useAppModeStore.getState().useMockData;
      let findAdditionalInfo;

      if (useMockData) {
        // Динамический импорт моков
        const mockModule = await import("../Mock/mock");
        findAdditionalInfo = mockModule.additionalData;
      }

      if (type === "Task" || type === "Задачи") {
        findAdditionalInfo = findAdditionalInfo?.find(
          (info) => info.TaskID === id,
        );
      } else {
        findAdditionalInfo = findAdditionalInfo?.find(
          (info) => info.ObjectID === id,
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
    const isDebugMode = useAppModeStore.getState().isDebugMode;

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
    const isDebugMode = useAppModeStore.getState().isDebugMode;

    try {
      const useMockData = useAppModeStore.getState().useMockData;
      let dataInstructions: IInstructions[];

      if (useMockData) {
        // Динамический импорт моков
        const mockModule = await import("../Mock/instructions");
        dataInstructions = mockModule.instructions;
      }
      const res = !useMockData ? JSON.parse(appData) : dataInstructions;
      set({ instructions: res });
    } catch (err) {
      const { addError } = (
        await import("./ErrorsStore")
      ).useErrorsStore.getState();

      addError(
        {
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
        },
        isDebugMode,
      );

      console.error("setInstructionsState error:", err);
    }
  },
}));
