/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Outlet, matchPath } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import {
  LayoutType,
  PATH_TO_LAYOUT_MAP,
  LayoutComponents,
} from "../LayoutRegistry";
import "./AppLayoutSwitcher.css";

const SmartLayoutSwitcher = () => {
  const location = useLocation();
  const [displayLayout, setDisplayLayout] = useState<LayoutType>("MAIN");
  const [transitionStage, setTransitionStage] = useState<
    "idle" | "exiting" | "entering"
  >("idle");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  // Определяем Layout по пути
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

    if (newLayout !== displayLayout) {
      // Определяем направление (упрощенно, можно доработать)
      const currentIndex = Object.keys(LayoutComponents).indexOf(displayLayout);
      const newIndex = Object.keys(LayoutComponents).indexOf(newLayout);
      setDirection(newIndex > currentIndex ? "forward" : "backward");

      // Начинаем анимацию выхода
      setTransitionStage("exiting");

      // После анимации выхода меняем layout и запускаем анимацию входа
      setTimeout(() => {
        setDisplayLayout(newLayout);
        setTransitionStage("entering");

        // Завершаем анимацию
        setTimeout(() => {
          setTransitionStage("idle");
        }, 500);
      }, 300);
    }
  }, [location.pathname]);

  const LayoutComponent = LayoutComponents[displayLayout];

  return (
    <div
      className={`layout-switcher ${transitionStage} direction-${direction}`}
    >
      <div className={`layout-container layout-${displayLayout.toLowerCase()}`}>
        <Suspense fallback={<div>Загрузка...</div>}>
          <LayoutComponent>
            <Outlet />
          </LayoutComponent>
        </Suspense>
      </div>
    </div>
  );
};

export default SmartLayoutSwitcher;
