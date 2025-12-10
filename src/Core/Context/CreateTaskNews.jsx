// store/useAppStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

let chaptersMock, tasksTypeMock;
if (process.env.REACT_APP_DEVELOPER === "true") {
  chaptersMock = require("../../Core/Mock/mock").chapters;
  tasksTypeMock = require("../../Core/Mock/instructions").tasksType;
}

export const useCreateTaskNews = create(
  persist((set, get) => ({
    chapters: [],
    tasksType: [],

    setChapters: async (chapters) => {
      try {
        const { developer } = get();
        const res = !developer ? JSON.parse(chapters) : chaptersMock;

        set({
          chapters: res || [],
        });
      } catch (err) {
        const { addError } = (
          await import("./ErrorContext")
        ).useErrorsStore.getState();

        addError({
          type: "parsing",
          message: "Ошибка парсинга данных приложения",
          severity: "error",
          context: "setChapters",
          details: `Не удалось распарсить данные в setChapters\nОшибка ${
            err.name
          }: ${err.message}\nДанные: ${
            typeof chapters === "string"
              ? chapters.substring(0, 200) + "..."
              : typeof chapters
          }\n${err.stack}`,
          originalError: {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
        });

        console.error("setChapters error:", err);
      }
    },

    setTaskTypes: async (types) => {
      try {
        const { developer } = get();
        const res = !developer ? JSON.parse(types) : tasksTypeMock;

        set({
          tasksType: res || [],
        });
      } catch (err) {
        const { addError } = (
          await import("./ErrorContext")
        ).useErrorsStore.getState();

        addError({
          type: "parsing",
          message: "Ошибка парсинга данных приложения",
          severity: "error",
          context: "setTaskTypes",
          details: `Не удалось распарсить данные в setTaskTypes\nОшибка ${
            err.name
          }: ${err.message}\nДанные: ${
            typeof types === "string"
              ? types.substring(0, 200) + "..."
              : typeof types
          }\n${err.stack}`,
          originalError: {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
        });

        console.error("setChapters error:", err);
      }
    },
  }))
);
