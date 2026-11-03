import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { GuideProvider } from "./context/GuideContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <GuideProvider>
            <App />
          </GuideProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
