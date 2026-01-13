import { create } from "zustand";

export interface IAction {
  objectId?: string | number;
  attachmentId?: string | number;
  actionName: string;
  active?: boolean;
  /** Дополнительные данные */
  [key: string]: any;
}

export interface IActionParam extends Partial<IAction> {
  objectId?: string | number;
  attachmentId?: string | number;
  actionName: string;
  active?: boolean;
}

interface ActionsStore {
  actions: IAction[];
  loadingAdditionalInfo: boolean;

  setActions: (param: IActionParam) => void;
  changeActionState: (
    actionName: string,
    id: string | number,
    newState: boolean
  ) => void;
  getActiveActionsCount: () => number;
  getActiveActions: () => string;
  setLoadingAdditionalInfo: (loading: boolean) => void;
  clearActions: () => void;
}

export const useActionsStore = create<ActionsStore>((set, get) => ({
  actions: [],
  loadingAdditionalInfo: false,

  setActions: (param: IActionParam) => {
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
          updated[existingIndex] = param as IAction;
          return { actions: updated };
        }

        return { actions: [...state.actions, param as IAction] };
      });
    } catch (err: any) {
      const errorDescription = `Не удалось добавить Action в setActions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("setActions error:", errorDescription);
    }
  },

  changeActionState: (
    actionName: string,
    id: string | number,
    newState: boolean
  ) => {
    try {
      set((state) => ({
        actions: state.actions.map((el) =>
          (el.objectId === id || el.attachmentId === id) &&
          el.actionName === actionName
            ? { ...el, active: newState }
            : el
        ),
      }));
    } catch (err: any) {
      const errorDescription = `Не удалось изменить статус Action в changeActionState\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("changeActionState error:", errorDescription);
    }
  },

  getActiveActionsCount: () => {
    try {
      const { actions } = get();
      return actions.filter((el) => el.active).length;
    } catch (err: any) {
      const errorDescription = `Не удалось получить количество активных Actions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("getActiveActionsCount error:", errorDescription);
      return 0;
    }
  },

  getActiveActions: () => {
    try {
      const { actions } = get();
      return JSON.stringify(actions.filter((el) => el.active));
    } catch (err: any) {
      const errorDescription = `Не удалось получить активные Actions\nОшибка ${err.name}: ${err.message}\n${err.stack}`;
      console.error("getActiveActions error:", errorDescription);
      return "[]";
    }
  },

  setLoadingAdditionalInfo: (loading: boolean) =>
    set({ loadingAdditionalInfo: loading }),

  clearActions: () => set({ actions: [] }),
}));
