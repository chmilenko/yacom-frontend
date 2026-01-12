import { create } from "zustand";

export interface IAction {
  id?: string | number;
  objectId?: string | number;
  ImageID?: string | number;
  fileType?: string;
  listImageID?: string[];
  currentItem?: string;
  attachmentId?: string | number;
  actionName: string;
  active: boolean;
  type?: string;
  priority?: number;
  metadata?: Record<string, any>;
  objectType?: string;
  subSection?: string;
  taskCurrentAction?: string;
  ClientID?: string;
  IsChecked?: boolean;
  printAvailable?: boolean;
  currentForm?: string;
  createdAt?: Date;
}

export interface IActionParam extends Partial<IAction> {
  actionName: string;
  objectId?: string | number;
  attachmentId?: string | number;
}

interface ActionsStore {
  actions: IAction[];
  loadingAdditionalInfo: boolean;
  error: string | null;

  setActions: (param: IActionParam) => void;
  addAction: (param: IActionParam) => void;
  updateAction: (param: IActionParam) => void;
  removeAction: (actionName: string, id: string | number) => void;
  changeActionState: (
    actionName: string,
    id: string | number,
    newState: boolean
  ) => void;
  toggleActionState: (actionName: string, id: string | number) => void;
  getActiveActionsCount: () => number;
  getActiveActions: () => IAction[];
  getActiveActionsJSON: () => string;
  getAction: (actionName: string, id: string | number) => IAction | undefined;
  hasActiveAction: (actionName: string, id: string | number) => boolean;
  setLoadingAdditionalInfo: (loading: boolean) => void;
  clearActions: () => void;
  setError: (error: string | null) => void;
}

export const useActionsStore = create<ActionsStore>((set, get) => ({
  actions: [],
  loadingAdditionalInfo: false,
  error: null,

  // Основной метод добавления/обновления
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

        const actionWithDefaults: IAction = {
          ...param,
          active: param.active ?? false,
          createdAt: param.createdAt ?? new Date(),
        };

        if (existingIndex > -1) {
          const updated = [...state.actions];
          updated[existingIndex] = actionWithDefaults;
          return { actions: updated, error: null };
        }

        return { actions: [...state.actions, actionWithDefaults], error: null };
      });
    } catch (err: any) {
      const errorDescription = `Не удалось добавить Action в setActions\nОшибка ${err.name}: ${err.message}`;
      console.error("setActions error:", errorDescription);
      set({ error: errorDescription });
    }
  },

  // Добавить новое действие
  addAction: (param: IActionParam) => {
    get().setActions(param);
  },

  // Обновить существующее действие
  updateAction: (param: IActionParam) => {
    get().setActions(param);
  },

  // Удалить действие
  removeAction: (actionName: string, id: string | number) => {
    try {
      set((state) => ({
        actions: state.actions.filter(
          (el) =>
            !(
              el.actionName === actionName &&
              (el.objectId === id || el.attachmentId === id)
            )
        ),
        error: null,
      }));
    } catch (err: any) {
      const errorDescription = `Не удалось удалить Action\nОшибка ${err.name}: ${err.message}`;
      console.error("removeAction error:", errorDescription);
      set({ error: errorDescription });
    }
  },

  // Изменить состояние действия
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
        error: null,
      }));
    } catch (err: any) {
      const errorDescription = `Не удалось изменить статус Action в changeActionState\nОшибка ${err.name}: ${err.message}`;
      console.error("changeActionState error:", errorDescription);
      set({ error: errorDescription });
    }
  },

  // Переключить состояние действия
  toggleActionState: (actionName: string, id: string | number) => {
    const { actions } = get();
    const action = actions.find(
      (el) =>
        (el.objectId === id || el.attachmentId === id) &&
        el.actionName === actionName
    );

    if (action) {
      get().changeActionState(actionName, id, !action.active);
    }
  },

  // Получить количество активных действий
  getActiveActionsCount: () => {
    try {
      const { actions } = get();
      return actions.filter((el) => el.active).length;
    } catch (err: any) {
      const errorDescription = `Не удалось получить количество активных Actions\nОшибка ${err.name}: ${err.message}`;
      console.error("getActiveActionsCount error:", errorDescription);
      set({ error: errorDescription });
      return 0;
    }
  },

  // Получить активные действия как массив объектов
  getActiveActions: () => {
    try {
      const { actions } = get();
      return actions.filter((el) => el.active);
    } catch (err: any) {
      const errorDescription = `Не удалось получить активные Actions\nОшибка ${err.name}: ${err.message}`;
      console.error("getActiveActions error:", errorDescription);
      set({ error: errorDescription });
      return [];
    }
  },

  // Получить активные действия как JSON строку
  getActiveActionsJSON: () => {
    try {
      const activeActions = get().getActiveActions();
      return JSON.stringify(activeActions);
    } catch (err: any) {
      const errorDescription = `Не удалось получить активные Actions как JSON\nОшибка ${err.name}: ${err.message}`;
      console.error("getActiveActionsJSON error:", errorDescription);
      set({ error: errorDescription });
      return "[]";
    }
  },

  // Найти конкретное действие
  getAction: (actionName: string, id: string | number) => {
    const { actions } = get();
    return actions.find(
      (el) =>
        (el.objectId === id || el.attachmentId === id) &&
        el.actionName === actionName
    );
  },

  // Проверить, есть ли активное действие
  hasActiveAction: (actionName: string, id: string | number) => {
    const action = get().getAction(actionName, id);
    return action?.active || false;
  },

  setLoadingAdditionalInfo: (loading: boolean) =>
    set({ loadingAdditionalInfo: loading, error: null }),

  clearActions: () => set({ actions: [], error: null }),

  setError: (error: string | null) => set({ error }),
}));
