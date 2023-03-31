import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./root";
import superjson from "superjson";

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://192.168.1.238:3000/api/trpc" })],
  transformer: superjson,
});
