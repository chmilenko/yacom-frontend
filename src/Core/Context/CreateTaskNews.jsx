// store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let chaptersMock, tasksResultTypes, fullTasksMock, mockOneTask;
if (process.env.REACT_APP_DEVELOPER === "true") {
  chaptersMock = require("../../Core/Mock/mock").chapters;
  tasksResultTypes = require("../../Core/Mock/mock").resultTypes;
  fullTasksMock = require("../../Core/Mock/fullTasks").fullTasks;
  mockOneTask = require("../../Core/Mock/fullTasks").oneTask;
}

export const useCreateTaskNews = create(
  persist(
    (set, get) => ({
      fullTasks: [],
      oneTask: {},
      chapters: [],
      resultTypes: [],
      developer: process.env.REACT_APP_DEVELOPER === "true",
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

      setFullTasks: async (tasks) => {
        try {
          const { developer } = get();
          const res = !developer ? JSON.parse(tasks) : fullTasksMock;
          set({
            fullTasks: res || [],
          });
        } catch (err) {
          console.error(err);
        }
      },

      setChapters: (chapters) => {
        try {
          const { developer } = get();

          const res = !developer ? JSON.parse(chapters) : chaptersMock;
          set({
            chapters: res || [],
          });
        } catch (err) {
          console.error(err);
        }
      },

      setResultTypes: (types) => {
        try {
          const { developer } = get();

          const res = !developer ? JSON.parse(types) : tasksResultTypes;
          set({
            resultTypes: res || [],
          });
        } catch (err) {
          console.error(err);
        }
      },

      updateTaskFormData: (field, value) => {
        set((state) => ({
          taskFormData: {
            ...state.taskFormData,
            [field]: value,
          },
          createTaskError: state.createTaskError
            ? { ...state.createTaskError, [field]: null }
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

        const errors = {};
        if (!taskFormData.chapter) errors.chapter = "Выберите раздел";
        if (!taskFormData.resultType)
          errors.resultType = "Выберите тип результата";
        if (!taskFormData.title || !taskFormData.title.trim())
          errors.title = "Введите заголовок";
        if (!taskFormData.deadline)
          errors.deadline = "Выберите дату выполнения";
        if (!taskFormData.content || !taskFormData.content.trim())
          errors.content = "Введите содержание";

        if (Object.keys(errors).length > 0) {
          set({ createTaskError: errors });
          throw new Error("Ошибка валидации формы");
        }

        set({ isCreatingTask: true, createTaskError: null });

        try {
          console.log("Отправка задачи на сервер:", taskFormData);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          const result = {
            success: true,
            data: {
              ...taskFormData,
            },
          };

          get().resetTaskForm();

          return result;
        } catch (error) {
          console.error("Ошибка при создании задачи:", error);
          set({ createTaskError: { general: error.message } });
          throw error;
        } finally {
          set({ isCreatingTask: false });
        }
      },

      getFullTask: (task) => {
        try {
          const res = JSON.parse(task);
          set({
            oneTask: res || [],
          });
        } catch (err) {
          console.error(err);
        }
      },

      getFullTaskDeveloper: (id) => {
        try {
          const res = mockOneTask.find((task) => task.TaskId === id);
          set({
            oneTask: res || [],
          });
        } catch (err) {
          console.error(err);
        }
      },

      clearErrors: () => {
        set({ createTaskError: null });
      },
    }),
    {
      name: "сreate-storage",
      partialize: (state) => ({}),
    }
  )
);
