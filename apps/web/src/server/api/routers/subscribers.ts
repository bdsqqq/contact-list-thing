import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const subscriberSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  subscribed: z.boolean(),
  createdAt: z.date().optional(),
  ListId: z.number().int(),
});

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
  createMultiple: publicProcedure
    .input(z.array(subscriberSchema).nonempty())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.subscriber.createMany({
        data: input,
      });
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
