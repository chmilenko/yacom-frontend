import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Page/Home/Home";
import Layout from "../Layout/Layout/Layout";
import Help from "../Page/Help/Help";
import Journals from "../Page/Journals";
import Products from "../Page/Products";
import Instruction from "../Page/Instruction/Instruction";
import Errors from "../Page/Errors/ErrorDisplay";
import CreateTask from "../Page/CreateTaskNews/CreateTask";
import CreateTaskLayout from "../Layout/LayoutCreateTask";
import FullTask from "../Page/CreateTaskNews/FullTask";

function MainRoute() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/instructions" element={<Instruction />} />
        <Route path="/help" element={<Help />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/products" element={<Products />} />
        <Route path="/errors" element={<Errors />} />
      </Route>
      <Route path="/task" element={<CreateTaskLayout />}>
        <Route path="full" element={<FullTask />} />
        <Route path="create" element={<CreateTask />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
