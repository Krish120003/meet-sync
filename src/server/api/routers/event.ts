import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventInput = z.object({
  name: z.string(),
  startMin: z.date(),
  endMin: z.date(),
  dates: z.array(z.date()).min(1),
});

export const eventRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(eventInput)
    .output(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // use input to create event
      const startTime = input.startMin.getUTCHours();
      const endTime = input.endMin.getUTCHours();

      if (startTime >= endTime) {
        // we cannot create an event that ends before it starts
        throw new Error("Event cannot end before it starts");
      }

      const event = await ctx.db.event.create({
        data: {
          name: input.name,
          startMin: startTime,
          endMin: endTime,
        },
      });

      await ctx.db.date.createMany({
        data: input.dates.map((date) => ({
          date,
          eventId: event.id,
        })),
      });

      return {
        id: event.id,
      };
    }),
});
