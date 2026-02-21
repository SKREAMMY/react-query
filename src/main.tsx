import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryCliennt = new QueryClient();

// {
//   defaultOptions: { queries: { staleTime: 1000 * 60 } },
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryCliennt}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
