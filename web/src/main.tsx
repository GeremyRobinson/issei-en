import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// global styles first, so each component's own styles can build on them
import "./styles/global.css";
import { BrowserRouter } from "react-router";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
