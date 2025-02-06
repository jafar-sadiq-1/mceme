import React from "react";
import { createRoot } from "react-dom/client"; // ✅ Correct import
import ContextProvider from "./AppContext/ContextProvider"; // ✅ Correct import
import App from "./App"; // ✅ Correct import


const root = createRoot(document.getElementById("root")); // ✅ Use createRoot properly
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);
