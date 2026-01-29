import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import "./Layout.scss";

import { useAppStore } from "../../Core/Store/AppStore";
import { useActionsStore } from "../../Core/Store/ActionsStore";
import MenuBar from "../../Components/MenuBar/MenuBar";
import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import PullToRefreshComponent from "../../Components/PullToRefresh/PullToRefresh";
import clickTo1C from "../../Utils/clicker";
import { useAppModeStore } from "../../Core/Store/AppModeStore";
import ContentTransition from "../../Components/PageTransition/PageTransition";
// import usePageScroll from "../../Hooks/usePageScroll";

function Layout() {
  const location = useLocation();
  const contentRef = useRef(null);
  const [showFooter, setShowFooter] = useState(true);

  const { page } = useAppStore();
  const { useMockData } = useAppModeStore();
  const { setActions } = useActionsStore();

  useEffect(() => {
    const isGoingToTaskNews =
      location.pathname.startsWith("/task") ||
      location.pathname.startsWith("/news");

    if (isGoingToTaskNews) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const funcRefresh = (currentPage) => {
    switch (currentPage) {
      case "":
        setActions({
          actionName: "pullToRefresh",
          page: "main",
          active: true,
        });
        !useMockData && clickTo1C();
        return;
      case "instructions":
        setActions({
          actionName: "pullToRefresh",
          page: "instructions",
          active: true,
        });
        !useMockData && clickTo1C();
        return;
      default:
        console.log("No refresh function implemented for this page");
        return "empty";
    }
  };

  return (
    <div className="layout">
      <ScrollToTop scrollContainerRef={contentRef} />
      <main className="content" ref={contentRef}>
        <PullToRefreshComponent
          contentRef={contentRef}
          refreshFunk={() => funcRefresh(page)}
        >
          <ContentTransition>
            <Outlet />
          </ContentTransition>
        </PullToRefreshComponent>
      </main>
      {showFooter && (
        <footer className="footer">
          <MenuBar />
        </footer>
      )}
    </div>
  );
}

export default Layout;
