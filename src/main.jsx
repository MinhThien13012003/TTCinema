import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import theme from "./theme/index.js";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SearchProvider } from "./contexts/SearchContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchProvider>
        <App />
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>
);
