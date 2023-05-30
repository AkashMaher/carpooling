import { QueryClient } from "react-query";
import { toast } from "react-toastify";

// Handles errors for all queries and mutations made via react-query
function queryErrorHandler(error: unknown): void {
  const title =
    error instanceof Error ? error.message : "error connecting to server";
  toast(title, {
    hideProgressBar: true,
    autoClose: 3000,
    type: "error",
    position: "top-right",
    theme: "dark",
  });
}

const queryClientConfig = {
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      retry: 3,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
};

export function generateQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}

export const queryClient = generateQueryClient();
