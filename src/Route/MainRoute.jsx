import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home/Home";
import Layout from "../Layout/Layout";
import Instruction from "../Page/Instruction/Instruction";
import Help from "../Page/Help/Help";
import { AppStateContext } from "../Core/Context/AppStateContext";

function MainRoute() {
  const { page } = useContext(AppStateContext);
  return (
    <Routes>
      <Route element={<Layout />}>
        {page === "" && (
          <Route
            path="/"
            element={
              <Home
                ref={(pageComponent) => {
                  window.pageComponent = pageComponent;
                }}
              />
            }
          />
        )}
        {page === "instructions" && (
          <Route path="/" element={<Instruction />} />
        )}
        {page === "help" && <Route path="/" element={<Help />} />}
      </Route>
    </Routes>
  );
}

export default MainRoute;
