/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useCallback, useEffect, useState } from "react";
import "./AdditionalInfo.css";
import clickTo1C from "../../../../Utils/clicker";
import { createMarkupUniversal } from "../../../../Utils/createMarkup";
import Button from "../../../../Ui/Button/Button";
import { useAppStore } from "../../../../Core/Context/AppStateContext";
import { useActionsStore } from "../../../../Core/Context/ActionsContext";

function AdditionalInfo({ onTaskExecute, taskFulfill }) {
  const { additionalInfo, setListState, developer } = useAppStore();

  const { setActions } = useActionsStore();
  const [taskDone, setTaskDone] = useState(additionalInfo?.Done);

  const normalizeImageData = useCallback((data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return [{ address: data }];
    return [];
  }, []);

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
    !developer && clickTo1C();
  }

  function clickLink(attachment, send, print) {
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
    !developer && clickTo1C();
  }

  useEffect(() => {
    !developer && setListState();
  }, []);

  useEffect(() => {
    setTaskDone(additionalInfo?.Done);
  }, [additionalInfo?.Done, additionalInfo?.DoneDate]);

  const renderImages = () => {
    const images = normalizeImageData(additionalInfo?.images);
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
            onClick={() => clickLink(attachment)}
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
                onClick={() => clickLink(attachment, true)}
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
      additionalInfo?.ResultType
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
