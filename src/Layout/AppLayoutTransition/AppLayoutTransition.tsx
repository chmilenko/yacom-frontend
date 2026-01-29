import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./AppLayoutTransition.scss";

const AppLayoutTransition = () => {
  const location = useLocation();
  const prevLocation = useRef(location);

  // Определяем тип перехода
  const getTransitionClass = () => {
    const fromLayout =
      prevLocation.current.pathname.startsWith("/task") ||
      prevLocation.current.pathname.startsWith("/news");
    const toLayout =
      location.pathname.startsWith("/task") ||
      location.pathname.startsWith("/news");

    if (fromLayout && !toLayout) return "layout-exit";
    if (!fromLayout && toLayout) return "layout-enter";
    return "page-change"; // Внутри одного Layout
  };

  useEffect(() => {
    prevLocation.current = location;
  }, [location]);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={350}
        classNames={getTransitionClass()}
        unmountOnExit
      >
        <div className="app-layout-container">
          <Outlet />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AppLayoutTransition;
