/* eslint-disable jsx-a11y/img-redundant-alt */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";

import { Swipe } from "react-swipe-component";

import "./Swiper.scss";
import { AppStateContext } from "../../Core/Context/AppStateContext";

const Swiper = ({ children, header, closeSwiper }) => {
  const { openSwiper } = useContext(AppStateContext);

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
          initialY.current = currentY; // Обновляем начальную позицию
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
    [closeSwiper, handleDrag]
  );

  const handleTouchStart = useCallback(
    (event) => {
      isDragging.current = true;
      initialY.current = event.touches[0].clientY;

      const handleTouchMove = (event) => {
        if (isDragging.current) {
          const currentY = event.touches[0].clientY;
          const deltaY = currentY - initialY.current;
          handleDrag(deltaY);
          initialY.current = currentY; // Теперь тоже обновляем начальную позицию
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

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    },
    [closeSwiper, handleDrag]
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

  return (
    <>
      {openSwiper && (
        <div className="swipe-container" ref={swipeRef}>
          <Swipe className="swipe-container-content">
            <div
              className="swipe-container-content-header"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="swipe-container-remove"></div>
              {header}
            </div>
            {children}
          </Swipe>
        </div>
      )}
    </>
  );
};

export default Swiper;
