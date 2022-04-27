import React from "react";
import ReactDOM from "react-dom";

import "../src/styles/global.css";
import Dashboard from "./components/Dashboard";

ReactDOM.render(
  <React.Fragment>
    <Dashboard />
  </React.Fragment>,
  document.getElementById("root")
);
