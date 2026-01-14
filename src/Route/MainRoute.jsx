import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home/Home";
import Layout from "../Layout/Layout";
import Help from "../Page/Help/Help";
import Journals from "../Page/Journals";
import Products from "../Page/Products";
import Instruction from "../Page/Instruction/Instruction";
import Errors from "../Page/Errors/ErrorDisplay";
import { useAppModeStore } from "../Core/Store/AppModeStore";

function MainRoute() {
  const { isDebugMode } = useAppModeStore();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/instructions" element={<Instruction />} />
        <Route path="/help" element={<Help />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/products" element={<Products />} />
        {isDebugMode && <Route path="/errors" element={<Errors />} />}
      </Route>
    </Routes>
  );
}

export default MainRoute;
