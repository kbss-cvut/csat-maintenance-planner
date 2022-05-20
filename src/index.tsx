import React from "react";
import ReactDOM from "react-dom";
import PlanManager from "./components/PlanManager";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "../src/styles/global.css";

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PlanManager />} />
      </Routes>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById("root")
);
