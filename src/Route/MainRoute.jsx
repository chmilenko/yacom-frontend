import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout/Main/Layout";
import CreateTaskLayout from "../Layout/DetailtTaskNews/LayoutCreateTask";

import Home from "../Page/Home/Home";
import Help from "../Page/Help/Help";
import Journals from "../Page/Journals";
import Products from "../Page/Products";
import Instruction from "../Page/Instruction/Instruction";
import Errors from "../Page/Errors/ErrorDisplay";

import DetailedTask from "../Page/DetailedTaskNews/Task/Detailed/DetailedTask";
import CreateTask from "../Page/DetailedTaskNews/Task/Create/CreateTask";
import DetailedNews from "../Page/DetailedTaskNews/News/DetailedNews";
import DetailedFullTask from "../Page/DetailedTaskNews/Task/DetailedFull/DetailedFullTask";

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
      <Route path="/" element={<CreateTaskLayout />}>
        <Route path="/task/full" element={<DetailedTask />} />
        <Route path="/task/full/:id" element={<DetailedFullTask />} />
        <Route path="/task/create" element={<CreateTask />} />
        <Route path="/news/full" element={<DetailedNews />} />
      </Route>
    </Routes>
  );
}

export default MainRoute;
