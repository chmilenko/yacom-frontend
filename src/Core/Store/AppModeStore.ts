// Core/Store/AppModeStore.ts
import { create } from "zustand";

interface AppModeStore {
  // Режим использования моков (старый developer из env)
  useMockData: boolean;

  // Режим отладки в 1С (управляется из 1С)
  isDebugMode: boolean;

  // Методы
  setUseMockData: (useMock: boolean) => void;
  setDebugMode: (isDebug: boolean) => void;
}

export const useAppModeStore = create<AppModeStore>((set) => ({
  useMockData: process.env.REACT_APP_DEVELOPER === "true",
  isDebugMode: true,

  setUseMockData: (useMock) => set({ useMockData: useMock }),
  setDebugMode: (isDebug) => set({ isDebugMode: isDebug }),
}));
