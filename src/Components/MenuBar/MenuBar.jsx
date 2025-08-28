import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MenuBar.scss";
import clickTo1C from "../../Utils/clicker";
import { AppStateContext } from "../../Core/Context/AppStateContext";
import { ActionsContext } from "../../Core/Context/ActionsContext";
import Button from "../../Ui/Button/Button";

const menuItems = [
  { path: "/", label: "Главная", icon: "house", objectId: 1, item: "Main" },
  {
    path: "/instructions",
    label: "Инструкции",
    icon: "assignment",
    objectId: 3,
    item: "Info",
  },
  {
    path: "/help",
    label: "Помощь",
    icon: "chat_info",
    objectId: 5,
    item: "Support",
  },
];

function MenuBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { developer } = useContext(AppStateContext);
  const { setActions } = useContext(ActionsContext);

  const handleNavigation = (item) => {
    navigate(item.path);
    openChildMenu(item);
  };

  const openChildMenu = (item) => {
    setActions({
      actionName: "MainMenuClicked",
      currentItem: item.item,
      active: true,
      objectId: item.objectId,
    });
    !developer && clickTo1C();
  };

  return (
    <div className="menu-bar-container">
      <nav className="header-navigation" role="navigation">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleNavigation(item)}
            className={`menu-button ${
              location.pathname === item.path ? "active" : ""
            }`}
            type="navigation"
            icon={
              <span className="material-symbols-outlined">{item.icon}</span>
            }
            text={item.label}
            aria-label={item.label}
            aria-current={location.pathname === item.path ? "page" : undefined}
          />
        ))}
      </nav>
    </div>
  );
}

export default MenuBar;
