/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useCallback, useEffect, useRef, useState } from "react";
import "./AdditionalInfo.css";
import clickTo1C from "../../../../Utils/clicker";
import { createMarkupUniversal } from "../../../../Utils/createMarkup";
import Button from "../../../../Ui/Button/Button";
import { useAppStore } from "../../../../Core/Store/AppStore";
import { useActionsStore } from "../../../../Core/Store/ActionsStore";
import { IAttachment } from "../../../../Core/Types/AppState";
import { useAppModeStore } from "../../../../Core/Store/AppModeStore";

function AdditionalInfo({ onTaskExecute, taskFulfill }) {
  const { additionalInfo } = useAppStore();
  const { useMockData } = useAppModeStore();

  const { setActions } = useActionsStore();
  const [taskDone, setTaskDone] = useState(additionalInfo?.Done);

  const normalizeImageData = useCallback((data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return [{ address: data }];
    return [];
  }, []);

  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleTouchStart = (e) => {
    setIsScrolling(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Множитель для скорости
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsScrolling(false);
  };

  function clickHandler(id) {
    setActions({
      ImageID: id,
      actionName: "imgClicked",
      objectId: additionalInfo?.ObjectID,
      objectType: additionalInfo?.ObjectType,
      listImageID:
        additionalInfo?.images.length > 1
          ? [...additionalInfo?.images.map((el) => el.ImageID)]
          : [],
      active: true,
    });
    !useMockData && clickTo1C();
  }

  function clickLink(attachment: IAttachment, send, print) {
    const actionName =
      (send && "SendEmail") || (print && "print") || "openFile";
    setActions({
      actionName: actionName,
      printAvailable: attachment.PrintAvailable,
      attachmentId: attachment.ObjectID,
      fileType: attachment.Type,
      objectId: additionalInfo?.ObjectID || additionalInfo?.TaskID,
      objectType: additionalInfo?.ObjectType,
      active: true,
    });
    !useMockData && clickTo1C();
  }

  useEffect(() => {
    setTaskDone(additionalInfo?.Done);
  }, [additionalInfo?.Done, additionalInfo?.DoneDate]);

  const renderImages = () => {
    const images = normalizeImageData(additionalInfo?.images);

    if (images.length === 0) return null;

    return (
      <div className="horizontal-images-container">
        <div
          ref={scrollRef}
          className="image-scroll-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="image-scroll-content">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  src={image.address}
                  alt={`Изображение ${index + 1}`}
                  className="swipe_content_info_image"
                  onClick={() => clickHandler(image?.ImageID)}
                  loading="lazy"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 3 && (
          <div className="scroll-hint">
            <span className="material-symbols-outlined">swipe</span>
            <span>Прокрутите в сторону</span>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () =>
    additionalInfo?.Content && (
      <div
        dangerouslySetInnerHTML={createMarkupUniversal(additionalInfo.Content)}
        className="attachment_content_html"
      />
    );

  const renderAttachments = () => (
    <div className="attachments_container">
      {additionalInfo?.attachments?.map((attachment, index) => (
        <div className="attachment_child" key={index}>
          <div
            className="attachment_child_text"
            onClick={() => clickLink(attachment, "", "")}
          >
            {attachment.ObjectName}
          </div>
          <div className="attachment_image">
            {attachment.PrintAvailable && (
              <Button
                type="report"
                icon={<span className="material-symbols-outlined">print</span>}
                onClick={() => clickLink(attachment, false, true)}
              />
            )}
            {attachment.IsFile && (
              <Button
                type="report"
                icon={<span className="material-symbols-outlined">drafts</span>}
                onClick={() => clickLink(attachment, true, "")}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTags = () => {
    const tags = normalizeImageData(additionalInfo?.tags);
    return (
      <div className="tag_container">
        <div className="tag_content">
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <div className="tag_child" key={index}>
                <img
                  src={tag.imgAddress}
                  alt="tag-image"
                  className="tag_child_image"
                />
                <div>{additionalInfo?.tags[index].TagName}</div>
              </div>
            ))}
        </div>
        <div className="tag_child_date">
          <div>{additionalInfo?.Date}</div>
        </div>
      </div>
    );
  };

  const renderActionButton = () => {
    if (!additionalInfo?.ResultType) return null;

    const isTaskType = ["3", "4", "5", 3, 4, 5].includes(
      additionalInfo?.ResultType,
    );
    const isTaskTypeTwo = ["2", "7", 2, 7].includes(additionalInfo?.ResultType);
    const isInfoAcknowledged = additionalInfo?.ResultType == "8";

    if ((isTaskType && taskDone) || (isTaskTypeTwo && taskDone)) {
      return <Button text="Результат выполнения" onClick={taskFulfill} />;
    } else if (isTaskType) {
      return (
        <Button
          text="Выполнить"
          icon={
            <span className="material-symbols-outlined">
              add_photo_alternate
            </span>
          }
          onClick={taskFulfill}
        />
      );
    } else if (isInfoAcknowledged && taskDone) {
      return <Button text={`Ознакомлен ${additionalInfo?.DoneDate}`} />;
    } else if (isInfoAcknowledged) {
      return (
        <Button
          text="Ознакомиться"
          onClick={() => onTaskExecute(additionalInfo?.TaskID)}
        />
      );
    } else if (taskDone && additionalInfo?.ResultType == "1") {
      return (
        <Button
          text={`Done ${additionalInfo?.DoneDate}`}
          icon={<span className="material-symbols-outlined">check</span>}
          onClick={taskFulfill}
        />
      );
    } else {
      return (
        <Button
          text="Выполнить"
          onClick={() => taskFulfill(additionalInfo?.TaskID)}
        />
      );
    }
  };

  return (
    <>
      <div className="swipe_content_info">
        {renderImages()}
        {renderContent()}
        {renderAttachments()}
        {renderTags()}
      </div>
      <div className="bottom_button_container">{renderActionButton()}</div>
    </>
  );
}

export default AdditionalInfo;
