/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Outlet, matchPath, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  LayoutType,
  PATH_TO_LAYOUT_MAP,
  LayoutComponents,
} from "../LayoutRegistry";
import "./AppLayoutSwitcher.css";

const SmartLayoutSwitcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState<{
    current: LayoutType;
    previous: LayoutType | null;
  }>({ current: "MAIN", previous: null });

  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const isInitialRender = useRef(true);
  const locationHistory = useRef<string[]>([]);
  const layoutHistory = useRef<LayoutType[]>([]);

  // Определяем Layout по пути
  const getLayoutForPath = (pathname: string): LayoutType => {
    for (const [pattern, layout] of Object.entries(PATH_TO_LAYOUT_MAP)) {
      if (matchPath(pattern, pathname)) {
        return layout;
      }
    }
    return "MAIN";
  };

  // Надежное определение направления
  const getDirection = (
    newPath: string,
    newLayout: LayoutType,
  ): "forward" | "backward" => {
    if (locationHistory.current.length === 0) return "forward";

    const lastPath =
      locationHistory.current[locationHistory.current.length - 1];
    const lastLayout = layoutHistory.current[layoutHistory.current.length - 1];

    // Если возвращаемся на предыдущий путь в истории - это backward
    const pathIndex = locationHistory.current.indexOf(newPath);
    if (pathIndex !== -1 && pathIndex < locationHistory.current.length - 1) {
      return "backward";
    }

    // Эвристика: если переходим от TASK_NEWS к MAIN - часто это backward
    if (lastLayout === "TASK_NEWS" && newLayout === "MAIN") {
      return "backward";
    }

    return "forward";
  };

  useEffect(() => {
    const newLayout = getLayoutForPath(location.pathname);

    if (newLayout !== layouts.current) {
      // Определяем направление
      const newDirection = getDirection(location.pathname, newLayout);
      setDirection(newDirection);

      setIsAnimating(true);

      // На первом рендере не анимируем
      if (isInitialRender.current) {
        setLayouts({ current: newLayout, previous: null });
        isInitialRender.current = false;

        // Сохраняем в историю
        locationHistory.current.push(location.pathname);
        layoutHistory.current.push(newLayout);
        return;
      }

      // Устанавливаем оба Layout'а одновременно
      setLayouts({
        current: newLayout,
        previous: layouts.current,
      });

      // Обновляем историю
      locationHistory.current.push(location.pathname);
      layoutHistory.current.push(newLayout);

      // Ограничиваем историю
      if (locationHistory.current.length > 10) {
        locationHistory.current.shift();
        layoutHistory.current.shift();
      }

      // Завершаем анимацию
      setTimeout(() => {
        setIsAnimating(false);
        // Очищаем предыдущий Layout после анимации
        setTimeout(() => {
          setLayouts((prev) => ({ ...prev, previous: null }));
        }, 100);
      }, 500);
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
      {/* Предыдущий Layout (уезжает) */}
      {layouts.previous && PreviousLayoutComponent && (
        <div className="layout-container previous-layout">
          <PreviousLayoutComponent>
            {/* Скрытый Outlet для предыдущего Layout */}
            <div style={{ opacity: 0, height: "100%", pointerEvents: "none" }}>
              <Outlet />
            </div>
          </PreviousLayoutComponent>
        </div>
      )}

      {/* Текущий Layout (приезжает) */}
      <div className="layout-container current-layout">
        <CurrentLayoutComponent>
          <Outlet />
        </CurrentLayoutComponent>
      </div>
    </div>
  );
};

export default SmartLayoutSwitcher;
