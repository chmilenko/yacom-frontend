import { useLocation, useNavigate } from "react-router-dom";
import "./MenuBar.scss";
import clickTo1C from "../../Utils/clicker";
import { useAppStore } from "../../Core/Store/AppStore";
import { useActionsStore } from "../../Core/Store/ActionsStore";
import Button from "../../Ui/Button/Button";
import { useAppModeStore } from "../../Core/Store/AppModeStore";

function MenuBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { menuItems } = useAppStore();
  const { setActions } = useActionsStore();
  const { useMockData } = useAppModeStore();

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
    !useMockData && clickTo1C();
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
