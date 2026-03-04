/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom"; // Добавить импорт

import "./Swiper.scss";
import { useAppStore } from "../../Core/Store/AppStore";

const Swiper = ({ children, header, closeSwiper }) => {
  const { openSwiper } = useAppStore();

  const [position, setPosition] = useState(0);
  const swipeRef = useRef(null);
  const isDragging = useRef(false);
  const initialY = useRef(0);

  const handleDrag = useCallback((deltaY) => {
    setPosition((prevPosition) => {
      const newPosition = prevPosition + deltaY;
      return Math.max(newPosition, 0);
    });
  }, []);

  const handleMouseDown = useCallback(
    (event) => {
      isDragging.current = true;
      initialY.current = event.clientY;

      const handleMouseMove = (event) => {
        if (isDragging.current) {
          const currentY = event.clientY;
          const deltaY = currentY - initialY.current;
          handleDrag(deltaY);
          initialY.current = currentY;
        }
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        setPosition((prevPosition) => {
          if (prevPosition < window.innerHeight / 7) {
            return 0;
          } else {
            closeSwiper();
            return prevPosition;
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [closeSwiper, handleDrag],
  );

  const handleTouchStart = useCallback(
    (event) => {
      isDragging.current = true;
      initialY.current = event.touches[0].clientY;

      const handleTouchMove = (event) => {
        if (isDragging.current) {
          event.preventDefault();
          event.stopPropagation();

          const currentY = event.touches[0].clientY;
          const deltaY = currentY - initialY.current;
          handleDrag(deltaY);
          initialY.current = currentY;
        }
      };

      const handleTouchEnd = () => {
        isDragging.current = false;
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);

        setPosition((prevPosition) => {
          if (prevPosition < window.innerHeight / 10) {
            return 0;
          } else {
            closeSwiper();
            return prevPosition;
          }
        });
      };

      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    },
    [closeSwiper, handleDrag],
  );

  useEffect(() => {
    const swipeElement = swipeRef.current;
    if (swipeElement) {
      const targetHeight = window.innerHeight - (position + 100);
      swipeElement.style.setProperty("--target-height", `${targetHeight}px`);
      swipeElement.style.height = `${targetHeight}px`;

      if (openSwiper) {
        swipeElement.style.animation = "slideUp 0.3s ease-out";
      }
    }
  }, [position, openSwiper]);

  // Если свайпер не открыт - ничего не рендерим
  if (!openSwiper) return null;

  // Рендерим через портал в body
  return createPortal(
    <div className="swipe-container" ref={swipeRef}>
      <div className="swipe-container-content" style={{ touchAction: "auto" }}>
        <div
          className="swipe-container-content-header"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="swipe-container-remove"></div>
          {header}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Swiper;
