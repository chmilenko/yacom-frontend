import { useRef } from "react";
import { Outlet } from "react-router-dom";

import "./Layout.scss";

import MenuBar from "../Components/MenuBar/MenuBar";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import PullToRefreshComponent from "../Components/PullToRefresh/PullToRefresh";
import clickTo1C from "../Utils/clicker";
import { useAppStore } from "../Core/Store/AppStateStore";
import { useActionsStore } from "../Core/Store/ActionsStore";

function Layout() {
  const contentRef = useRef(null);
  const { setAppState, page, setInstructionsState, developer } = useAppStore();

  const { setActions } = useActionsStore();

  const funcRefresh = (currentPage) => {
    switch (currentPage) {
      case "":
        setActions({
          actionName: "pullToRefresh",
          active: true,
        });
        !developer && clickTo1C();
        return setAppState();
      case "instructions":
        setActions({
          actionName: "pullToRefresh",
          active: true,
        });
        !developer && clickTo1C();
        return setInstructionsState();
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
          <Outlet />
        </PullToRefreshComponent>
      </main>
      <footer className="footer ">
        <MenuBar />
      </footer>
    </div>
  );
}

export default Layout;
