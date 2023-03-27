import { createTRPCRouter } from "~/server/api/trpc";
import { listRouter } from "~/server/api/routers/lists";
import { subscriberRouter } from "~/server/api/routers/subscribers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  list: listRouter,
  subscriber: subscriberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
