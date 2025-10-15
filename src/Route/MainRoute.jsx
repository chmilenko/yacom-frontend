import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home/Home";
import Layout from "../Layout/Layout";
import Help from "../Page/Help/Help";
import Journals from "../Page/Journals";
import Products from "../Page/Products";
import Instruction from "../Page/Instruction/Instruction";

function MainRoute() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/instructions" element={<Instruction />} />
        <Route path="/help" element={<Help />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/products" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
