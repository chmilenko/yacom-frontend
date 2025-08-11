import React, { useContext, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import PullToRefresh from "pulltorefreshjs";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppStateContext } from "../../Core/Context/AppStateContext";

function PullToRefreshComponent({ children, refreshFunk, contentRef }) {
  const { openSwiper } = useContext(AppStateContext);

  useEffect(() => {
    const handlePullToRefresh = () => {
      refreshFunk();
    };

    if (contentRef.current) {
      PullToRefresh.init({
        mainElement: contentRef.current,
        shouldPullToRefresh: function () {
          return !openSwiper && !this.mainElement.scrollTop;
        },
        onRefresh: handlePullToRefresh,
        iconArrow: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} />
        ),
        iconRefreshing: ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faSyncAlt} spin={true} />
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
