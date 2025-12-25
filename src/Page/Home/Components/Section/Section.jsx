/* eslint-disable eqeqeq */
import { useState } from "react";
import "./Section.scss";
import Checkbox from "../../../../Ui/Checkbox/Checkbox";
import { useAppStore } from "../../../../Core/Store/AppStateStore";

function Section({ section, onOpenSwiper, openSectionForm, type }) {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { openSwiper, countActualTasks, countUnreadNews } = useAppStore();

  const toggleExpand = () => {
    if (!openSwiper) setIsExpanded((prev) => !prev);
  };

  const items = section.sectionData?.list || [];

  const showSectionCount = type === "Сигналы";
  const count = type === "Задачи" ? countActualTasks : countUnreadNews;
  const displayCount = showSectionCount ? section.Count : count;

  const showExpandButton = type === "Новости";

  const isProblemBlock = section.SectionKey === "Send_error_details";
  const isSendingBlock = section.SectionKey === "Data_sending_status";
  const isSpecialBlock = isProblemBlock || isSendingBlock;

  const handleTouchStart = (e) => {
    e.stopPropagation();
    setIsActive(true);
  };

  const handleHeaderClick = (type, e) => {
    e.stopPropagation();
    setIsActive(!isActive);
    openSectionForm(type);
    setTimeout(() => setIsActive(false), 200);
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    setIsActive(false);
    if (!isSpecialBlock) {
      openSectionForm(type);
    }
  };

  if (section.View) {
    return (
      <div
        className={`section_container ${openSwiper ? "light_border" : ""} ${
          isProblemBlock
            ? "problem-block"
            : isSendingBlock
            ? "sending-block"
            : ""
        }`}
      >
        <div className="section_header">
          <div
            className={`section_header_left ${isActive ? "active_block" : ""} ${
              isSpecialBlock ? "special-block" : ""
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => handleHeaderClick(section.SectionName, e)}
          >
            {isSpecialBlock ? (
              <div className="special-block-content">
                <div>
                  <div
                    className={`section_header_title ${
                      isActive ? "active_block" : ""
                    }`}
                    onClick={(e) => handleHeaderClick(section.SectionName, e)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {section.SectionName}
                  </div>
                  {section.SectionSubtitle && (
                    <div className="section_subtitle">
                      {section.SectionSubtitle}
                    </div>
                  )}
                </div>
                <span
                  className={`material-symbols-outlined  ${
                    section.SectionKey === "Send_error_details" ? "red" : "blue"
                  }`}
                >
                  exclamation
                </span>
              </div>
            ) : (
              <>
                <div className="section_header_title">
                  {section.SectionName}
                </div>
                {displayCount > 0 &&
                  (type === "Задачи" ||
                    type === "Новости" ||
                    type === "Сигналы") && (
                    <div
                      className={`section_header_count ${
                        type === "Задачи" ? "actual-tasks" : "actual-news"
                      } ${openSwiper && "dark_count"}`}
                    >
                      {displayCount}
                    </div>
                  )}
              </>
            )}

            {!isSpecialBlock && (
              <div className="section_header_update">
                {section.SectionUpdate}
              </div>
            )}
          </div>

          {showExpandButton && !isSpecialBlock && (
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

        {isExpanded && !isSpecialBlock && !showSectionCount && (
          <div className="section_content">
            {items.length > 0
              ? items.map((item) => (
                  <div
                    key={item.TaskID || item.ObjectID}
                    className={`section_item ${
                      type === "Задачи" ? "task-item" : "news-item"
                    }`}
                    onClick={() => onOpenSwiper(item, section.SectionName)}
                  >
                    {type === "Задачи" ? (
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
                            item.Done && item.ResultType != "8" ? "_done" : ""
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
              : type !== "Сигналы" && (
                  <div className="section_empty">No items</div>
                )}
          </div>
        )}
      </div>
    );
  }
}

export default Section;
