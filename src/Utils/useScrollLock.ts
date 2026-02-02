// hooks/useScrollLock.ts
import { useRef } from "react";

export const useScrollLock = () => {
  const scrollPosition = useRef(0);
  const locked = useRef(false);

  const lockScroll = () => {
    if (locked.current) return;

    // Сохраняем текущую позицию скролла
    scrollPosition.current = window.scrollY;

    // Блокируем скролл - TypeScript безопасные свойства
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    // Для iOS добавляем класс
    document.body.classList.add("ios-scroll-lock");

    locked.current = true;
  };

  const unlockScroll = () => {
    if (!locked.current) return;

    // Разблокируем скролл
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.touchAction = "";
    document.body.classList.remove("ios-scroll-lock");

    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollPosition.current);

    locked.current = false;
  };

  return { lockScroll, unlockScroll, isLocked: locked.current };
};
