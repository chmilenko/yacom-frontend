import { useRef } from "react";
import { Outlet } from "react-router-dom";
import "./CreateTaskLayout.scss";

import ScrollToTop from "../../Components/ScrollToTop/ScrollToTop";
import LayoutButtons from "./LayoutButton";
import ContentTransition from "../../Components/PageTransition/PageTransition";

function TaskNewsLayout() {
  const contentRef = useRef(null);

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
