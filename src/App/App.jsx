import { useEffect } from "react";
import PageComponentInitializer from "../Components/PageComponentInitializer";
import MainRoute from "../Route/MainRoute";
import { useLocation } from "react-router-dom";

function App() {
  return (
    <>
      <PageComponentInitializer />
      <MainRoute />
    </>
  );
}

export default App;
