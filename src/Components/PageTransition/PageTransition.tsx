import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./PageTransition.scss";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  // Сброс скролла при смене страницы
  useEffect(() => {
    // Эта логика теперь в Layout
  }, [location.key]);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="ios-page"
        unmountOnExit
      >
        <div className="ios-page-content">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
