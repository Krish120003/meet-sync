import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(
      z.object({
        name: z.string(),
        startMin: z.number().min(0).max(24),
        endMin: z.number().min(0).max(24),
        dates: z.array(z.date()).min(1),
      }),
    )
    .output(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // use input to create event
      const startTime = input.startMin;
      const endTime = input.endMin;

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
  getEvent: publicProcedure
    .input(z.string())
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        startMin: z.number(),
        endMin: z.number(),
        dates: z.array(z.date()),
      }),
    )
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.event.findUnique({
        where: {
          id: input,
        },
        include: {
          dates: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const result = {
        id: event.id,
        name: event.name,
        startMin: event.startMin,
        endMin: event.endMin,
        dates: event.dates.map((date) => date.date as Date),
      };

      return result;
    }),
});
