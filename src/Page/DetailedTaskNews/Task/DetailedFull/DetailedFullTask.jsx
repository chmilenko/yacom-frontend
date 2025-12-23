import React, { useEffect, useState } from "react";
import { useCreateTaskNews } from "../../../../Core/Context/CreateTaskNews";
import "./DetailedFullTask.scss";
import { useActionsStore } from "../../../../Core/Context/ActionsContext";
import Button from "../../../../Ui/Button/Button";
import clickTo1C from "../../../../Utils/clicker";
import { useParams } from "react-router-dom";
import { createMarkupUniversal } from "../../../../Utils/createMarkup";

function DetailedFullTask() {
  const { oneTask, developer, getOneTask, getFullTaskDeveloper } =
    useCreateTaskNews();
  const { setActions } = useActionsStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();

  const normalizeImageData = (images) => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((img) => ({
      address: img.address || "",
      ImageID: img.ImageID || "",
    }));
  };

  useEffect(() => {
    getOneTask();
    developer && getFullTaskDeveloper(Number(params.id));
  }, []);

  const renderImages = () => {
    const images = normalizeImageData(oneTask?.images);
    return (
      images.length > 0 && (
        <div className="image-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.address}
              alt={`Image ${index + 1}`}
              className="swipe_content_info_image"
              onClick={() => clickHandler(image?.ImageID)}
            />
          ))}
        </div>
      )
    );
  };

  const clickHandler = (imageId) => {
    console.log("Clicked image ID:", imageId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  function clickLink(attachment, send, print) {
    const actionName =
      (send && "SendEmail") || (print && "print") || "openFile";
    setActions({
      actionName: actionName,
      printAvailable: attachment.PrintAvailable,
      attachmentId: attachment.ObjectID,
      fileType: attachment.Type,
      objectId: oneTask?.ObjectID || oneTask?.TaskID,
      objectType: oneTask?.ObjectType,
      active: true,
    });
    !developer && clickTo1C();
  }

  if (!oneTask) {
    return (
      <div className="detailed-task">
        <div className="task-not-found">
          <p>Задача не найдена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-task">
      <div className="task-header">
        <div className="task-title">{oneTask.title || "Без названия"}</div>
        <button
          className={`expand-button ${isExpanded ? "expanded" : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Свернуть" : "Раскрыть"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <hr className="divider" />

      {!isExpanded && (
        <>
          <div className="task-content">
            <div
              dangerouslySetInnerHTML={createMarkupUniversal(oneTask.Content)}
              className="attachment_content_html"
            />
          </div>

          {oneTask.attachments && oneTask.attachments.length > 0 && (
            <div className="attachments-section">
              <h3 className="attachments-title">Прикрепленные файлы</h3>
              <div className="attachments-list">
                {oneTask.attachments.map((attachment, index) => (
                  <div className="attachment_child" key={index}>
                    <div
                      className="attachment_child_text"
                      onClick={() => clickLink(attachment)}
                    >
                      {attachment.ObjectName}
                    </div>
                    <div className="attachment_image">
                      {attachment.PrintAvailable && (
                        <Button
                          type="report"
                          icon={
                            <span className="material-symbols-outlined">
                              print
                            </span>
                          }
                          onClick={() => clickLink(attachment, false, true)}
                        />
                      )}
                      {attachment.IsFile && (
                        <Button
                          type="report"
                          icon={
                            <span className="material-symbols-outlined">
                              drafts
                            </span>
                          }
                          onClick={() => clickLink(attachment, true)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderImages()}
        </>
      )}

      {isExpanded && (
        <div className="additional-info">
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Раздел задачи:</span>
              <span className="info-value">
                {oneTask.tagTitle || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Номер:</span>
              <span className="info-value">
                {oneTask.number || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Дата:</span>
              <span className="info-value">{formatDate(oneTask.date)}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Выполнить до:</span>
              <span className="info-value deadline">
                {formatDate(oneTask.deadline)}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Тип задачи:</span>
              <span className="info-value">
                {oneTask.typeTask || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Тип результата:</span>
              <span className="info-value">
                {oneTask.resultType || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Постановщик:</span>
              <span className="info-value">
                {oneTask.creator || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Ответственный:</span>
              <span className="info-value">
                {oneTask.Responsible || "Не указано"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Дата выполнения:</span>
              <span className="info-value">{formatDate(oneTask.DoneDate)}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Исполнитель:</span>
              <span className="info-value">
                {oneTask.Executor || "Не указано"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedFullTask;
