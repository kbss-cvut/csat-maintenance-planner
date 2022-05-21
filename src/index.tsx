import React from "react";
import ReactDOM from "react-dom";
import PlanManager from "./components/PlanManager";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Constants from "./utils/Constants";

import "../src/styles/global.css";

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter basename={Constants.BASENAME}>
      <Routes>
        <Route path="/*" element={<PlanManager />} />
      </Routes>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById("root")
);
