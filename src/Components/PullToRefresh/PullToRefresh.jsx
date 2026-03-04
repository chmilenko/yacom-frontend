import { useEffect, useState, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import PullToRefresh from "pulltorefreshjs";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../../Core/Store/AppStore";
import "./pullToRefresh.scss";

function PullToRefreshComponent({ children, refreshFunk, contentRef }) {
  const { openSwiper } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const ptrInstance = useRef(null);

  useEffect(() => {
    const handlePullToRefresh = () => {
      setIsRefreshing(true);

      // Оборачиваем refreshFunk в Promise
      const refreshPromise = Promise.resolve(refreshFunk());

      refreshPromise.finally(() => {
        // Даем время на анимацию
        setTimeout(() => {
          setIsRefreshing(false);

          // Принудительно сбрасываем состояние PTR
          if (ptrInstance.current) {
            ptrInstance.current._state = "pending";
          }
        }, 500);
      });
    };

    if (contentRef.current) {
      // Уничтожаем предыдущий инстанс если есть
      if (ptrInstance.current) {
        PullToRefresh.destroyAll();
      }

      ptrInstance.current = PullToRefresh.init({
        mainElement: contentRef.current,
        shouldPullToRefresh: function () {
          return !openSwiper && !this.mainElement.scrollTop && !isRefreshing; // Не запускаем если уже рефрешится
        },
        onRefresh: handlePullToRefresh,
        iconArrow: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} />,
        ),
        iconRefreshing: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} spin={true} />,
        ),
        refreshTimeout: 1000, // Таймаут для автоматического сброса
        instructionsPullToRefresh: "⬇️ Потяните для обновления",
        instructionsReleaseToRefresh: "🔄 Отпустите для обновления",
        instructionsRefreshing: "⏳ Обновление...",
      });
    }

    return () => {
      PullToRefresh.destroyAll();
      ptrInstance.current = null;
    };
  }, [refreshFunk, contentRef, openSwiper, isRefreshing]);

  return (
    <div className="pullToRefresh" ref={contentRef}>
      {children}
    </div>
  );
}

export default PullToRefreshComponent;
