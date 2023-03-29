import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.list.create({
        data: {
          name: input.name,
        },
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.list.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.list.findMany({
      take: 10,
    });
  }),
});
