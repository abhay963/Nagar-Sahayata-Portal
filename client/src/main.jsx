// Import React
import React from "react";

// Import React DOM
import ReactDOM from "react-dom/client";

// Import main App component
import App from "./App";

// Import i18n configuration
import "./i18n";

// Import global CSS
import "./index.css";


// ================= ROOT ELEMENT =================

// Get root div from index.html
const root = ReactDOM.createRoot(
  document.getElementById("root")
);


// ================= RENDER APP =================

root.render(

  // StrictMode helps detect React issues
  <React.StrictMode>

    <App />

  </React.StrictMode>
);