import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n"; // i18n config
import './index.css'; // global CSS


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
   
      <App />
    
  </React.StrictMode>
);
