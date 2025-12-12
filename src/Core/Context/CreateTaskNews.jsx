// store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let chaptersMock, tasksResultTypes;
if (process.env.REACT_APP_DEVELOPER === "true") {
  chaptersMock = require("../../Core/Mock/mock").chapters;
  tasksResultTypes = require("../../Core/Mock/mock").resultTypes;
}

export const useCreateTaskNews = create(
  persist((set, get) => ({
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

    setChapters: (chapters) => {
      try {
        const isDev =
          process.env.REACT_APP_DEVELOPER === "true" ||
          window.location.hostname === "localhost";
        const res = !isDev ? JSON.parse(chapters) : chaptersMock;
        set({
          chapters: res || [],
        });
      } catch (err) {
        console.error(err);
      }
    },

    setResultTypes: (types) => {
      try {
        const isDev =
          process.env.REACT_APP_DEVELOPER === "true" ||
          window.location.hostname === "localhost";
        const res = !isDev ? JSON.parse(types) : tasksResultTypes;
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
      if (!taskFormData.deadline) errors.deadline = "Выберите дату выполнения";
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
  }))
);
