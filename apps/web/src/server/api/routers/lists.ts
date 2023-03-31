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
  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      // TODO: add "multiple words to array" function, see: https://www.freecodecamp.org/news/fuzzy-string-matching-with-postgresql/
      return ctx.prisma.$queryRaw`
        SELECT *
        FROM "List"
        ORDER BY SIMILARITY(name,'${input.name}') DESC
        LIMIT 5;`;
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.list.findMany({
      take: 50,
    });
  }),
});
