import React from "react";
import Button from "../../Ui/Button/Button";

function InstructionItem({
  item,
  hasChildren,
  open,
  onToggleChild,
  onOpenInstruction,
  highlightText,
  openIndexes,
  renderChildren,
  sendByEmail,
  sendByPrint,
}) {
  return (
    <div className="instructions_content" key={item.id}>
      <div className="instructions_child_wrapper">
        <div
          className={`instructions_child ${!hasChildren && "no_children"}`}
          onClick={(e) => {
            if (item.isSearchMatch || hasChildren) {
              onToggleChild(item.id);
              e.stopPropagation();
            }
          }}
        >
          <div className="instructions_child_content">
            {hasChildren ? (
              <span className="material-symbols-outlined">folder_open</span>
            ) : (
              <div className="circle"></div>
            )}

            <div
              className={`instructions_child_title ${
                !hasChildren && "no_children"
              }`}
              onClick={() => !hasChildren && onOpenInstruction(item.id)}
            >
              {highlightText(item.Наименование, item.id)}
            </div>
          </div>
          <div className="instructions_actions">
            {item.AttachedFilesStatus > 1 && (
              <div>
                <Button
                  type="report"
                  icon={
                    <span className="material-symbols-outlined">print</span>
                  }
                  onClick={() => sendByPrint(item.id)}
                />
              </div>
            )}
            {item.AttachedFilesStatus > 0 && (
              <div>
                <Button
                  type="report"
                  icon={
                    <span className="material-symbols-outlined">drafts</span>
                  }
                  onClick={() => sendByEmail(item.id)}
                />
              </div>
            )}
          </div>
          {hasChildren && (
            <span className="material-symbols-outlined">
              {openIndexes[item.id]
                ? "keyboard_arrow_up"
                : "keyboard_arrow_down"}
            </span>
          )}
        </div>
      </div>
      {open && hasChildren && (
        <div className="instructions_sub_content">
          {renderChildren(item.Строки)}
        </div>
      )}
    </div>
  );
}

export default InstructionItem;
