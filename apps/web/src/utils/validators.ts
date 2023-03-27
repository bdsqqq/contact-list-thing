import { z } from "zod";

export const subscriberSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  subscribed: z.boolean(),
  createdAt: z.date().optional(),
  // [ ] Daily: TODO: Should listId live here? It feels right to add(subscribers) but add(subscribers, listId) makes sense too
  ListId: z.number().int(),
});
