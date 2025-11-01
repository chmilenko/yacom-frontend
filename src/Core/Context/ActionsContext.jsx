// store/useActionsStore.js
import { create } from "zustand";

export const useActionsStore = create((set, get) => ({
  // State
  actions: [],
  loadingAdditionalInfo: false,

  // Actions
  setActions: (param) => {
    try {
      set((state) => {
        const existingIndex = state.actions.findIndex(
          (el) =>
            (el.objectId === param.objectId &&
              el.actionName === param.actionName) ||
            (el.attachmentId === param.attachmentId &&
              el.actionName === param.actionName)
        );

        if (existingIndex > -1) {
          const updated = [...state.actions];
          updated[existingIndex] = param;
          return { actions: updated };
        }

        return { actions: [...state.actions, param] };
      });
    } catch (err) {
      const errorDescription = `Не удалось добавить Action в setActions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("setActions error:", errorDescription);
    }
  },

  changeActionState: (action, id, newState) => {
    try {
      set((state) => ({
        actions: state.actions.map((el) =>
          el.objectId === id && el.actionName === action
            ? { ...el, active: newState }
            : el
        ),
      }));
    } catch (err) {
      const errorDescription = `Не удалось изменить статус Action в changeActionState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("changeActionState error:", errorDescription);
    }
  },

  getActiveActionsCount: () => {
    try {
      const { actions } = get();
      return actions.filter((el) => el.active).length;
    } catch (err) {
      const errorDescription = `Не удалось получить количество активных Actions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("getActiveActionsCount error:", errorDescription);
      return 0;
    }
  },

  getActiveActions: () => {
    try {
      const { actions } = get();
      return JSON.stringify(actions.filter((el) => el.active));
    } catch (err) {
      const errorDescription = `Не удалось получить активные Actions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("getActiveActions error:", errorDescription);
      return "[]";
    }
  },

  setLoadingAdditionalInfo: (loading) =>
    set({ loadingAdditionalInfo: loading }),

  clearActions: () => set({ actions: [] }),
}));
