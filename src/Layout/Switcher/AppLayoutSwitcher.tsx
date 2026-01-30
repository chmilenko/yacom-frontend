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
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("MAIN");
  const [isAnimating, setIsAnimating] = useState(false);

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

    if (newLayout !== currentLayout) {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentLayout(newLayout);

        setTimeout(() => {
          setIsAnimating(false);
        }, 150);
      }, 150);
    }
  }, [location.pathname]);

  const LayoutComponent = LayoutComponents[currentLayout];

  return (
    <div className={`layout-switcher ${isAnimating ? "animating" : ""}`}>
      <div className={`layout-container ${currentLayout.toLowerCase()}`}>
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
