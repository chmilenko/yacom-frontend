import React, { useEffect, useState } from "react";
import { useAppModeStore } from "../../../Core/Store/AppModeStore";
import { useCreateTaskStore } from "../../../Core/Store/CreateTaskNews";
import Button from "../../../Ui/Button/Button";
import "./DetailedNews.scss";
import { IAttachment, INews, ITag } from "../../../Core/Types/DetailedNews";
import { useActionsStore } from "../../../Core/Store/ActionsStore";
import clickTo1C from "../../../Utils/clicker";

const createMarkup = (htmlContent: string) => {
  return { __html: htmlContent };
};

function DetailedNews() {
  const { useMockData } = useAppModeStore();
  const { setFullNews, fullNews } = useCreateTaskStore();
  const { setActions, actions } = useActionsStore();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    useMockData && setFullNews("");
    initMonths();
  }, []);

  const initMonths = () => {
    const monthsArray: string[] = [];

    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArray.push(formatMonthFor1C(date));
    }

    setMonths(monthsArray);
  };

  const formatMonthFor1C = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}${month}${day}`;
  };
  console.log(actions);

  const formatMonthForDisplay = (yyyyMMdd: string): string => {
    if (!yyyyMMdd || yyyyMMdd.length !== 8) {
      return "текущий месяц";
    }

    // Извлекаем месяц из "20260101"
    const monthCode = yyyyMMdd.slice(4, 6); // "01"
    const monthNumber = parseInt(monthCode, 10) - 1; // 0 для января

    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    return monthNames[monthNumber] || "текущий месяц";
  };

  const getCurrentMonthName = (): string => {
    if (months.length === 0) return "текущий месяц";

    const currentMonthCode = months[currentMonthIndex];
    return formatMonthForDisplay(currentMonthCode);
  };

  const handleMonthButtonClick = () => {
    if (months.length === 0) return;

    const monthFor1C = months[currentMonthIndex];

    setActions({
      actionName: "clickElement",
      active: true,
      currentForm: "Новости",
      month: monthFor1C,
      filter: false,
    });

    if (!useMockData) {
      clickTo1C();
    }

    if (currentMonthIndex + 1 < months.length) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handleAttachmentClick = (
    attachment: IAttachment,
    isFile: boolean,
    isPrint: boolean
  ) => {
    console.log("Клик по вложению:", {
      attachment,
      isFile,
      isPrint,
    });
  };

  const getButtonText = (): string => {
    const currentMonth = getCurrentMonthName();
    return `Раннее за ${currentMonth}`;
  };

  const handleTagClick = (tag: ITag) => {
    console.log("Клик по тегу:", tag);
  };

  const isNewNews = (news: INews) => {
    return news.New === true;
  };

  return (
    <div className="detailed-news-container">
      <div className="detailed-news-header">
        <h1>Все новости</h1>
        <div className="news-count">
          Всего новостей: <strong>{fullNews?.length}</strong>
        </div>
      </div>

      <div className="news-grid">
        {fullNews?.map((news) => (
          <div
            key={news.ObjectID}
            className={`news-card ${
              news?.new && isNewNews(news) ? "news-card-new" : ""
            }`}
          >
            {news?.new && isNewNews(news) && (
              <div className="news-badge">
                <span className="badge-text">НОВОЕ</span>
              </div>
            )}
            <div className="news-card-header">
              <h2 className="news-title">{news?.Title}</h2>
            </div>
            {news?.Images && news?.Images?.length > 0 && (
              <div className="news-images">
                <div className="images-grid">
                  {news.Images.map((image, index) => (
                    <div key={image?.ImageID || index} className="image-item">
                      <img
                        src={image?.Адрес}
                        alt={`Изображение ${index + 1}`}
                        className="news-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {news?.Content && (
              <div className="news-content">
                <div
                  className="news-html-content"
                  dangerouslySetInnerHTML={createMarkup(news?.Content)}
                />
              </div>
            )}
            {news?.Attachments && news?.Attachments?.length > 0 && (
              <div className="news-attachments">
                <div className="attachments-list">
                  {news?.Attachments?.map((attachment, index) => (
                    <div
                      className="attachment-item"
                      key={attachment.ObjectID || index}
                    >
                      <div className="attachment-info">
                        <span className="material-symbols-outlined attachment-icon">
                          {attachment.IsFile ? "draft" : "description"}
                        </span>
                        <div className="attachment-details">
                          <div
                            className="attachment-name"
                            onClick={() =>
                              handleAttachmentClick(attachment, false, false)
                            }
                          >
                            {attachment.ObjectName}
                          </div>
                        </div>
                      </div>
                      <div className="attachment-actions">
                        {attachment.PrintAvailable && (
                          <Button
                            type="secondary"
                            icon={
                              <span className="material-symbols-outlined">
                                print
                              </span>
                            }
                            onClick={() =>
                              handleAttachmentClick(attachment, false, true)
                            }
                            className="attachment-button"
                            text="Печать"
                          />
                        )}
                        {attachment.IsFile && (
                          <Button
                            type="secondary"
                            icon={
                              <span className="material-symbols-outlined">
                                download
                              </span>
                            }
                            onClick={() =>
                              handleAttachmentClick(attachment, true, false)
                            }
                            className="attachment-button"
                            text="Скачать"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Теги */}
            {news?.Tags && news?.Tags?.length > 0 && (
              <div className="news-tags">
                <div className="tags-header">
                  <span className="material-symbols-outlined">tag</span>
                  <span>Теги</span>
                </div>
                <div className="tags-list">
                  {news?.Tags?.map((tag, index) => (
                    <div
                      className="tag-item"
                      key={tag.TagName || index}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.imgAddress && (
                        <img
                          src={tag.imgAddress}
                          alt={tag.TagName}
                          className="tag-image"
                        />
                      )}
                      <span className="tag-name">{tag.TagName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="task_list_action">
        <Button text={getButtonText()} onClick={handleMonthButtonClick} />
      </div>
    </div>
  );
}

export default DetailedNews;
