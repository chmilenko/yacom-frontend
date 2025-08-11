import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App/App";
import { AppStateProvider } from "./Core/Context/AppStateContext"; 
import { ActionsProvider } from "./Core/Context/ActionsContext"; 
import "./index.scss";

document.addEventListener("DOMContentLoaded", function () {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <Router>
        <AppStateProvider
        >
          <ActionsProvider>
            <App />
          </ActionsProvider>
        </AppStateProvider>
      </Router>
     </React.StrictMode>
  );
});