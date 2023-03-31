import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./root";
import superjson from "superjson";

import { env } from "~/env.mjs";

// TODO: thers a NEXT_env_url thingy I could use here I think
const getUrl = () => {
  if (env.NODE_ENV === "development") {
    return "http://192.168.1.238:3000/api/trpc";
  } else {
    return "http://contact-list-thing-web.vercel.app/api/trpc";
  }
};

export const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: getUrl() })],
  transformer: superjson,
});
