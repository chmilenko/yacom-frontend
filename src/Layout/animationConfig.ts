export const ANIMATION_CONFIG = {
  durations: {
    layoutTransition: 300,
    pageTransition: 250,
    footerTransition: 200,
  },
  easings: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    deceleration: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    acceleration: "cubic-bezier(0.4, 0.0, 1, 1)",
  },
  transitions: {
    // Конфигурация переходов между конкретными Layouts
    fromMainToTaskNews: {
      duration: 300,
      direction: "forward",
      type: "slide",
    },
    fromTaskNewsToMain: {
      duration: 300,
      direction: "backward",
      type: "slide",
    },
    fromMainToSettings: {
      duration: 400,
      direction: "forward",
      type: "fade",
    },
    // Добавляйте новые конфигурации
  },
} as const;
