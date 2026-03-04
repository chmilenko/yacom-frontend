import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const usePageScroll = (scrollContainerRef: React.RefObject<HTMLElement>) => {
  const location = useLocation();
  const scrollMemory = useRef<
    Record<string, { absolute: number; relative?: number }>
  >({});
  const contentHeights = useRef<Record<string, number>>({});
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const path = location.pathname;
    const container = scrollContainerRef.current;

    if (!container) return;

    // Сохраняем текущую высоту контента перед уходом
    if (!isFirstLoad.current) {
      contentHeights.current[path] = container.scrollHeight;
    }

    // Восстанавливаем позицию
    if (!isFirstLoad.current) {
      const saved = scrollMemory.current[path];

      if (saved) {
        const currentHeight = container.scrollHeight;
        const savedHeight = contentHeights.current[path] || currentHeight;

        let scrollTo = saved.absolute;

        // Если высота контента изменилась, корректируем позицию
        if (savedHeight !== currentHeight && savedHeight > 0) {
          const ratio = saved.absolute / savedHeight;
          scrollTo = Math.round(currentHeight * ratio);
        }
        container.scrollTop = scrollTo;
      } else {
        container.scrollTop = 0;
      }
    } else {
      isFirstLoad.current = false;
    }

    // Слушаем скролл
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;

      scrollMemory.current[path] = {
        absolute: scrollTop,
        relative: scrollHeight > 0 ? scrollTop / scrollHeight : 0,
      };

      console.log("💾 Saved:", {
        absolute: scrollTop,
        relative: scrollTop / scrollHeight,
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);

      // Финальное сохранение
      const finalScroll = container.scrollTop;
      const finalHeight = container.scrollHeight;

      scrollMemory.current[path] = {
        absolute: finalScroll,
        relative: finalHeight > 0 ? finalScroll / finalHeight : 0,
      };

      contentHeights.current[path] = finalHeight;

      console.log(
        "🎬 Final save for",
        path,
        ":",
        finalScroll,
        "height:",
        finalHeight,
      );
    };
  }, [location.pathname]);

  return {};
};

export default usePageScroll;
