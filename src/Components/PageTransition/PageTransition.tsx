// Components/Transitions/PageTransition.tsx
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./PageTransition.scss";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef(location);

  // Сброс скролла при смене страницы
  useEffect(() => {
    if (prevLocationRef.current.key !== location.key) {
      // Сбрасываем скролл у ВХОДЯЩЕЙ страницы
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      prevLocationRef.current = location;
    }
  }, [location]);

  return (
    <TransitionGroup component="div" className="page-transition-container">
      <CSSTransition
        key={location.key}
        timeout={400}
        classNames="page"
        unmountOnExit
        onEnter={() => {
          // Дополнительно сбрасываем скролл при начале анимации
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
        }}
      >
        <div
          className="page-content"
          ref={contentRef}
          data-page={location.pathname}
        >
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
