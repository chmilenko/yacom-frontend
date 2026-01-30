/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Outlet, matchPath } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  }>({ current: "MAIN", previous: null });

  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isAnimating, setIsAnimating] = useState(false);
  const isInitialRender = useRef(true);
  const previousPath = useRef<string>("");

  const getLayoutForPath = (pathname: string): LayoutType => {
    for (const [pattern, layout] of Object.entries(PATH_TO_LAYOUT_MAP)) {
      if (matchPath(pattern, pathname)) {
        return layout;
      }
    }
    return "MAIN";
  };

  useEffect(() => {
    const newLayout = getLayoutForPath(location.pathname);

    if (newLayout !== layouts.current) {
      // ПРОСТОЕ ПРАВИЛО:
      // Если предыдущий путь был из TASK_NEWS лейаута, а новый из MAIN - это backward
      const prevLayout = getLayoutForPath(previousPath.current);
      const isBackward = prevLayout === "TASK_NEWS" && newLayout === "MAIN";

      setDirection(isBackward ? "backward" : "forward");

      console.log(`Направление: ${isBackward ? "backward" : "forward"}`, {
        prevPath: previousPath.current,
        prevLayout,
        newPath: location.pathname,
        newLayout,
      });

      setIsAnimating(true);

      if (isInitialRender.current) {
        setLayouts({ current: newLayout, previous: null });
        isInitialRender.current = false;
        previousPath.current = location.pathname;
        return;
      }

      setLayouts({
        current: newLayout,
        previous: layouts.current,
      });

      // Сохраняем текущий путь как предыдущий для следующего перехода
      previousPath.current = location.pathname;

      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setLayouts((prev) => ({ ...prev, previous: null }));
        }, 100);
      }, 700);
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
