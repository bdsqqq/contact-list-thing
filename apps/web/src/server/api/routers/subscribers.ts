import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { csvToJson, mapCsvProperties } from "~/utils/csv";

import { subscriberSchema } from "~/utils/schemas";

export const subscriberRouter = createTRPCRouter({
  create: publicProcedure.input(subscriberSchema).mutation(({ input, ctx }) => {
    return ctx.prisma.subscriber.create({
      data: {
        email: input.email,
        subscribed: input.subscribed,
        name: input.name,
        createdAt: input.createdAt,
        ListId: input.ListId,
      },
    });
  }),
  parseAndCreateMany: publicProcedure
    .input(
      z.object({
        csvData: z.string(),
        overrides: z.object({
          name: z.string().array().optional().or(z.string().optional()),
          email: z.string().array().optional().or(z.string().optional()),
          subscribed: z.string().array().optional().or(z.string().optional()),
          createdAt: z.string().array().optional().or(z.string().optional()),
        }),
        listId: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { csvData, overrides, listId } = input;
      const { columns, data: csvAsJson } = csvToJson(csvData);
      const mappedData = mapCsvProperties(csvAsJson, overrides);

      const now = new Date();

      const parsedData = mappedData.map((subscriber) => ({
        ...subscriber,
        // I'm pretty sure instancing new Strings like this is not the best way to do it but I'm in a hurry and an actual good solution would involve updating the UI in the frontend to ask what string means "true" and "false"
        subscribed: String(subscriber.subscribed).toLowerCase() == "true",
        createdAt: new Date(subscriber.createdAt) || now,
        ListId: listId,
      }));

      return ctx.prisma.subscriber.createMany({
        data: parsedData,
        skipDuplicates: true,
      });
    }),
  createMany: publicProcedure
    .input(z.array(subscriberSchema))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.subscriber.createMany({
        data: input,
        skipDuplicates: true,
      });
    }),
  getByNameOrEmail: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        ListId: z.number().int(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.$queryRaw`
        SELECT 
          *
        FROM "Subscriber"
        WHERE "ListId" = ${input.ListId} AND
        SIMILARITY(name,${input.name}) + SIMILARITY(email,${input.email}) >= 0.1
        ORDER BY SIMILARITY(name,${input.name}) + SIMILARITY(email, ${input.email}) DESC
        LIMIT 50;`;
    }),
  getAllFromList: publicProcedure
    .input(
      z.object({
        ListId: z.number().int(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.subscriber.findMany({
        where: {
          ListId: input.ListId,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subscriber.findMany();
  }),
});
