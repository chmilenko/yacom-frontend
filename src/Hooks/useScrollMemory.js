// hooks/useScrollMemory.js
import { create } from 'zustand';

export const useScrollMemoryStore = create((set, get) => ({
  // Храним позиции для каждого pathname
  scrollPositions: {},
  
  // Храним высоту контента для каждого pathname
  contentHeights: {},
  
  savePosition: (pathname, position, height) => {
    set((state) => ({
      scrollPositions: {
        ...state.scrollPositions,
        [pathname]: position
      },
      contentHeights: {
        ...state.contentHeights,
        [pathname]: height
      }
    }));
  },
  
  getPosition: (pathname) => {
    const state = get();
    return {
      position: state.scrollPositions[pathname] || 0,
      height: state.contentHeights[pathname] || 0
    };
  },
  
  clearPosition: (pathname) => {
    set((state) => {
      const newPositions = { ...state.scrollPositions };
      const newHeights = { ...state.contentHeights };
      delete newPositions[pathname];
      delete newHeights[pathname];
      return {
        scrollPositions: newPositions,
        contentHeights: newHeights
      };
    });
  }
}));