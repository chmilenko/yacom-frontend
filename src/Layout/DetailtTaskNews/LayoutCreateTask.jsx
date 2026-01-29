import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./CreateTaskLayout.scss";

import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import LayoutButtons from "./LayoutButton";
import ContentTransition from "../../Components/PageTransition/PageTransition";
// import usePageScroll from "../../Hooks/usePageScroll";

function TaskNewsLayout() {
  const contentRef = useRef(null);
  // usePageScroll(contentRef);
  const location = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      contentRef.current.scrollTo({ top: 0, behavior: "instant" });
    }

    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="create_task_layout">
      <ScrollToTop scrollContainerRef={contentRef} />

      <main className="create_task_content" ref={contentRef}>
        <ContentTransition>
          <Outlet />
        </ContentTransition>
      </main>

      <footer className="create_task_footer">
        <div className="create_task_buttons">
          <LayoutButtons />
        </div>
      </footer>
    </div>
  );
}

export default TaskNewsLayout;
