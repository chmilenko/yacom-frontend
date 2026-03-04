/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Outlet, matchPath } from "react-router-dom";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  LayoutType,
  PATH_TO_LAYOUT_MAP,
  LayoutComponents,
} from "../LayoutRegistry";
import "./AppLayoutSwitcher.css";

const SmartLayoutSwitcher = () => {
  const location = useLocation();
  const [layouts, setLayouts] = useState<{
    current: LayoutType;
    previous: LayoutType | null;
    isNewLayoutReady: boolean;
  }>({
    current: "MAIN",
    previous: null,
    isNewLayoutReady: true,
  });

  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const isInitialRender = useRef(true);
  const previousPath = useRef<string>("");
  const currentLayoutRef = useRef<HTMLDivElement>(null);
  const prevLayoutRef = useRef<HTMLDivElement>(null);

  const getLayoutForPath = (pathname: string): LayoutType => {
    for (const [pattern, layout] of Object.entries(PATH_TO_LAYOUT_MAP)) {
      if (matchPath(pattern, pathname)) {
        return layout;
      }
    }
    return "MAIN";
  };

  // ⭐⭐ ВАЖНО: Функция определения направления ⭐⭐
  const getDirection = (
    prevLayout: LayoutType,
    newLayout: LayoutType,
  ): "forward" | "backward" => {

    // Правила для backward анимации (возврат)
    const backwardRules: [LayoutType, LayoutType][] = [
      ["TASK_NEWS", "MAIN"], // Из задач на главную = назад
    ];

    // Проверяем правила
    for (const [from, to] of backwardRules) {
      if (prevLayout === from && newLayout === to) {
        return "backward";
      }
    }

    // ВСЕ остальные случаи = forward (вперед)
    return "forward";
  };

  useLayoutEffect(() => {
    const newLayout = getLayoutForPath(location.pathname);

    if (newLayout !== layouts.current) {
      const prevLayout = getLayoutForPath(previousPath.current);

      // ⭐⭐ ИСПОЛЬЗУЕМ getDirection здесь! ⭐⭐
      const direction = getDirection(prevLayout, newLayout);
      setDirection(direction);

      if (isInitialRender.current) {
        setLayouts({
          current: newLayout,
          previous: null,
          isNewLayoutReady: true,
        });
        isInitialRender.current = false;
        previousPath.current = location.pathname;
        return;
      }

      // 1. Начинаем анимацию
      setIsAnimating(true);
      setLayouts({
        current: layouts.current,
        previous: layouts.current,
        isNewLayoutReady: false,
      });

      // 2. Через кадр устанавливаем новый layout
      requestAnimationFrame(() => {
        setLayouts({
          current: newLayout,
          previous: layouts.current,
          isNewLayoutReady: false,
        });

        // 3. Показываем и запускаем анимацию
        requestAnimationFrame(() => {
          setLayouts((prev) => ({
            ...prev,
            isNewLayoutReady: true,
          }));

          previousPath.current = location.pathname;

          // 4. Завершаем
          setTimeout(() => {
            setIsAnimating(false);
            setTimeout(() => {
              setLayouts((prev) => ({
                ...prev,
                previous: null,
              }));
            }, 100);
          }, 700);
        });
      });
    }
  }, [location.pathname]);

  const CurrentLayoutComponent = LayoutComponents[layouts.current];
  const PreviousLayoutComponent = layouts.previous
    ? LayoutComponents[layouts.previous]
    : null;

  return (
    <div
      className={`layout-switcher ${isAnimating ? "animating" : ""} direction-${direction}`}
    >
      {/* Предыдущий Layout */}
      {layouts.previous && PreviousLayoutComponent && (
        <div ref={prevLayoutRef} className="layout-container previous-layout">
          <PreviousLayoutComponent>
            <div style={{ opacity: 0, height: "100%", pointerEvents: "none" }}>
              <Outlet />
            </div>
          </PreviousLayoutComponent>
        </div>
      )}

      {/* Текущий Layout */}
      <div
        ref={currentLayoutRef}
        className={`layout-container current-layout ${layouts.isNewLayoutReady ? "ready" : "preparing"}`}
      >
        <CurrentLayoutComponent>
          <Outlet />
        </CurrentLayoutComponent>
      </div>
    </div>
  );
};

export default SmartLayoutSwitcher;
