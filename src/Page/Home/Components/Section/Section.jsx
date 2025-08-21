/* eslint-disable eqeqeq */
import React, { useContext, useState } from "react";
import "./Section.scss";
import Checkbox from "../../../../Ui/Checkbox/Checkbox";
import { AppStateContext } from "../../../../Core/Context/AppStateContext";

function Section({ section, onOpenSwiper, openSectionForm, type }) {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { openSwiper, countActualTasks, countUnreadNews } =
    useContext(AppStateContext);

  const handleHeaderClick = () => {
    setIsActive(!isActive);
    openSectionForm(type);
    setTimeout(() => setIsActive(false), 200);
  };

  const toggleExpand = () => {
    if (!openSwiper) setIsExpanded((prev) => !prev);
  };

  const count = type === "Tasks" ? countActualTasks : countUnreadNews;
  const items = type === "Tasks" ? section.TaskList : section.NewsList;
  const showExpandButton = type === "News";

  const handleTouchStart = () => {
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
    openSectionForm(type);
  };

  return (
    <div className={`section_container ${openSwiper && "light_border"}`}>
      <div className="section_header">
        <div
          className={`section_header_left ${isActive ? "active" : ""}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={openSectionForm.bind(null, type)}
        >
          <h3 className="section_header_title">{section.SectionName}</h3>

          {count > 0 && (
            <div
              className={`section_header_count ${
                type === "Tasks" ? "actual-tasks" : "actual-news"
              } ${openSwiper && "dark_count"}`}
            >
              {count}
            </div>
          )}

          <div className="section_header_update">{section.SectionUpdate}</div>
        </div>

        {showExpandButton && (
          <span
            className={`material-symbols-outlined ${
              isExpanded ? "active-arrow" : ""
            }`}
            onClick={toggleExpand}
          >
            keyboard_arrow_down
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="section_content">
          {items?.length > 0 ? (
            items.map((item) => (
              <div
                key={item.TaskID || item.ObjectID}
                className={`section_item ${
                  type === "Tasks" ? "task-item" : "news-item"
                }`}
                onClick={() => onOpenSwiper(item, section.SectionName)}
              >
                {type === "Tasks" ? (
                  <>
                    <div className="section_item_checker">
                      {(item.ResultType == "3" ||
                        item.ResultType == "4" ||
                        item.ResultType == "5") &&
                      !item.Done ? (
                        <span className="material-symbols-outlined">
                          add_photo_alternate
                        </span>
                      ) : (
                        <Checkbox
                          checked={item.Done}
                          readonly={true}
                          className={openSwiper && "dark"}
                        />
                      )}
                    </div>
                    <div
                      className={`section_item_header ${
                        item.Done &&
                        item.ResultType != "8" &&
                        item.ObjectType !== "News"
                          ? "_done"
                          : ""
                      }`}
                    >
                      {item.Header}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="section_item_info">
                      {item.New && <div className="indicator"></div>}
                      <div
                        className={`section_item_date ${
                          item.New && "bold_date"
                        }`}
                      >
                        {item.Date}
                      </div>
                    </div>
                    <div
                      className={`section_item_header ${
                        item.New ? "bold" : ""
                      }`}
                    >
                      {item.Title || item.Header}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="section_empty">No items</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Section;
