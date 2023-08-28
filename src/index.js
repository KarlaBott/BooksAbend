import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Link } from "react-router-dom";

import { App } from "./components";
// css stylesheets can be created for each component
// place them in the src/style directory, and import them like this:
import "./style/index.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
