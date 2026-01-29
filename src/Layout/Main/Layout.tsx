import { useEffect, useLayoutEffect, useRef } from "react";
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
  const { page } = useAppStore();
  const { useMockData } = useAppModeStore();
  const { setActions } = useActionsStore();
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    console.log("🔄 Сбрасываем скролл .content элемента");
    alert(location.pathname);
    alert(contentRef);

    if (contentRef.current) {
      // Скроллим именно content элемент
      contentRef.current.scrollTop = 0;
      contentRef.current.scrollTo({ top: 0, behavior: "instant" });
      alert(`Скролл сбросился: ${contentRef.current.scrollTop}`);
    }

    // Также скроллим window на всякий случай
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
  alert("работаешь ваще не");
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
      <footer className="footer ">
        <MenuBar />
      </footer>
    </div>
  );
}

export default Layout;
