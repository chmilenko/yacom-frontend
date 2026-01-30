import React, { lazy, ComponentType } from "react";

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
export const LayoutComponents: Record<
  LayoutType,
  React.LazyExoticComponent<ComponentType<LayoutComponentProps>>
> = {
  MAIN: lazy(() => import("./Main/Layout")),
  TASK_NEWS: lazy(() => import("./DetailtTaskNews/LayoutCreateTask")),
};

// Экспортируем fallback (используем где-то или удаляем если не нужен)
export const LayoutFallback = () => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Загрузка...
  </div>
);
