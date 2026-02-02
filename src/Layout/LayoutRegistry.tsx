import TaskNewsLayout from "./DetailtTaskNews/LayoutCreateTask";
import Layout from "./Main/Layout";

// Регистрируем все Layouts
export const LAYOUTS = {
  MAIN: "main",
  TASK_NEWS: "task_news",
} as const;

export type LayoutType = keyof typeof LAYOUTS;

// Маппинг путей к Layouts
export const PATH_TO_LAYOUT_MAP: Record<string, LayoutType> = {
  "/": "MAIN",
  "/instructions": "MAIN",
  "/help": "MAIN",
  "/journals": "MAIN",
  "/products": "MAIN",
  "/errors": "MAIN",
  "/task/*": "TASK_NEWS",
  "/news/*": "TASK_NEWS",
};

// Интерфейс для всех Layout компонентов
export interface LayoutComponentProps {
  children?: React.ReactNode;
}

// Динамические импорты для code splitting с правильными типами
export const LayoutComponents = {
  MAIN: Layout,
  TASK_NEWS: TaskNewsLayout,
};
