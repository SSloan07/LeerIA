import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "../src/app/App.tsx"
import "./index.css";
import "katex/dist/katex.min.css"; // La mierda para que el puto latex sirva 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
