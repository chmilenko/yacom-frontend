// Core/Store/CreateTaskStore.ts
import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { useAppModeStore } from "./AppModeStore";

// Типы для данных
export interface ITask {
  TaskID?: number;
  title?: string;
  mainTag?: string;
  tagTitle?: string;
  date?: string;
  Content?: string;
  deadline?: string;
  creator?: string;
  subTag?: string;
  attachments?: IAttachment[];
  number?: string;
  typeTask?: string;
  resultType?: string;
  Responsible?: string;
  DoneDate?: string;
  Executor?: string;
  [key: string]: any;
}

export interface IAttachment {
  ObjectName: string;
  PrintAvailable: boolean;
  IsFile: boolean;
}

export interface IChapter {
  id: string | number;
  name: string;
  code?: string;
  [key: string]: any;
}

export interface IResultType {
  id: string | number;
  name: string;
  code?: string;
  [key: string]: any;
}

// Тип для формы создания задачи
export interface ITaskFormData {
  chapter: string;
  subdivision: string;
  resultType: string;
  title: string;
  deadline: string;
  content: string;
}

// Тип для ошибок формы
export interface IFormErrors {
  chapter?: string;
  subdivision?: string;
  resultType?: string;
  title?: string;
  deadline?: string;
  content?: string;
  general?: string;
  [key: string]: string | undefined;
}

// Типы для мок-модулей
interface IMockModule {
  chapters?: IChapter[];
  resultTypes?: IResultType[];
}

interface IFullTasksModule {
  fullTasks?: ITask[];
  oneTask?: ITask[];
}

// Тип для стора
interface CreateTaskStore {
  // Данные
  fullTasks: ITask[];
  oneTask: ITask | null;
  chapters: IChapter[];
  resultTypes: IResultType[];

  // Состояние формы
  taskFormData: ITaskFormData;
  isCreatingTask: boolean;
  createTaskError: IFormErrors | null;

  // Методы
  setFullTasks: (tasks: string) => Promise<void>;
  setChapters: (chapters: string) => Promise<void>;
  setResultTypes: (types: string) => Promise<void>;
  updateTaskFormData: (field: keyof ITaskFormData, value: string) => void;
  resetTaskForm: () => void;
  postTask: () => Promise<{ success: boolean; data: ITaskFormData }>;
  getFullTask: (task: string) => void;
  getOneTask: (oneTask: string) => Promise<void>;
  getFullTaskDeveloper: (id: string | number) => Promise<void>;
  clearErrors: () => void;
}

export const useCreateTaskStore = create<CreateTaskStore>()(
  (set, get) => ({
    // Начальное состояние
    fullTasks: [],
    oneTask: null,
    chapters: [],
    resultTypes: [],
    taskFormData: {
      chapter: "",
      subdivision: "Т054 Томск, Тверская 81",
      resultType: "",
      title: "",
      deadline: "",
      content: "",
    },
    isCreatingTask: false,
    createTaskError: null,

    // Методы
    setFullTasks: async (tasks: string) => {
      const isDebugMode = useAppModeStore.getState().isDebugMode;

      try {
        const { useMockData } = useAppModeStore.getState();
        let fullTasksMock;

        if (useMockData) {
          const mockModule = await import("../Mock/fullTasks");
          fullTasksMock = mockModule.fullTasks || [];
        }

        const res = !useMockData
          ? (JSON.parse(tasks) as ITask[])
          : fullTasksMock;

        set({
          fullTasks: res,
        });
      } catch (err: any) {
        const { addError } = (
          await import("./ErrorsStore")
        ).useErrorsStore.getState();

        addError(
          {
            type: "parsing",
            message: "Ошибка парсинга данных задачи",
            severity: "error",
            context: "setFullTasks",
            details: `Не удалось распарсить данные в setFullTasks\nОшибка ${
              err.name
            }: ${err.message}\nДанные: ${
              typeof tasks === "string"
                ? tasks.substring(0, 200) + "..."
                : typeof tasks
            }\n${err.stack}`,
            originalError: {
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
          },
          isDebugMode
        );

        console.error("setAppState error:", err);
      }
    },

    setChapters: async (chapters: string) => {
      try {
        const { useMockData } = useAppModeStore.getState();
        let chaptersMock: IChapter[] = [];

        if (useMockData) {
          const mockModule = (await import("../Mock/mock")) as IMockModule;
          chaptersMock = mockModule.chapters || [];
        }

        const res = !useMockData
          ? (JSON.parse(chapters) as IChapter[])
          : chaptersMock;

        set({
          chapters: res,
        });
      } catch (err: any) {
        console.error("Ошибка в setChapters:", err);
      }
    },

    setResultTypes: async (types: string) => {
      try {
        const { useMockData } = useAppModeStore.getState();
        let tasksResultTypes: IResultType[] = [];

        if (useMockData) {
          const mockModule = (await import("../Mock/mock")) as IMockModule;
          tasksResultTypes = mockModule.resultTypes || [];
        }

        const res = !useMockData
          ? (JSON.parse(types) as IResultType[])
          : tasksResultTypes;

        set({
          resultTypes: res,
        });
      } catch (err: any) {
        console.error("Ошибка в setResultTypes:", err);
      }
    },

    updateTaskFormData: (field: keyof ITaskFormData, value: string) => {
      set((state) => ({
        taskFormData: {
          ...state.taskFormData,
          [field]: value,
        },
        createTaskError: state.createTaskError
          ? { ...state.createTaskError, [field]: undefined }
          : null,
      }));
    },

    resetTaskForm: () => {
      set({
        taskFormData: {
          chapter: "",
          subdivision: "Т054 Томск, Тверская 81",
          resultType: "",
          title: "",
          deadline: "",
          content: "",
        },
        createTaskError: null,
      });
    },

    postTask: async () => {
      const { taskFormData } = get();
      const errors: IFormErrors = {};

      // Валидация
      if (!taskFormData.chapter) {
        errors.chapter = "Выберите раздел";
      }
      if (!taskFormData.resultType) {
        errors.resultType = "Выберите тип результата";
      }
      if (!taskFormData.title || !taskFormData.title.trim()) {
        errors.title = "Введите заголовок";
      }
      if (!taskFormData.deadline) {
        errors.deadline = "Выберите дату выполнения";
      }
      if (!taskFormData.content || !taskFormData.content.trim()) {
        errors.content = "Введите содержание";
      }

      if (Object.keys(errors).length > 0) {
        set({ createTaskError: errors });
        throw new Error("Ошибка валидации формы");
      }

      set({ isCreatingTask: true, createTaskError: null });

      try {
        // Имитация запроса к API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = {
          success: true,
          data: { ...taskFormData },
        };

        get().resetTaskForm();
        return result;
      } catch (error: any) {
        console.error("Ошибка при создании задачи:", error);
        set({
          createTaskError: {
            general: error.message || "Неизвестная ошибка",
          },
        });
        throw error;
      } finally {
        set({ isCreatingTask: false });
      }
    },

    getFullTask: (task: string) => {
      try {
        const res = JSON.parse(task) as ITask[];
        set({
          oneTask: res || [],
        });
      } catch (err: any) {
        console.error("Ошибка в getFullTask:", err);
      }
    },

    getOneTask: async (oneTask: string) => {
      try {
        const res = JSON.parse(oneTask) as ITask;
        set({
          oneTask: res || [],
        });
      } catch (err: any) {
        console.error("Ошибка в getOneTask:", err);
      }
    },

    getFullTaskDeveloper: async (id: string | number) => {
      try {
        const mockModule = await import("../Mock/fullTasks");
        const oneTaskData = mockModule.oneTask || [];
        const res = oneTaskData.find((task) => task.TaskID === id);

        set({
          oneTask: res || [],
        });
      } catch (err: any) {
        console.error("Ошибка в getFullTaskDeveloper:", err);
      }
    },

    clearErrors: () => {
      set({ createTaskError: null });
    },
  })
  // {
  //   name: "create-task-storage",
  //   partialize: (state) => ({}),
  // }
  // )
);
