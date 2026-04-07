import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./shared/styles/global.scss"; // если есть

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);