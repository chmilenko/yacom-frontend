import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./AnimatedFooter.css";

interface AnimatedFooterProps {
  children: React.ReactNode;
  isVisible: boolean;
  type: "main" | "task";
  direction?: "left" | "right"; // Направление анимации
}

const AnimatedFooter = ({
  children,
  isVisible,
  type,
  direction = "right",
}: AnimatedFooterProps) => {
  const nodeRef = useRef(null);
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [animationClass, setAnimationClass] = useState("");

  // Определяем класс анимации в зависимости от направления
  useEffect(() => {
    if (direction === "left") {
      setAnimationClass(
        type === "main" ? "footer-slide-left" : "footer-slide-left-reverse",
      );
    } else {
      setAnimationClass(
        type === "main" ? "footer-slide-right" : "footer-slide-right-reverse",
      );
    }
  }, [direction, type]);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Ждем окончания анимации перед unmount
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <CSSTransition
      in={isVisible}
      nodeRef={nodeRef}
      timeout={300}
      classNames={animationClass}
      unmountOnExit
    >
      <div ref={nodeRef} className="footer-container">
        {children}
      </div>
    </CSSTransition>
  );
};

export default AnimatedFooter;
