import { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import PullToRefresh from "pulltorefreshjs";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppStore } from "../../Core/Store/AppStore";

function PullToRefreshComponent({ children, refreshFunk, contentRef }) {
  const { openSwiper } = useAppStore();

  useEffect(() => {
    const handlePullToRefresh = () => {
      refreshFunk();
    };

    if (contentRef.current) {
      PullToRefresh.init({
        mainElement: contentRef.current,
        shouldPullToRefresh: function () {
          if (openSwiper) return false;

          const element = this.mainElement;
          // Проверяем, есть ли скролл вообще
          const hasScroll = element.scrollHeight > element.clientHeight;

          // Если скролла нет - разрешаем PTR
          if (!hasScroll) return true;

          // Если скролл есть - только когда в самом верху
          return element.scrollTop <= 0;
        },
        onRefresh: handlePullToRefresh,
        iconArrow: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} />,
        ),
        iconRefreshing: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} spin={true} />,
        ),
      });
    }

    return () => {
      PullToRefresh.destroyAll();
    };
  }, [refreshFunk, contentRef, openSwiper]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={contentRef}
    >
      {children}
    </div>
  );
}

export default PullToRefreshComponent;
