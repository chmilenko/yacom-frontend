import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Ui/Button/Button";

function LayoutButtons() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreatePage = location.pathname === "/task/create";
  const isFullPage = location.pathname === "/task/full";

  if (isCreatePage) {
    return (
      <>
        <Button onClick={() => navigate(-1)} type="secondary" text="Отмена" />
        <Button
          onClick={() => console.log("Создать задачу")}
          type="primary"
          text="Создать задачу"
        />
      </>
    );
  }

  if (isFullPage) {
    return (
      <>
        <Button onClick={() => navigate(-1)} type="navigation" text="Назад" />
        <Button
          onClick={() => navigate("/task/create")}
          type="navigation"
          text="Создать"
        />
        <Button
          onClick={() => console.log("Перейти к отчету")}
          type="navigation"
          text="Отчет"
        />
      </>
    );
  }

  return null;
}

export default LayoutButtons;
