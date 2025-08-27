import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home/Home";
import Layout from "../Layout/Layout";
import Instruction from "../Page/Instruction/Instruction";
import Help from "../Page/Help/Help";

function MainRoute() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/instructions" element={<Instruction />} />
        <Route path="/help" element={<Help />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
