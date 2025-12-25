/* eslint-disable no-loop-func */
import React, { useContext, useEffect, useState } from "react";
import "./Instructions.scss";
import { AppStateContext, useAppStore } from "../../Core/Store/AppStateStore";
import { ActionsContext, useActionsStore } from "../../Core/Store/ActionsStore";
import Input from "../../Ui/Input/Input";
import clickTo1C from "../../Utils/clicker";
import InstructionItem from "./InstructionItem";

function Instruction() {
  const { instructions, setInstructionsState, developer } = useAppStore();
  const { setActions } = useActionsStore();

  const [openIndexes, setOpenIndexes] = useState({});
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setInstructionsState();
  }, [setInstructionsState]);

  const sendByEmail = (id) => {
    setActions({ id, actionName: "sendByEmail", active: true });
    !developer && clickTo1C();
  };

  const sendByPrint = (id) => {
    setActions({ id, actionName: "sendByPrint", active: true });
    !developer && clickTo1C();
  };

  const openInstruction = (id) => {
    setActions({ id, actionName: "openInstruction", active: true });
    !developer && clickTo1C();
  };

  function collectDescendantIds(items, parentId) {
    let ids = [];
    for (const item of items) {
      if (item.id === parentId) {
        function recurse(children) {
          for (const ch of children) {
            ids.push(ch.id);
            if (ch.Строки && ch.Строки.length > 0) recurse(ch.Строки);
          }
        }
        recurse(item.Строки || []);
        break;
      }
      if (item.Строки && item.Строки.length > 0) {
        ids = ids.concat(collectDescendantIds(item.Строки, parentId));
      }
    }
    return ids;
  }

  const toggleChild = (id) => {
    setOpenIndexes((prev) => {
      const isOpen = prev[id];
      if (isOpen) {
        const descendants = collectDescendantIds(instructions, id);
        const newIndexes = { ...prev };
        [id, ...descendants].forEach((descId) => {
          delete newIndexes[descId];
        });
        return newIndexes;
      } else {
        return { ...prev, [id]: true };
      }
    });
  };

  const closeAdditional = () => {
    setOpenIndexes({});
  };

  const highlightText = (title, id) => {
    if (!filterText) return title;
    const regex = new RegExp(`(${filterText})`, "gi");
    const parts = title.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === filterText.toLowerCase() ? (
            <span
              onClick={() => openInstruction(id)}
              key={i}
              style={{ color: "red" }}
            >
              {part}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </span>
    );
  };

  const filterInstructions = (items, filterText) => {
    if (!filterText) return items;

    return items
      .map((item) => {
        const filteredChildren = filterInstructions(item.Строки, filterText);
        const isMatch = item.Наименование
          .toLowerCase()
          .includes(filterText.toLowerCase());

        if (isMatch || filteredChildren.length > 0) {
          return {
            ...item,
            Строки: isMatch ? item.Строки : filteredChildren,
            isSearchMatch: isMatch,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    if (!filterText) {
      setOpenIndexes({});
      return;
    }

    const idsToOpen = new Set();

    const findIdsToOpen = (items) => {
      items.forEach((item) => {
        const isMatch = item.Наименование
          .toLowerCase()
          .includes(filterText.toLowerCase());
        const hasChildren = item.Строки && item.Строки.length > 0;

        if (isMatch) {
          let parent = findParent(item.id, instructions);
          while (parent) {
            idsToOpen.add(parent.id);
            parent = findParent(parent.id, instructions);
          }
        }

        if (hasChildren) {
          const hasMatchInChildren = findIdsToOpen(item.Строки);
          if (hasMatchInChildren) {
            idsToOpen.add(item.id);
          }
        }
      });
    };

    findIdsToOpen(instructions);

    setOpenIndexes((prev) => {
      const newOpenIndexes = { ...prev };
      idsToOpen.forEach((id) => {
        newOpenIndexes[id] = true;
      });
      return newOpenIndexes;
    });
  }, [filterText, instructions]);

  const findParent = (childId, items, parent = null) => {
    for (const item of items) {
      if (item.id === childId) return parent;
      if (item.Строки && item.Строки.length > 0) {
        const found = findParent(childId, item.Строки, item);
        if (found) return found;
      }
    }
    return null;
  };

  const renderInstructions = (items) =>
    items.map((item) => {
      const hasChildren = item.Строки.length > 0;
      return (
        <InstructionItem
          key={item.id}
          item={item}
          hasChildren={hasChildren}
          open={openIndexes[item.id]}
          onToggleChild={toggleChild}
          onOpenInstruction={openInstruction}
          highlightText={highlightText}
          openIndexes={openIndexes}
          renderChildren={renderInstructions}
          sendByEmail={sendByEmail}
          sendByPrint={sendByPrint}
        />
      );
    });

  const filteredInstructions = filterInstructions(instructions, filterText);

  return (
    <div className="instructions">
      <div className="instructions_filter">
        <Input
          value={filterText}
          onChange={setFilterText}
          placeholder="Фильтр по заголовкам..."
          additionalFunc={closeAdditional}
        />
      </div>
      <div className="instructions_container">
        {renderInstructions(filteredInstructions)}
      </div>
    </div>
  );
}
export default Instruction;
