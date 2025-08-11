import React, { useEffect, useState } from "react";
import "./ScrollToTop.scss";

const ScrollToTop = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    scrollContainerRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        title="Вернуться наверх"
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTop;
