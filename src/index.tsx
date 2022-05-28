import React from "react";
import ReactDOM from "react-dom";
import PlanManager from "./components/PlanManager";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./styles/global.scss";

/**
 * React Router v6 with relative path deployment
 * https://stackoverflow.com/questions/57572259/react-router-with-relative-path-deployment/67064651#67064651
 */
const basename = window.location.pathname.replace(/(\/[^/]+)$/, "");

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/*" element={<PlanManager basename={basename} />} />
      </Routes>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById("root")
);
