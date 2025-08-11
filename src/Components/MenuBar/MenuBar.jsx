import React, { useContext } from "react";

import "./MenuBar.scss";

import clickTo1C from "../../Utils/clicker";
import { AppStateContext } from "../../Core/Context/AppStateContext";
import { ActionsContext } from "../../Core/Context/ActionsContext";

const menuItems = [
  {
    name: "",
    label: "Главная",
    icon: "home",
    objectId: 1,
    item: "Main",
  },
  {
    name: "instructions",
    label: "Инструкции",
    icon: "assignment",
    objectId: 3,
    item: "Info",
  },
  {
    name: "help",
    label: "Помощь",
    icon: "chat_info",
    objectId: 5,
    item: "Support",
  },
  // {
  //   name: "journals",
  //   label: "Журналы",
  //   icon: "chrome_reader_mode",
  //   objectId: 2,
  //   item: "Journals",
  // },
  // {
  //   name: "products",
  //   label: "Товары",
  //   icon: "shopping_cart",
  //   objectId: 4,
  //   item: "Promo",
  // },
  // {
];

function MenuBar() {
  const { developer, page, setPage } = useContext(AppStateContext);
  const { setActions } = useContext(ActionsContext);

  const handleClickSetPage = (item) => {
    setPage(item.name);
    openChildMenu(item);
  };

  const generateBreadcrumbs = () => {
    return page
      .split("/")
      .filter(Boolean)
      .map((crumb, index) => ({
        name: crumb,
        label: crumb.charAt(0).toUpperCase() + crumb.slice(1),
      }));
  };

  function openChildMenu(item) {
    setActions({
      actionName: "MainMenuClicked",
      currentItem: item.item,
      active: true,
      objectId: item.objectId,
    });
    !developer && clickTo1C();
  }

  return (
    <div>
      <div className="breadcrumbs">
        {generateBreadcrumbs().map((breadcrumb, index) => (
          <span key={index}>
            {index < generateBreadcrumbs().length - 1 && " > "}
          </span>
        ))}
      </div>
      <div className="header-navigation">
        {menuItems.map((item) => (
          <nav key={item.name} onClick={() => handleClickSetPage(item)}>
            <div
              className={`header-navigation-child${
                page === item.name ? "-active" : ""
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  page === item.name && "active"
                }`}
              >
                {item.icon}
              </span>
              <div
                className={`header-navigation-child-text ${
                  page === item.name ? "active_text" : ""
                }`}
              >
                {item.label}
              </div>
            </div>
          </nav>
        ))}
      </div>
    </div>
  );
}

export default MenuBar;
